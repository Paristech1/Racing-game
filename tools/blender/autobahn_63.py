"""AFTERHOURS — AUTOBAHN 63: an original four-door GT, built in Blender (bpy).
Game coords: x right, y up, z forward (nose +z). Blender: (x, -z, y). Wheels (BODIES.autobahn): x ±.9, z ±1.5, r .37.
CLI:  python3 autobahn_63.py --out autobahn_63.glb [--render prefix]
Live: paste into Blender (MCP) — builds into a new 'Autobahn 63' scene.
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

CLI = '--out' in sys.argv
OUT = sys.argv[sys.argv.index('--out') + 1] if CLI else None
RENDER = sys.argv[sys.argv.index('--render') + 1] if '--render' in sys.argv else None

def G(x, y, z): return Vector((x, -z, y))
def clamp(v, a, b): return max(a, min(b, v))
def lerp(a, b, t): return a + (b - a) * t
def kf(keys, z):
    i = 0
    while i < len(keys) - 2 and z > keys[i + 1][0]: i += 1
    p0 = keys[max(0, i - 1)]; p1 = keys[i]; p2 = keys[i + 1]; p3 = keys[min(len(keys) - 1, i + 2)]
    t = clamp((z - p1[0]) / (p2[0] - p1[0]), 0, 1); t2 = t * t; t3 = t2 * t
    return .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)

if CLI:
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
    def DG(): return bpy.context.evaluated_depsgraph_get()
else:
    old = bpy.data.scenes.get('Autobahn 63')
    if old:
        for o in list(old.objects): bpy.data.objects.remove(o)
        for c in list(old.collection.children): bpy.data.collections.remove(c)
        bpy.data.scenes.remove(old)
    scene = bpy.data.scenes.new('Autobahn 63')
    for w in bpy.context.window_manager.windows: w.scene = scene
    VL = scene.view_layers[0]
    def DG():
        d = VL.depsgraph; d.update(); return d

def mat(name, col, metal=0., rough=.5, emit=None, coat=False):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if coat and 'Coat Weight' in b.inputs: b.inputs['Coat Weight'].default_value = 1.; b.inputs['Coat Roughness'].default_value = .02
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = 6.
    return m
M = {'PAINT': mat('PAINT', (.012, .045, .28), .7, .18, coat=True), 'CARBON': mat('CARBON', (.02, .021, .024), .1, .35, coat=True),
     'GLASS': mat('GLASS', (.005, .007, .01), .3, .03, coat=True), 'GLOSSBLACK': mat('GLOSSBLACK', (.006, .007, .008), .3, .1, coat=True),
     'GAP': mat('GAP', (.002, .002, .002), 0., .9), 'HEAD': mat('HEAD', (.9, .95, 1.), 0., .3, emit=(.85, .92, 1.)),
     'TAIL': mat('TAIL', (1., .05, .05), 0., .3, emit=(1., .04, .06)), 'CHROME': mat('CHROME', (.8, .82, .85), 1., .12),
     'LENS': mat('LENS', (.9, .9, .9), 0., .02), 'SATIN': mat('SATIN', (.25, .26, .28), .9, .35)}

def fixn(ob):
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
def new_obj(name, verts, faces, m, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.materials.append(M[m])
    if smooth: me.shade_smooth()
    return ob
def loft(name, stations, m, smooth=True, cap=True):
    verts = [v for r in stations for v in r]; n = len(stations[0]); S = len(stations); faces = []
    for i in range(S - 1):
        for j in range(n):
            a = i * n + j; b = i * n + (j + 1) % n; c = (i + 1) * n + (j + 1) % n; d = (i + 1) * n + j; faces.append((a, b, c, d))
    if cap:
        for i, flip in ((0, True), (S - 1, False)):
            ring = list(range(i * n, i * n + n)); faces.append(tuple(reversed(ring)) if flip else tuple(ring))
    ob = new_obj(name, verts, faces, m, smooth); fixn(ob); return ob
def mirror_ring(half): return half + [(-x, y) for (x, y) in reversed(half[1:-1])]
def sharpen(ob, deg):
    bm = bmesh.new(); bm.from_mesh(ob.data); lim = math.radians(deg)
    for f in bm.faces: f.smooth = True
    for e in bm.edges: e.smooth = len(e.link_faces) == 2 and e.calc_face_angle(0) <= lim and e.link_faces[0].material_index == e.link_faces[1].material_index
    bm.to_mesh(ob.data); bm.free()

# ================================================================ BODY
# Plan/elevation keys. The body side is taut and slightly convex, with a crisp shoulder crease (YS) that kicks up over the rear
# wheel into wide hips; a flat shoulder plane runs from the crease up to the fender crown (YF), then a long, low hood / rear deck (YD).
Z0, Z1, WB = -2.56, 2.52, 1.5
HS = [[-2.56, .86], [-2.35, .98], [-1.95, 1.03], [-1.5, 1.045], [-1.0, 1.015], [-.3, .975], [.5, .975], [1.1, .99], [1.5, 1.0], [1.95, .985], [2.3, .93], [2.52, .8]]
YS = [[-2.56, .66], [-2.2, .73], [-1.55, .77], [-.9, .72], [0, .69], [.9, .68], [1.5, .68], [2.1, .64], [2.52, .56]]
YB = [[-2.56, .36], [-2.35, .22], [-2.05, .19], [2.05, .19], [2.35, .22], [2.52, .3]]
YF = [[-2.56, .87], [-2.2, .93], [-1.55, .98], [-1.0, .95], [-.2, .9], [.7, .87], [1.3, .855], [1.9, .8], [2.3, .7], [2.52, .6]]
YD = [[-2.56, .86], [-2.42, .885], [-2.25, .88], [-1.8, .9], [-.2, .88], [1.0, .82], [1.6, .79], [2.1, .72], [2.4, .64], [2.52, .58]]
XF = .8
def section(z):
    hs = kf(HS, z); ys = kf(YS, z); yb = kf(YB, z); yf = max(kf(YF, z), ys + .08); yd = min(kf(YD, z), yf + .01)
    tn = clamp((z - (Z1 - .34)) / .34, 0, 1); tr = clamp(((Z0 + .26) - z) / .26, 0, 1)
    e = 1 - math.sqrt(max(0., 1 - tn * tn)); er = 1 - math.sqrt(max(0., 1 - tr * tr))
    hs *= 1 - .2 * e - .1 * er; yb += .06 * e + .05 * er; ys -= .03 * e; yf -= .06 * e + .02 * er; yd -= .05 * e + .02 * er
    hl = hs - .09; xf = hs * XF
    # lower: flat floor, sill tuck-under, a slightly convex body side up to the crease, crisp crease, shoulder plane, crown, deck
    half = [(0, yb), (hl * .9, yb), (hl - .01, yb + .035), (hl + .03, yb + .09),
            (hs - .025, lerp(yb + .09, ys, .35)), (hs - .006, lerp(yb + .09, ys, .7)), (hs, ys - .012),
            (hs - .014, ys + .004),                                                          # crease (sharp)
            (lerp(hs, xf, .45), lerp(ys, yf, .62)), (lerp(hs, xf, .8), yf - .004), (xf, yf),
            (lerp(xf, .3, .45), lerp(yf, yd, .72)), (.3, yd + .006), (.14, yd + .002), (0, yd)]
    return half
stations = []
for i in range(170):
    t = i / 169; t = .9 * t + .1 * (.5 - .5 * math.cos(math.pi * t)); z = Z0 + (Z1 - Z0) * t
    stations.append([G(x, y, z) for x, y in mirror_ring(section(z))])
body = loft('Body', stations, 'PAINT')

# ---------------- cutters: arches, grille and intakes, lamp recesses, panel gaps, rear diffuser cavity
cut_objs = []
def cutter(ob, m):
    ob.data.materials.clear(); ob.data.materials.append(M[m]); ob.hide_render = True; cut_objs.append(ob); return ob
def prism(name, poly_zy, x0, x1, m='GAP'):
    n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)
def front_prism(name, poly_xy, z0, z1, m='GAP'):  # face-on polygon (x, y) extruded along z
    n = len(poly_xy); verts = [G(x, y, z0) for x, y in poly_xy] + [G(x, y, z1) for x, y in poly_xy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)
def cyl_x(name, cy, cz, r, x0, x1, m='GAP', seg=72):
    verts = []
    for x in (x0, x1):
        for k in range(seg): a = 2 * math.pi * k / seg; verts.append(G(x, cy + r * math.sin(a), cz + r * math.cos(a)))
    faces = [tuple(range(seg)), tuple(range(2 * seg - 1, seg - 1, -1))] + [(k, (k + 1) % seg, seg + (k + 1) % seg, seg + k) for k in range(seg)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)
def slot(name, pts, w, depth, m='GAP'):  # thin gap cutter along a polyline on a side (x, y, z points on the surface), cut depth inward
    verts = []; faces = []
    for (x, y, z) in pts:
        sd = 1 if x > 0 else -1
        verts += [G(x + sd * .05, y, z - w / 2), G(x + sd * .05, y, z + w / 2), G(x - sd * depth, y, z + w / 2), G(x - sd * depth, y, z - w / 2)]
    for i in range(len(pts) - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)

for sd in (1, -1):
    for zw in (WB, -WB): cyl_x(f'arch{sd}{zw}', .37, zw, .43, sd * .72, sd * 1.5)
# lower grille: a wide, low trapezoid; corner intakes; a slim upper slot between the lamps
front_prism('grille', [(-.58, .25), (.58, .25), (.52, .45), (-.52, .45)], 2.16, 2.8)
for sd in (1, -1):
    front_prism(f'corner{sd}', [(sd * .62, .22), (sd * .88, .25), (sd * .9, .42), (sd * .66, .44)], 2.15, 2.8)
front_prism('uslot', [(-.34, .545), (.34, .545), (.3, .575), (-.3, .575)], 2.3, 2.8)
# rear: diffuser cavity and exhaust bay
front_prism('diff', [(-.8, .15), (.8, .15), (.76, .4), (-.76, .4)], -2.9, -2.36, 'GLOSSBLACK')
front_prism('plate', [(-.27, .48), (.27, .48), (.27, .62), (-.27, .62)], -2.9, -2.535, 'GLOSSBLACK')   # plate pocket
front_prism('rcrease', [(-.9, .66), (.9, .66), (.9, .668), (-.9, .668)], -2.9, -2.545, 'GAP')           # bumper crease

bvh = None
def BV(): return BVHTree.FromObject(body, DG())
bvh = BV()
def surf_y(x, z):
    h = bvh.ray_cast(G(x, 3, z), Vector((0, 0, -1))); return h[0].z if h[0] else None
def surf_front(x, y):
    h = bvh.ray_cast(G(x, y, 3.5), Vector((0, 1, 0))); return -h[0].y if h[0] else None
def surf_back(x, y):
    h = bvh.ray_cast(G(x, y, -3.5), Vector((0, -1, 0))); return -h[0].y if h[0] else None
def surf_side(y, z, sd=1):
    h = bvh.ray_cast(G(sd * 2.5, y, z), Vector((-sd, 0, 0))); return abs(h[0].x) if h[0] else None

# headlamps: a long slim recess along the fender nose, following the surface
def lamp_pts(sd):
    pts = []
    for k in range(10):
        t = k / 9; x = sd * lerp(.38, .88, t); y = lerp(.6, .67, t ** 1.4) - .05 * t ** 3
        z = surf_front(x, y); pts.append((x, y, (z or 2.3) - .004))
    return pts
LAMPS = {sd: lamp_pts(sd) for sd in (1, -1)}
for sd in (1, -1):
    pts = LAMPS[sd]; verts = []; faces = []
    for (x, y, z) in pts: verts += [G(x, y - .042, z + .2), G(x, y + .04, z + .2), G(x, y + .04, z - .08), G(x, y - .042, z - .08)]
    for i in range(len(pts) - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
    ob = new_obj(f'lampcut{sd}', verts, faces, 'GLOSSBLACK', False); fixn(ob); cutter(ob, 'GLOSSBLACK')
# panel gaps: front door leading edge, B-pillar split, rear door trailing edge, hood shut lines
for sd in (1, -1):
    for z0, lean in ((1.02, .08), (-.08, .0), (-1.05, -.06)):
        pts = []
        for k in range(9):
            y = lerp(.27, kf(YS, z0) + .05, k / 8); z = z0 + lean * (y - .27)
            x = surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        slot(f'door{sd}{z0}', pts, .007, .012)
    # hood shut line along the fender crown
    pts = []
    for k in range(12):
        z = lerp(1.24, 2.34, k / 11); x = sd * lerp(.66, .6, k / 11); y = surf_y(x, z)
        if y: pts.append((x, y, z))
    verts = []; faces = []
    for (x, y, z) in pts: verts += [G(x - .0035, y + .05, z), G(x + .0035, y + .05, z), G(x + .0035, y - .012, z), G(x - .0035, y - .012, z)]
    for i in range(len(pts) - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
    ob = new_obj(f'hoodgap{sd}', verts, faces, 'GAP', False); fixn(ob); cutter(ob, 'GAP')
# rear hatch shut line across the deck
pts = [(x, (surf_y(x, -2.36) or .9), -2.36) for x in [lerp(-.6, .6, k / 10) for k in range(11)]]
verts = []; faces = []
for (x, y, z) in pts: verts += [G(x, y + .05, z - .0035), G(x, y + .05, z + .0035), G(x, y - .012, z + .0035), G(x, y - .012, z - .0035)]
for i in range(len(pts) - 1):
    for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
ob = new_obj('hatchgap', verts, faces, 'GAP', False); fixn(ob); cutter(ob, 'GAP')

# boolean each cutter in (EXACT, material transfer)
cc = bpy.data.collections.new('Cutters'); scene.collection.children.link(cc)
for o in cut_objs:
    for c in list(o.users_collection): c.objects.unlink(o)
    cc.objects.link(o)
mod = body.modifiers.new('cuts', 'BOOLEAN'); mod.operation = 'DIFFERENCE'; mod.solver = 'EXACT'; mod.operand_type = 'COLLECTION'; mod.collection = cc
if hasattr(mod, 'material_mode'): mod.material_mode = 'TRANSFER'
nm = bpy.data.meshes.new_from_object(body.evaluated_get(DG())); body.modifiers.clear(); om = body.data; body.data = nm; bpy.data.meshes.remove(om)
for o in list(cc.objects): bpy.data.objects.remove(o)
bpy.data.collections.remove(cc)
sharpen(body, 26)
bvh = BV()

# ---------------- helpers for detail parts
def tube(name, pts, r, m, res=6):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2; cu.resolution_u = res; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts): p.co = (*G(*q), 1)
    sp.use_endpoint_u = True; sp.order_u = min(4, len(pts))
    ob = bpy.data.objects.new(name, cu); scene.collection.objects.link(ob); cu.materials.append(M[m])
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(DG())); bpy.data.objects.remove(ob); bpy.data.curves.remove(cu)
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.shade_smooth(); return ob
def box(name, size, pos, m, rot=(0, 0, 0)):
    sx, sy, sz = size; x, y, z = pos
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    R = Matrix.Rotation(rot[2], 4, 'Z') @ Matrix.Rotation(rot[1], 4, 'Y') @ Matrix.Rotation(rot[0], 4, 'X')
    for v in me.vertices: g = R @ Vector((v.co.x * sx, v.co.z * sy, v.co.y * sz)); v.co = G(g.x, g.y, g.z) + G(x, y, z)
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.materials.append(M[m]); return ob
def extrude_y(name, poly_xz, y0, y1, m):
    n = len(poly_xz); verts = [G(x, y0, z) for x, z in poly_xz] + [G(x, y1, z) for x, z in poly_xz]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return ob
def extrude_x(name, poly_zy, x0, x1, m, smooth=False):
    n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, smooth); fixn(ob); return ob
def band(name, fn, z0, z1, nz, nu, m, thick=0.):  # a surface patch following fn(u, z) -> (x, y), optional thickness down
    verts = []; faces = []
    for i in range(nz + 1):
        z = lerp(z0, z1, i / nz)
        for j in range(nu + 1): x, y = fn(j / nu, z); verts.append(G(x, y, z))
    W = nu + 1
    for i in range(nz):
        for j in range(nu): a = i * W + j; faces.append((a, a + 1, a + W + 1, a + W))
    ob = new_obj(name, verts, faces, m); return ob

# ================================================================ CABIN: glass greenhouse, painted roof + C-pillar sails, black B-pillar, chrome DLO
CZ0, CZ1 = -2.3, 1.28               # rear glass base -> windscreen base
CW = [[-2.3, .46], [-1.85, .63], [-1.1, .72], [-.2, .745], [.6, .74], [1.05, .7], [1.28, .6]]    # half-width at the belt
RW = [[-2.3, .34], [-1.85, .47], [-1.1, .54], [-.2, .56], [.35, .55], [.8, .5], [1.28, .44]]    # half-width at the roof
CH = [[-2.3, .9], [-1.85, 1.1], [-1.2, 1.3], [-.55, 1.39], [-.05, 1.405], [.4, 1.37], [.85, 1.21], [1.28, .88]]
def belt(z): return max(kf(YD, z), kf(YF, z) - .02) - .005
def cab_ring(z, grow=0., lift=0.):
    cw = kf(CW, z) + grow; rw = kf(RW, z) + grow * .7; top = kf(CH, z) + lift; b = belt(z)
    half = [(0, b - .06), (cw + .01, b - .06), (cw, b)]
    for k in range(1, 17):           # side glass with tumblehome: straight-ish, leaning in
        t = k / 17; half.append((lerp(cw, rw, t ** 1.2) , lerp(b, top - .06, t)))
    for k in range(0, 9):            # roof: gentle crown
        t = k / 8; half.append((rw * (1 - t) * (1 - .06 * t), top - .06 * (1 - t) ** 2))
    half[-1] = (0, top); return half
cab = [[G(x, y, z) for x, y in mirror_ring(cab_ring(z))] for z in [lerp(CZ0, CZ1, i / 159) for i in range(160)]]
cabin = loft('Cabin', cab, 'PAINT'); cabin.data.materials.append(M['GLASS']); cabin.data.materials.append(M['GLOSSBLACK'])
for p in cabin.data.polygons:
    c = p.center; gx, gy, gz = abs(c.x), c.z, -c.y; n = p.normal; nx, ny, nz = abs(n.x), n.z, -n.y
    b = belt(gz); rw = kf(RW, gz); top = kf(CH, gz)
    if gy < b + .012: continue
    if nz > .45 and gz > .7 and gx < rw * .9: p.material_index = 1                              # windscreen
    elif nz < -.3 and gz < -1.55 and gx < rw * .82: p.material_index = 1                        # rear glass
    elif nx > .5:
        yt = lerp(b, top - .06, .95); dlo_r = lerp(-1.72, -1.28, clamp((gy - b) / max(yt - b, .01), 0, 1))
        if gy < yt and dlo_r < gz < 1.16 - .35 * clamp((gy - b) / max(yt - b, .01), 0, 1):
            p.material_index = 2 if -.13 < gz < -.03 else 1                                     # side glass, black B-pillar
sharpen(cabin, 30)
for sd in (1, -1):
    # chrome DLO: along the belt, up and over the roof edge, down into the C-pillar point
    dlo = [(sd * kf(CW, z) * 1.002, belt(z) + .004, z) for z in [lerp(1.18, -1.72, k / 18) for k in range(19)]]
    tube(f'dlo_belt{sd}', dlo, .007, 'CHROME', res=4)
    top = []
    for k in range(18):
        z = lerp(1.0, -1.28, k / 17); r = cab_ring(z, .007); p = r[18]; top.append((sd * p[0], p[1], z))
    top.append((sd * kf(CW, -1.72) * 1.002, belt(-1.72) + .004, -1.72))
    tube(f'dlo_top{sd}', top, .007, 'CHROME', res=4)

# ================================================================ FRONT
for sd in (1, -1):
    pts = LAMPS[sd]
    tube(f'drl{sd}', [(x, y + .014, z - .02) for x, y, z in pts], .007, 'HEAD')                          # upper DRL blade
    tube(f'drl2{sd}', [(x, y - .012, z - .02) for x, y, z in pts[:6]], .006, 'HEAD')                     # lower blade
    for k in range(3):                                                                                   # projector eyes
        x, y, z = pts[3 + k * 2]; b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=12, v_segments=8, radius=.016)
        xform = Matrix.Translation(G(x, y, z - .035)); [setattr(v, 'co', xform @ v.co) for v in b.verts]
        me = bpy.data.meshes.new('eye'); b.to_mesh(me); b.free(); me.materials.append(M['HEAD']); scene.collection.objects.link(bpy.data.objects.new(f'eye{sd}{k}', me))
    # vertical slats in the corner intakes and a lit accent under each lamp
    for k in range(4):
        x = sd * lerp(.66, .86, k / 3); zc = surf_front(x, .33) or 2.3
        box(f'cslat{sd}{k}', (.012, .18, .1), (x, .33, zc - .06), 'SATIN')
# grille: satin horizontal bars and a gloss black frame
for k in range(6):
    y = .27 + k * .036; zc = surf_front(0, y) or 2.4
    box(f'gbar{k}', (lerp(1.1, .98, k / 5), .01, .03), (0, y, zc - .06), 'SATIN')
zc = surf_front(0, .56) or 2.4; box('uslat', (.62, .006, .02), (0, .56, zc - .04), 'SATIN')
# carbon splitter with endplates
spl = [(-.92, 2.0)] + [(math.sin(a) * .95, 2.36 + math.cos(a) * .2) for a in [(-math.pi / 2) + math.pi * k / 20 for k in range(21)]] + [(.92, 2.0)]
extrude_y('Splitter', spl, .155, .18, 'CARBON')

# ================================================================ FLANKS
for sd in (1, -1):
    # carbon sill blade
    sill = []
    for i in range(24):
        z = lerp(-1.0, 1.0, i / 23); x = surf_side(.3, z, sd) or .95
        sill.append([G(sd * (x - .06), .19, z), G(sd * (x + .035), .19, z), G(sd * (x + .045), .215, z), G(sd * (x - .05), .26, z)])
    loft(f'Sill{sd}', sill, 'CARBON', smooth=False)
    # flush door handles on the crease
    for z in (.62, -.5):
        y = kf(YS, z) - .05; x = surf_side(y, z, sd)
        box(f'handle{sd}{z}', (.012, .022, .18), (sd * (x + .004), y, z), 'SATIN')
    # front fender vent with a satin blade, behind the front wheel
    z = WB - .52; y = .56; x = surf_side(y, z, sd)
    box(f'ventbk{sd}', (.01, .1, .24), (sd * (x - .002), y, z), 'GLOSSBLACK', rot=(0, 0, 0)); box(f'ventbl{sd}', (.014, .014, .22), (sd * (x + .004), y, z), 'SATIN')
    # mirrors: a slim cap on a blade stalk from the door
    mz = .92; my = belt(mz) + .02; mx = kf(CW, mz)
    tube(f'mstalk{sd}', [(sd * (mx - .03), my - .01, mz), (sd * (mx + .06), my + .015, mz - .02), (sd * (mx + .11), my + .03, mz - .04)], .014, 'CARBON', res=4)
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=20, v_segments=12, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .12, v.co.z * .055, v.co.y * .085
        if gz < 0: gz *= .35
        v.co = G(sd * (mx + .2) + gx, my + .045 + gy, mz - .07 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(M['PAINT']); me.shade_smooth(); scene.collection.objects.link(bpy.data.objects.new(f'mcap{sd}', me))

# ================================================================ REAR
yT = surf_y(0, -2.5) or .86
tl = []
for k in range(-12, 13):
    x = k / 12 * .96; y = (surf_y(x, -2.5) or yT) - .03; z = (surf_back(x, y) or -2.55) - .006; tl.append((x, y, z))
tube('taillight', tl, .014, 'TAIL', res=4)
for sd in (1, -1):                                              # corner lamp returns wrapping onto the flank
    x0, y0, z0 = tl[-1 if sd > 0 else 0]
    ret = [(x0, y0, z0)] + [(sd * ((surf_side(y0 - .01, z, sd) or .95) + .004), y0 - .01, z) for z in (-2.48, -2.42, -2.36)]
    tube(f'tailret{sd}', ret, .011, 'TAIL', res=4)
    for ex in (.36, .54):                                       # quad trapezoid exhausts
        box(f'exh{sd}{ex}', (.14, .065, .16), (sd * ex, .27, -2.5), 'CHROME'); box(f'exhi{sd}{ex}', (.11, .04, .02), (sd * ex, .27, -2.585), 'GAP')
extrude_y('DiffPlate', [(-.9, -2.62), (.9, -2.62), (.9, -2.1), (-.9, -2.1)], .14, .16, 'CARBON')
for k in range(7):
    x = -.54 + k * .18; extrude_x(f'fin{k}', [(-2.12, .16), (-2.58, .16), (-2.58, .3), (-2.4, .3)], x - .008, x + .008, 'CARBON')
# ducktail lip in carbon
lip = []
for i in range(16):
    x = lerp(-.6, .6, i / 15); y = (surf_y(x, -2.47) or .88)
    lip.append((x, y))
verts = []; faces = []
for x, y in lip: verts += [G(x, y - .004, -2.4), G(x, y + .01, -2.4), G(x, y + .03, -2.6), G(x, y - .004, -2.56)]
for i in range(len(lip) - 1):
    for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
L = 4 * (len(lip) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
ob = new_obj('Ducktail', verts, faces, 'CARBON', False); fixn(ob)
extrude_y('Floor', [(-.84, -2.1), (.84, -2.1), (.84, 2.05), (-.84, 2.05)], .15, .19, 'GLOSSBLACK')

objs = [o for o in scene.collection.objects if o.type == 'MESH']
tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)
print('objects', len(objs), 'tris', tris)

if CLI:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True,
                              export_normals=True, export_texcoords=False, export_materials='EXPORT', export_lights=False, export_cameras=False)
    print('wrote', OUT, os.path.getsize(OUT))

def preview_setup():
    world = bpy.data.worlds.new('W'); scene.world = world; world.use_nodes = True
    bg = world.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (.03, .033, .04, 1); bg.inputs['Strength'].default_value = 1.
    fm = mat('FLOOR', (.045, .045, .05), 0., .28); gm = bpy.data.meshes.new('floor'); gm.from_pydata([(-30, -30, 0), (30, -30, 0), (30, 30, 0), (-30, 30, 0)], [], [(0, 1, 2, 3)]); gm.materials.append(fm)
    scene.collection.objects.link(bpy.data.objects.new('floor', gm))
    tm = mat('TYRE', (.02, .02, .02), 0., .8); rm = mat('RIM', (.12, .13, .15), 1., .15)
    for sx in (1, -1):
        for zw in (WB, -WB):
            for r, d, m, off in ((.37, .28, tm, 0), (.3, .02, rm, .14)):
                b = bmesh.new(); bmesh.ops.create_cone(b, cap_ends=True, segments=48, radius1=r, radius2=r, depth=d)
                me = bpy.data.meshes.new('w'); b.to_mesh(me); b.free(); me.materials.append(m)
                o = bpy.data.objects.new('wheel', me); scene.collection.objects.link(o); o.rotation_euler = (0, math.pi / 2, 0); o.location = G(sx * (.9 + off * .5), .37, zw)
    def light(name, loc, energy, size, col=(1, 1, 1)):
        L = bpy.data.lights.new(name, 'AREA'); L.energy = energy; L.size = size; L.color = col
        o = bpy.data.objects.new(name, L); scene.collection.objects.link(o); o.location = loc
        o.rotation_euler = (Vector((0, 0, .5)) - o.location).to_track_quat('-Z', 'Y').to_euler()
    light('key', (5, 3, 6), 2600, 6); light('rim', (-5, -5, 3), 1600, 5, (.7, .8, 1.)); light('strip', (0, 0, 7), 1500, 10); light('fill', (-4, 6, 2), 500, 6)
    cam = bpy.data.cameras.new('C'); cam.lens = 50; co = bpy.data.objects.new('C', cam); scene.collection.objects.link(co); scene.camera = co
    return co
def shoot(co, tag, pos, prefix):
    co.location = pos; co.rotation_euler = (G(0, .6, 0) - pos).to_track_quat('-Z', 'Y').to_euler()
    scene.render.filepath = f'{prefix}_{tag}.png'; bpy.ops.render.render(write_still=True)
if not CLI:
    co = preview_setup(); co.location = G(4.6, 1.25, 5.4); co.rotation_euler = (G(0, .6, 0) - co.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.resolution_x = 1280; scene.render.resolution_y = 720
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == 'VIEW_3D': a.spaces[0].shading.type = 'MATERIAL'; a.spaces[0].region_3d.view_perspective = 'CAMERA'
    bpy.ops.wm.save_as_mainfile(filepath=os.path.expanduser('~/Projects/afterhours_autobahn_63.blend'), copy=True)
    result = {'objects': len(objs), 'tris': tris}
if CLI and RENDER:
    co = preview_setup()
    scene.render.engine = 'CYCLES'; scene.cycles.samples = 20; scene.cycles.use_denoising = True
    scene.render.resolution_x = 960; scene.render.resolution_y = 540
    shots = (('front', G(4.4, 1.3, 5.2)), ('rear', G(-4.4, 1.5, -5.4)), ('side', G(7.8, .95, .1)), ('top', G(3.4, 5.2, 2.6)))
    if os.environ.get('SHOTS') == 'ends': shots = (('nose', G(0, .75, 6.5)), ('nose34', G(2.2, .9, 4.6)), ('tail', G(0, 1.0, -6.5)), ('tail34', G(-2.4, 1.1, -4.8)))
    for tag, pos in shots: shoot(co, tag, pos, RENDER)
