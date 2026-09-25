"""AFTERHOURS — AUTOBAHN 63 (v2): an original four-door performance GT, built in Blender (bpy).
Game coords: x right, y up, z forward (nose +z). Blender: (x, -z, y). Wheels (BODIES.autobahn): x ±.9, z ±1.5, r .37.
v2 rebuild: convex body sides that swell over both axles, rear haunches, a low tumblehome greenhouse whose roof falls in
one arc to a ducktail, hood power domes, flush lower aero, gloss-black sills and diffuser, tight wheel arches with liners.
CLI:  blender -b -P autobahn_63.py -- --out autobahn_63.glb
Live: exec in Blender (MCP) — builds into a fresh 'Autobahn 63' scene; preview rig lives in a separate 'Preview' collection.
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
CLI = '--out' in ARGV
OUT = ARGV[ARGV.index('--out') + 1] if CLI else None

def G(x, y, z): return Vector((x, -z, y))
def clamp(v, a, b): return max(a, min(b, v))
def lerp(a, b, t): return a + (b - a) * t
def kf(keys, z):  # Catmull-Rom through (z, value) keys
    i = 0
    while i < len(keys) - 2 and z > keys[i + 1][0]: i += 1
    p0 = keys[max(0, i - 1)]; p1 = keys[i]; p2 = keys[i + 1]; p3 = keys[min(len(keys) - 1, i + 2)]
    t = clamp((z - p1[0]) / (p2[0] - p1[0]), 0, 1); t2 = t * t; t3 = t2 * t
    return .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
def smooth(e0, e1, v):
    t = clamp((v - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)

# ---------------------------------------------------------------- scene
if CLI:
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
    def DG(): return bpy.context.evaluated_depsgraph_get()
else:
    old = bpy.data.scenes.get('Autobahn 63')
    if old:
        for o in list(old.objects): bpy.data.objects.remove(o)
        for c in list(old.collection.children): bpy.data.collections.remove(c)
        bpy.data.scenes.remove(old)
    for blk in (bpy.data.meshes, bpy.data.curves, bpy.data.materials):
        for d in list(blk):
            if d.users == 0: blk.remove(d)
    scene = bpy.data.scenes.new('Autobahn 63')
    for w in bpy.context.window_manager.windows: w.scene = scene
    VL = scene.view_layers[0]
    def DG():
        d = VL.depsgraph; d.update(); return d
CAR = bpy.data.collections.new('Car'); scene.collection.children.link(CAR)

def mat(name, col, metal=0., rough=.5, emit=None, coat=False, strength=6.):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if coat and 'Coat Weight' in b.inputs: b.inputs['Coat Weight'].default_value = 1.; b.inputs['Coat Roughness'].default_value = .02
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
M = {'PAINT': mat('PAINT', (.01, .04, .3), .75, .16, coat=True), 'CARBON': mat('CARBON', (.02, .021, .024), .1, .35, coat=True),
     'GLASS': mat('GLASS', (.004, .005, .007), .2, .02, coat=True), 'GLOSSBLACK': mat('GLOSSBLACK', (.005, .005, .006), .2, .08, coat=True),
     'GAP': mat('GAP', (.002, .002, .002), 0., .9), 'HEAD': mat('HEAD', (.9, .95, 1.), 0., .3, emit=(.85, .92, 1.)),
     'TAIL': mat('TAIL', (1., .05, .05), 0., .3, emit=(1., .03, .05), strength=8.), 'CHROME': mat('CHROME', (.85, .86, .88), 1., .08),
     'LENS': mat('LENS', (.9, .9, .9), 0., .02), 'SATIN': mat('SATIN', (.2, .21, .23), .9, .3)}

def link(ob): CAR.objects.link(ob); return ob
def fixn(ob):
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
def new_obj(name, verts, faces, m, smooth_=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = link(bpy.data.objects.new(name, me)); me.materials.append(M[m])
    if smooth_: me.shade_smooth()
    return ob
def loft(name, stations, m, smooth_=True, cap=True, closed=True):
    verts = [v for r in stations for v in r]; n = len(stations[0]); S = len(stations); faces = []
    J = n if closed else n - 1
    for i in range(S - 1):
        for j in range(J):
            a = i * n + j; b = i * n + (j + 1) % n; c = (i + 1) * n + (j + 1) % n; d = (i + 1) * n + j; faces.append((a, b, c, d))
    if cap:
        for i, flip in ((0, True), (S - 1, False)):
            ring = list(range(i * n, i * n + n)); faces.append(tuple(reversed(ring)) if flip else tuple(ring))
    ob = new_obj(name, verts, faces, m, smooth_); fixn(ob); return ob
def mirror_ring(half): return half + [(-x, y) for (x, y) in reversed(half[1:-1])]
def sharpen(ob, deg):
    bm = bmesh.new(); bm.from_mesh(ob.data); lim = math.radians(deg)
    for f in bm.faces: f.smooth = True
    for e in bm.edges: e.smooth = len(e.link_faces) == 2 and e.calc_face_angle(0) <= lim and e.link_faces[0].material_index == e.link_faces[1].material_index
    bm.to_mesh(ob.data); bm.free()
def slot_of(ob, key):
    for i, m in enumerate(ob.data.materials):
        if m and m.name.split('.')[0] == key: return i
    ob.data.materials.append(M[key]); return len(ob.data.materials) - 1

# ================================================================ BODY
Z0, Z1, WB, WR = -2.56, 2.5, 1.5, .37
# plan: max half-width (at the bulge line). Swells over both axles, pinches at the doors, hips widest.
HW = [[-2.56, .78], [-2.46, .88], [-2.3, .95], [-2.0, 1.0], [-1.55, 1.025], [-1.1, .99], [-.5, .955], [.2, .945], [.8, .955],
      [1.15, .98], [1.5, .995], [1.85, .97], [2.15, .92], [2.36, .84], [2.5, .7]]
YB = [[-2.56, .44], [-2.42, .28], [-2.2, .17], [2.05, .165], [2.32, .2], [2.5, .27]]                    # floor
YS = [[-2.56, .8], [-2.35, .86], [-1.8, .89], [-1.35, .86], [-.7, .8], [.2, .77], [.9, .765], [1.4, .775], [1.8, .745],
      [2.15, .68], [2.38, .6], [2.5, .5]]                                                                 # shoulder: fender crown + haunch
YT = [[-2.56, .86], [-2.47, .965], [-2.3, .97], [-1.7, .975], [-.6, .95], [.5, .93], [1.2, .9], [1.6, .85], [1.95, .785],
      [2.2, .72], [2.38, .64], [2.5, .55]]                                                                # hood / deck centre
def dome(x, z):  # twin hood power domes
    w = smooth(1.28, 1.5, z) * (1 - smooth(1.95, 2.25, z))
    return .03 * w * math.exp(-((abs(x) - .33) / .11) ** 2)
def section(z):
    hs = kf(HW, z); yb = kf(YB, z); ys = kf(YS, z); yt = max(kf(YT, z), ys + .03)
    yw = yb + (ys - yb) * .5                     # widest point, just above the hubs
    Rx = .15; Ry = max(.022, (yt - .012) - ys); x0 = hs - .045
    half = [(0, yb), (hs - .25, yb), (hs - .135, yb + .008), (hs - .1, yb + .045), (hs - .085, yb + .1)]
    for k in range(1, 5):                        # lower body: bows out from a deep sill tuck to the bulge
        t = k / 4; half.append((hs - .085 * (1 - t) ** 2.2, lerp(yb + .1, yw, t)))
    for t in (.22, .44, .5, .56, .78, 1.):       # upper body: tumbles in, with a crisp stepped feature line
        half.append((hs - .045 * t ** 1.7 - (.007 if t > .5 else 0), lerp(yw, ys, t)))
    for k in range(1, 7):                        # shoulder radius
        a = k / 6 * math.pi / 2; half.append((x0 - Rx * (1 - math.cos(a)), ys + Ry * math.sin(a)))
    xe = x0 - Rx; ye = ys + Ry
    for k in range(1, 7):                        # hood / deck, gently crowned
        t = k / 6; x = lerp(xe, 0, t); half.append((x, ye + (yt - ye) * (1 - (1 - t) ** 2) + dome(x, z)))
    half[-1] = (0, half[-1][1])
    # round the nose and tail in plan and elevation
    tn = clamp((z - (Z1 - .16)) / .16, 0, 1); tr = clamp(((Z0 + .18) - z) / .18, 0, 1)
    en = 1 - math.sqrt(max(0., 1 - tn * tn)); er = 1 - math.sqrt(max(0., 1 - tr * tr))
    ym = (yb + yt) * .5
    return [(x * (1 - .2 * en - .12 * er), ym + (y - ym) * (1 - .28 * en - .18 * er)) for x, y in half]
def lean(y, z):  # shark nose: the upper nose leans forward over a tucked chin; the tail's top overhangs a tucked valance
    yb = kf(YB, z); yt = kf(YT, z); h = clamp((y - yb) / max(yt - yb, .01), 0, 1)
    return .07 * smooth(2.05, 2.5, z) * (h - .5) - .06 * smooth(-2.3, -2.56, z) * (h - .4)
stations = []
NS = 220
for i in range(NS):
    t = i / (NS - 1); t = .82 * t + .18 * (.5 - .5 * math.cos(math.pi * t)); z = Z0 + (Z1 - Z0) * t
    stations.append([G(x, y, z + lean(y, z)) for x, y in mirror_ring(section(z))])
body = loft('Body', stations, 'PAINT')

# ---------------- cutters
cut_objs = []
def cutter(ob, m):
    ob.data.materials.clear(); ob.data.materials.append(M[m]); ob.hide_render = True; cut_objs.append(ob); return ob
def front_prism(name, poly_xy, z0, z1, m='GAP'):
    n = len(poly_xy); verts = [G(x, y, z0) for x, y in poly_xy] + [G(x, y, z1) for x, y in poly_xy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)
def cyl_x(name, cy, cz, r, x0, x1, m='GAP', seg=96):
    verts = []
    for x in (x0, x1):
        for k in range(seg): a = 2 * math.pi * k / seg; verts.append(G(x, cy + r * math.sin(a), cz + r * math.cos(a)))
    faces = [tuple(range(seg)), tuple(range(2 * seg - 1, seg - 1, -1))] + [(k, (k + 1) % seg, seg + (k + 1) % seg, seg + k) for k in range(seg)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)
def rounded(cx, cy, w, h, r, n=5, skew=0.):  # rounded-rect polygon (x, y), optional top skew
    pts = []
    for (qx, qy, a0) in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        for k in range(n + 1):
            a = math.radians(a0 + 90 * k / n); x = cx + qx * (w / 2 - r) + r * math.cos(a); y = cy + qy * (h / 2 - r) + r * math.sin(a)
            pts.append((x + skew * (y - cy), y))
    return pts
def strip_cut(name, pts, hw, depth, m='GAP', axis='side'):  # thin gap along a polyline of surface points
    verts = []; faces = []
    for (x, y, z) in pts:
        if axis == 'side':
            sd = 1 if x > 0 else -1
            verts += [G(x + sd * .05, y, z - hw), G(x + sd * .05, y, z + hw), G(x - sd * depth, y, z + hw), G(x - sd * depth, y, z - hw)]
        elif axis == 'top':
            verts += [G(x - hw, y + .05, z), G(x + hw, y + .05, z), G(x + hw, y - depth, z), G(x - hw, y - depth, z)]
        else:  # across (z-constant line on a top surface)
            verts += [G(x, y + .05, z - hw), G(x, y + .05, z + hw), G(x, y - depth, z + hw), G(x, y - depth, z - hw)]
    for i in range(len(pts) - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return cutter(ob, m)

ARCH_R = .408
for sd in (1, -1):
    for zw in (WB, -WB): cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .6, sd * 1.4)
# front: one wide lower mouth, two corner intakes, a slim upper slot
front_prism('mouth', rounded(0, .345, 1.08, .19, .05, skew=-.08), 2.2, 2.9)
for sd in (1, -1):
    front_prism(f'corner{sd}', [(sd * .63, .21), (sd * .86, .24), (sd * .84, .43), (sd * .66, .4)], 2.14, 2.9)
front_prism('uslot', rounded(0, .505, .5, .026, .012), 2.25, 2.9)
# rear: diffuser bay, plate pocket
front_prism('diff', rounded(0, .29, 1.5, .22, .04), -2.9, -2.33, 'GLOSSBLACK')
front_prism('plate', rounded(0, .56, .54, .13, .02), -2.9, -2.535, 'GLOSSBLACK')

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

# headlamps: a slim blade that sweeps back and up round the nose corner
def lamp_pts(sd):
    pts = []
    for k in range(12):
        t = k / 11; x = sd * lerp(.38, .88, t); y = lerp(.6, .665, t ** 1.4)
        z = surf_front(x, y); pts.append((x, y, (z or 2.3) - .003))
    return pts
LAMPS = {sd: lamp_pts(sd) for sd in (1, -1)}
for sd in (1, -1):
    pts = LAMPS[sd]; verts = []; faces = []
    for k, (x, y, z) in enumerate(pts):
        h = lerp(.03, .046, k / 11)
        verts += [G(x, y - h, z + .2), G(x, y + h * .8, z + .2), G(x, y + h * .8, z - .06), G(x, y - h, z - .06)]
    for i in range(len(pts) - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
    ob = new_obj(f'lampcut{sd}', verts, faces, 'GLOSSBLACK', False); fixn(ob); cutter(ob, 'GLOSSBLACK')
# panel gaps: doors, hood shut lines, hatch
for sd in (1, -1):
    for z0, lean, top in ((1.04, .1, .0), (-.06, .0, .0), (-1.02, -.1, .0)):
        pts = []
        for k in range(12):
            y = lerp(.25, kf(YT, z0) - .03, k / 11); z = z0 + lean * (y - .25)
            if z0 < -.5: z += .06 * math.sin(k / 11 * math.pi)            # rear door edge kinks round the haunch
            x = surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        strip_cut(f'door{sd}{z0}', pts, .0035, .012)
    pts = []
    for k in range(14):
        z = lerp(1.26, 2.36, k / 13); x = sd * lerp(.7, .6, (k / 13) ** 1.5); y = surf_y(x, z)
        if y: pts.append((x, y, z))
    strip_cut(f'hoodgap{sd}', pts, .0035, .012, axis='top')
pts = [(x, (surf_y(x, -2.4) or .95), -2.4) for x in [lerp(-.62, .62, k / 12) for k in range(13)]]
strip_cut('hatchgap', pts, .0035, .012, axis='across')

cc = bpy.data.collections.new('Cutters'); scene.collection.children.link(cc)
for o in cut_objs:
    for c in list(o.users_collection): c.objects.unlink(o)
    cc.objects.link(o)
mod = body.modifiers.new('cuts', 'BOOLEAN'); mod.operation = 'DIFFERENCE'; mod.solver = 'EXACT'; mod.operand_type = 'COLLECTION'; mod.collection = cc
if hasattr(mod, 'material_mode'): mod.material_mode = 'TRANSFER'
nm = bpy.data.meshes.new_from_object(body.evaluated_get(DG())); body.modifiers.clear(); om = body.data; body.data = nm; bpy.data.meshes.remove(om)
for o in list(cc.objects): bpy.data.objects.remove(o)
bpy.data.collections.remove(cc)
# two-tone lower: gloss black sills, front lip band and rear valance
gb = slot_of(body, 'GLOSSBLACK')
for p in body.data.polygons:
    if p.material_index != 0: continue
    c = p.center; gx, gy, gz = abs(c.x), c.z, -c.y; yb = kf(YB, gz)
    if (gy < yb + .085 and -1.1 < gz < 1.1) or (gz > 2.3 and gy < yb + .05) or (gz < -2.4 and gy < .4):
        p.material_index = gb
sharpen(body, 28)
bvh = BV()

# ---------------- helpers for detail parts
def tube(name, pts, r, m, res=6):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2; cu.resolution_u = res; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts): p.co = (*G(*q), 1)
    sp.use_endpoint_u = True; sp.order_u = min(4, len(pts))
    ob = bpy.data.objects.new(name, cu); CAR.objects.link(ob); cu.materials.append(M[m])
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(DG())); bpy.data.objects.remove(ob); bpy.data.curves.remove(cu)
    ob = link(bpy.data.objects.new(name, me)); me.shade_smooth(); return ob
def box(name, size, pos, m, rot=(0, 0, 0)):
    sx, sy, sz = size; x, y, z = pos
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    R = Matrix.Rotation(rot[2], 4, 'Z') @ Matrix.Rotation(rot[1], 4, 'Y') @ Matrix.Rotation(rot[0], 4, 'X')
    for v in me.vertices: g = R @ Vector((v.co.x * sx, v.co.z * sy, v.co.y * sz)); v.co = G(g.x, g.y, g.z) + G(x, y, z)
    ob = link(bpy.data.objects.new(name, me)); me.materials.append(M[m]); return ob
def extrude_y(name, poly_xz, y0, y1, m):
    n = len(poly_xz); verts = [G(x, y0, z) for x, z in poly_xz] + [G(x, y1, z) for x, z in poly_xz]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return ob
def extrude_x(name, poly_zy, x0, x1, m):
    n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False); fixn(ob); return ob
def cyl_z(name, x, y, z0, z1, r, m, seg=28, open_=False):
    verts = []
    for z in (z0, z1):
        for k in range(seg): a = 2 * math.pi * k / seg; verts.append(G(x + r * math.cos(a), y + r * math.sin(a), z))
    faces = [(k, (k + 1) % seg, seg + (k + 1) % seg, seg + k) for k in range(seg)]
    if not open_: faces += [tuple(range(seg)), tuple(range(2 * seg - 1, seg - 1, -1))]
    ob = new_obj(name, verts, faces, m); fixn(ob); return ob

# wheel-arch liners so the arches read as deep black wells, not holes into the shell
for sd in (1, -1):
    for zw in (WB, -WB):
        seg = 40; verts = []; faces = []
        for i, x in enumerate((sd * .56, sd * 1.0)):
            for k in range(seg + 1):
                a = math.radians(-20 + 220 * k / seg); verts.append(G(x, WR + (ARCH_R - .006) * math.sin(a), zw + (ARCH_R - .006) * math.cos(a)))
        for k in range(seg): faces.append((k, k + 1, seg + 2 + k, seg + 1 + k))
        new_obj(f'liner{sd}{zw}', verts, faces, 'GAP')

# ================================================================ CABIN: low glasshouse with tumblehome, fastback to a ducktail
CZ0, CZ1 = -2.3, 1.22
CH = [[-2.3, .975], [-1.95, 1.08], [-1.45, 1.23], [-.8, 1.345], [-.2, 1.395], [.25, 1.39], [.6, 1.33], [.92, 1.15], [1.22, .935]]
def cw_(z): return kf(HW, z) - .205 - .06 * smooth(-1.7, -2.3, z) - .05 * smooth(.95, 1.22, z)
def rw_(z): return cw_(z) - .215
def belt(z): return (surf_y(cw_(z) + .01, z) or kf(YT, z)) - .004
BELT = {}
def cab_ring(z, grow=0.):
    cw = cw_(z) + grow; rw = rw_(z) + grow * .7; top = kf(CH, z) + grow * .5; b = BELT.setdefault(round(z, 5), belt(z))
    half = [(0, b - .08), (cw + .004, b - .08), (cw, b)]
    for k in range(1, 15):   # side glass, leaning in with a slight convexity
        t = k / 15; half.append((lerp(cw, rw, t ** 1.18) + .012 * math.sin(math.pi * t), lerp(b, top - .05, t)))
    for k in range(0, 9):    # roof crown
        t = k / 8; half.append((rw * (1 - t) * (1 - .04 * t), top - .05 * (1 - t) ** 2))
    half[-1] = (0, top); return half
CZS = [lerp(CZ0, CZ1, i / 159) for i in range(160)]
cab = [[G(x, y, z) for x, y in mirror_ring(cab_ring(z))] for z in CZS]
cabin = loft('Cabin', cab, 'PAINT'); cabin.data.materials.append(M['GLASS']); cabin.data.materials.append(M['GLOSSBLACK'])
DLO_R0, DLO_R1, DLO_F = -1.86, -1.36, 1.1   # C-pillar point at the belt / at the roof, A-pillar at the belt
for p in cabin.data.polygons:
    c = p.center; gx, gy, gz = abs(c.x), c.z, -c.y; n = p.normal; nx, nz = abs(n.x), -n.y
    b = BELT.get(round(min(max(gz, CZ0), CZ1), 5)) or belt(gz); rw = rw_(gz); top = kf(CH, gz)
    if gy < b + .01: continue
    h = clamp((gy - b) / max(top - .05 - b, .01), 0, 1)
    if nz > .42 and gz > .55 and gx < rw * .93: p.material_index = 1                          # windscreen
    elif nz < -.22 and gz < -1.5 and gx < rw * .86: p.material_index = 1                      # rear glass
    elif nx > .45 and h < .96:
        if lerp(DLO_R0, DLO_R1, h) < gz < DLO_F - .42 * h:
            p.material_index = 2 if -.12 < gz < -.02 else 1                                    # side glass, black B-pillar
sharpen(cabin, 32)
for sd in (1, -1):   # bright DLO surround: along the belt, over the door tops, into the C-pillar point
    tube(f'dlo_belt{sd}', [(sd * (cw_(z) + .003), belt(z) + .005, z) for z in [lerp(DLO_F, DLO_R0, k / 20) for k in range(21)]], .0065, 'CHROME', res=4)
    top = []
    for k in range(20):
        z = lerp(DLO_F - .42 * .97, DLO_R1, k / 19); r = cab_ring(z, .006); p = r[2 + 14]; top.append((sd * p[0], p[1], z))
    top.append((sd * (cw_(DLO_R0) + .003), belt(DLO_R0) + .005, DLO_R0))
    tube(f'dlo_top{sd}', top, .0065, 'CHROME', res=4)

# ================================================================ FRONT
for sd in (1, -1):
    pts = LAMPS[sd]
    tube(f'drl{sd}', [(x, y + .018, z - .016) for x, y, z in pts], .006, 'HEAD')                     # upper DRL blade
    tube(f'drlhook{sd}', [pts[-3], (pts[-1][0], pts[-1][1] - .03, pts[-1][2] - .02)], .005, 'HEAD')  # hook at the outer end
    tube(f'drl2{sd}', [(x, y - .014, z - .03) for x, y, z in pts[3:]], .004, 'HEAD')              # lower main-beam strip
    for k in range(4):                                                                              # dark lens cells
        x, y, z = pts[3 + k * 2]; box(f'cell{sd}{k}', (.05, .018, .02), (x, y, z - .045), 'SATIN')
    for k in range(3):                                                                              # angled fins in the corner intakes
        x = sd * lerp(.68, .82, k / 2); zc = surf_front(x, .32) or 2.3
        box(f'cfin{sd}{k}', (.01, .2, .12), (x, .32, zc - .07), 'CARBON', rot=(0, sd * .25, 0))
# lower mouth: three satin blades across the opening with a carbon lip below
for k in range(3):
    y = .29 + k * .055; zc = surf_front(0, y) or 2.4
    box(f'mblade{k}', (lerp(1.0, .92, k / 2), .012, .05), (0, y, zc - .07), 'SATIN')
lip = [(-.9, 2.08)] + [(math.sin(a) * .9, 2.34 + math.cos(a) * .18) for a in [(-math.pi / 2) + math.pi * k / 24 for k in range(25)]] + [(.9, 2.08)]
extrude_y('Lip', lip, .16, .178, 'CARBON')

# ================================================================ FLANKS
for sd in (1, -1):
    for z in (.66, -.44):                                                                           # flush handles
        y = kf(YS, z) - .06; x = surf_side(y, z, sd)
        if x: box(f'handle{sd}{z}', (.01, .018, .2), (sd * (x + .002), y, z), 'SATIN')
    z = WB - .6; y = .6; x = surf_side(y, z, sd)                                                    # fender vent behind the front wheel
    if x:
        box(f'ventbk{sd}', (.012, .06, .22), (sd * (x - .003), y, z), 'GLOSSBLACK', rot=(-.12 * sd * 0, 0, 0))
        box(f'ventbl{sd}', (.012, .012, .2), (sd * (x + .002), y, z), 'CHROME')
    # mirrors: blade stalk off the door, teardrop cap
    mz = .88; my = belt(mz) + .02; mx = cw_(mz)
    tube(f'mstalk{sd}', [(sd * (mx - .02), my - .015, mz), (sd * (mx + .06), my + .01, mz - .03), (sd * (mx + .1), my + .03, mz - .05)], .011, 'GLOSSBLACK', res=4)
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=24, v_segments=14, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .095, v.co.z * .043, v.co.y * .068
        if gz < 0: gz *= .3
        v.co = G(sd * (mx + .16) + gx, my + .045 + gy, mz - .065 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(M['PAINT']); me.shade_smooth(); link(bpy.data.objects.new(f'mcap{sd}', me))
    # thin carbon sill blade, tucked (no shelf)
    sill = []
    for i in range(26):
        z = lerp(-1.02, 1.02, i / 25); x = surf_side(.24, z, sd) or .9
        sill.append([G(sd * (x - .05), .17, z), G(sd * (x + .018), .17, z), G(sd * (x + .02), .185, z), G(sd * (x - .05), .2, z)])
    loft(f'Sill{sd}', sill, 'CARBON', smooth_=False)

# ================================================================ REAR
tl = []
for k in range(-14, 15):                                                                            # full-width light bar
    x = k / 14 * .9; y = .81 + .012 * (1 - (k / 14) ** 2); z = (surf_back(x, y) or -2.55) - .004; tl.append((x, y, z))
tube('taillight', tl, .014, 'TAIL', res=4)
for sd in (1, -1):
    x0, y0, z0 = tl[-1 if sd > 0 else 0]
    ret = [(x0, y0, z0)] + [(sd * ((surf_side(y0 - .01 * i, z, sd) or .95) + .003), y0 - .01 * i, z) for i, z in enumerate((-2.46, -2.38, -2.28), 1)]
    tube(f'tailret{sd}', ret, .012, 'TAIL', res=4)
    for ex in (.4, .56):                                                                            # quad round tailpipes in the diffuser
        cyl_z(f'exh{sd}{ex}', sd * ex, .27, -2.49, -2.3, .046, 'CHROME', open_=True)
        cyl_z(f'exhi{sd}{ex}', sd * ex, .27, -2.44, -2.42, .04, 'GAP')
for k in range(5):                                                                                  # diffuser strakes, inside the footprint
    x = -.44 + k * .22; extrude_x(f'fin{k}', [(-2.08, .17), (-2.44, .17), (-2.44, .34), (-2.28, .3)], x - .007, x + .007, 'CARBON')
lipd = []                                                                                           # carbon ducktail lip
for i in range(18):
    x = lerp(-.66, .66, i / 17); lipd.append((x, surf_y(x, -2.46) or .95))
verts = []; faces = []
for x, y in lipd: verts += [G(x, y - .004, -2.42), G(x, y + .006, -2.42), G(x, y + .022, -2.585), G(x, y - .006, -2.56)]
for i in range(len(lipd) - 1):
    for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
L = 4 * (len(lipd) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
ob = new_obj('Ducktail', verts, faces, 'CARBON', False); fixn(ob)
extrude_y('Floor', [(-.82, -2.15), (.82, -2.15), (.82, 2.1), (-.82, 2.1)], .15, .17, 'GLOSSBLACK')

objs = [o for o in CAR.objects if o.type == 'MESH']
tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)
print('objects', len(objs), 'tris', tris)

def export(path):
    for o in bpy.context.view_layer.objects if CLI else scene.objects: o.select_set(False)
    for o in objs: o.select_set(True)
    kw = dict(filepath=path, export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_normals=True,
              export_texcoords=False, export_materials='EXPORT', export_lights=False, export_cameras=False)
    if CLI: bpy.ops.export_scene.gltf(**kw)
    else:
        with bpy.context.temp_override(window=bpy.context.window_manager.windows[0], scene=scene, view_layer=VL):
            bpy.ops.export_scene.gltf(**kw)
    return os.path.getsize(path)
if CLI:
    print('wrote', OUT, export(OUT))
else:
    result = {'objects': len(objs), 'tris': tris}
