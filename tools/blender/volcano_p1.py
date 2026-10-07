"""AFTERHOURS — Volcano P1 (original hypercar body), built in Blender.
Game coords: x = right, y = up, z = forward (nose at +z). Blender: (x, -z, y).
Wheels (from BODIES.p1): x = ±1.0, z = ±1.36, radius .36.
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else '/tmp/volcano.glb'
RENDER = sys.argv[sys.argv.index('--render') + 1] if '--render' in sys.argv else None

def G(x, y, z): return Vector((x, -z, y))          # game -> blender
def clamp(v, a, b): return max(a, min(b, v))
def smooth_t(t): t = clamp(t, 0, 1); return t * t * (3 - 2 * t)
def lerp(a, b, t): return a + (b - a) * t

def kf(keys, z):  # Catmull-Rom through [z, value] keys (same as kfCR in afterhours.js)
    i = 0
    while i < len(keys) - 2 and z > keys[i + 1][0]: i += 1
    p0 = keys[max(0, i - 1)]; p1 = keys[i]; p2 = keys[i + 1]; p3 = keys[min(len(keys) - 1, i + 2)]
    t = clamp((z - p1[0]) / (p2[0] - p1[0]), 0, 1); t2 = t * t; t3 = t2 * t
    return .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)

# ---------------------------------------------------------------- reset scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------------------------------------------------------------- materials (names are the contract with afterhours.js)
def mat(name, col, metal=0., rough=.5, emit=None, alpha=1.):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if 'Coat Weight' in b.inputs and name in ('PAINT', 'CARBON', 'GLOSSBLACK'): b.inputs['Coat Weight'].default_value = 1.; b.inputs['Coat Roughness'].default_value = .03
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = 6.
    if alpha < 1: b.inputs['Alpha'].default_value = alpha; m.blend_method = 'BLEND' if hasattr(m, 'blend_method') else None
    return m
M = {
    'PAINT': mat('PAINT', (1.0, .6, .02), .45, .16),
    'CARBON': mat('CARBON', (.02, .021, .024), .1, .35),
    'GLASS': mat('GLASS', (.01, .013, .018), .2, .03),
    'GLOSSBLACK': mat('GLOSSBLACK', (.006, .007, .008), .3, .1),
    'GAP': mat('GAP', (.002, .002, .002), 0., .9),
    'HEAD': mat('HEAD', (.9, .95, 1.), 0., .3, emit=(.85, .92, 1.)),
    'TAIL': mat('TAIL', (1., .05, .05), 0., .3, emit=(1., .04, .06)),
    'CHROME': mat('CHROME', (.8, .82, .85), 1., .15),
    'LENS': mat('LENS', (.9, .9, .9), 0., .02, alpha=.25),
}

def new_obj(name, verts, faces, m, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob)
    me.materials.append(M[m])
    if smooth: me.shade_smooth()
    return ob

def loft(name, stations, m, cap=True, closed_ring=True, smooth=True):
    """stations: list of rings; each ring a list of blender Vectors, same length."""
    verts = [v for r in stations for v in r]; n = len(stations[0]); S = len(stations); faces = []
    for i in range(S - 1):
        for j in range(n if closed_ring else n - 1):
            a = i * n + j; b = i * n + (j + 1) % n; c = (i + 1) * n + (j + 1) % n; d = (i + 1) * n + j
            faces.append((a, b, c, d))
    if cap and closed_ring:
        for i, flip in ((0, True), (S - 1, False)):
            ring = list(range(i * n, i * n + n)); faces.append(tuple(reversed(ring)) if flip else tuple(ring))
    ob = new_obj(name, verts, faces, m, smooth)
    # make normals point outward
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    return ob

def mirror_ring(half):  # half from bottom-center to top-center (x >= 0) -> full closed ring
    return half + [(-x, y) for (x, y) in reversed(half[1:-1])]

def cr_path(pts, per):  # Catmull-Rom sample of a 2D polyline, `per` samples per segment (end included)
    out = []
    for i in range(len(pts) - 1):
        p0 = pts[max(0, i - 1)]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[min(len(pts) - 1, i + 2)]
        for k in range(per):
            t = k / per; t2 = t * t; t3 = t2 * t
            out.append(tuple(.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3) for c in (0, 1)))
    out.append(pts[-1]); return out

# ---------------------------------------------------------------- body design curves (z keys, nose = +z)
Z0, Z1 = -2.32, 2.26
TRACK = .88   # wheel centre x (BODIES.p1.tr in afterhours.js)
# traced off refs/p1_blueprint.png (front, side and plan views), mapped piecewise so its axles land on the game's z = ±1.36
HS  = [[-2.32, .45], [-2.27, .62], [-2.18, .8], [-2.09, .9], [-1.99, .95], [-1.81, .99], [-1.4, 1.0], [-.6, .98], [.1, .96], [.8, .98], [1.36, 1.0], [1.76, .99], [1.9, .95], [2.04, .86], [2.12, .77], [2.19, .62], [2.26, .44]]   # max half-width (plan)
YS  = [[-2.32, .46], [-1.6, .47], [-.9, .45], [0, .44], [.8, .43], [1.4, .42], [1.95, .38], [2.26, .33]]                                                  # width-line height
YB  = [[-2.32, .28], [-2.12, .16], [-1.9, .135], [1.8, .135], [2.05, .12], [2.26, .11]]                                                                  # underside
YF  = [[-2.32, .58], [-2.2, .66], [-2.0, .73], [-1.7, .79], [-1.36, .82], [-1.0, .8], [-.6, .79], [-.2, .77], [.3, .76], [.8, .77], [1.1, .8], [1.36, .82], [1.6, .79], [1.8, .73], [2.0, .65], [2.15, .57], [2.26, .5]]   # fender crown / shoulder (smooth beltline)
YD  = [[-2.32, .6], [-2.2, .67], [-2.0, .73], [-1.6, .78], [-1.2, .8], [-.6, .78], [0, .72], [.6, .7], [1.0, .68], [1.36, .64], [1.6, .6], [1.9, .53], [2.1, .47], [2.26, .42]]  # centre deck / hood valley
XF  = .86   # fender crown sits at 76% of the half-width
def section(z):
    hs = kf(HS, z); ys = kf(YS, z); yb = kf(YB, z); yf = max(kf(YF, z), ys + .1); yd = min(kf(YD, z), yf - .02); hl = hs - .14
    # nose rounding: the last .3 m pulls the plan and the lower corners in
    tn = clamp((z - (Z1 - .2)) / .2, 0, 1); hl *= 1 - .1 * tn * tn
    xf = hs * XF
    lower = [(0, yb), (hl * .92, yb), (hl, yb + .045)]
    upper = [(hs - .035, lerp(yb + .1, ys, .45)), (hs, ys), (hs - .012, min(ys + .14, yf - .06)), (lerp(hs, xf, .55), lerp(min(ys + .14, yf - .06), yf, .85)), (xf, yf),
             (lerp(xf, .28, .5), lerp(yf, yd, .75) + .01), (.28, yd + .012), (0, yd)]
    half = lower + cr_path([lower[-1]] + upper, int(os.environ.get('P1PER', 3)))[1:]
    return half, dict(hs=hs, ys=ys, yb=yb, yf=yf, yd=yd, hl=hl)

NS = int(os.environ.get('P1NS', 220))
stations = []
for i in range(NS):
    t = i / (NS - 1); t = .88 * t + .12 * (.5 - .5 * math.cos(math.pi * t)); z = Z0 + (Z1 - Z0) * t  # slightly denser at the ends
    half, _ = section(z); stations.append([G(x, y, z) for x, y in mirror_ring(half)])
body = loft('Body', stations, 'PAINT')

def round_poly(pts, it=3):  # Chaikin corner-cutting on a closed polygon
    for _ in range(it):
        out = []
        for i in range(len(pts)):
            a = pts[i]; b = pts[(i + 1) % len(pts)]
            out += [(.75 * a[0] + .25 * b[0], .75 * a[1] + .25 * b[1]), (.25 * a[0] + .75 * b[0], .25 * a[1] + .75 * b[1])]
        pts = out
    return pts

# ---------------------------------------------------------------- cutters (EXACT boolean, cutter material transferred onto the cut faces)
cutters = bpy.data.collections.new('Cutters'); scene.collection.children.link(cutters)
def cutter(ob, m='GAP'):
    scene.collection.objects.unlink(ob); cutters.objects.link(ob)
    ob.data.materials.clear(); ob.data.materials.append(M[m]); ob.hide_render = True; return ob

def prism(name, poly_zy, x0, x1, m='GAP'):  # side-view polygon (z, y) extruded across x
    n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    return cutter(ob, m)

def prism_z(name, poly_xy, z0, z1, m='GAP'):  # front-view polygon (x, y) extruded along z
    n = len(poly_xy); verts = [G(x, y, z0) for x, y in poly_xy] + [G(x, y, z1) for x, y in poly_xy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    return cutter(ob, m)

def cyl_x(name, cx, cy, cz, r, x0, x1, m='GAP', seg=64):
    verts = []; faces = []
    for x in (x0, x1):
        for k in range(seg):
            a = 2 * math.pi * k / seg; verts.append(G(x, cy + r * math.sin(a), cz + r * math.cos(a)))
    faces.append(tuple(range(seg))); faces.append(tuple(range(2 * seg - 1, seg - 1, -1)))
    faces += [(k, (k + 1) % seg, seg + (k + 1) % seg, seg + k) for k in range(seg)]
    ob = new_obj(name, verts, faces, m, False)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    return cutter(ob, m)

for sd in (1, -1):
    for zw in (1.36, -1.36):  # wheel arches
        cyl_x(f'arch{sd}{zw}', 0, .36, zw, .41, sd * (TRACK - .22), sd * 1.5)
    # side intake: a forward-raked parallelogram on the rear haunch, cut deep into the body
    # side scallop: the long dark swoop from behind the front wheel back to the haunch (traced off the side-profile reference)
    prism(f'scallop{sd}', round_poly([(.93, .4), (.75, .55), (.35, .6), (-.1, .64), (-.55, .66), (-.86, .62), (-.92, .48), (-.82, .3), (-.66, .17), (0, .16), (.5, .17), (.82, .24)], 2), sd * .84, sd * 1.5, 'CARBON')
    # deep intake at the back of the scallop
    prism(f'intake{sd}', round_poly([(-.3, .6), (-.62, .64), (-.84, .6), (-.8, .42), (-.62, .25), (-.34, .3)], 3), sd * .68, sd * 1.4)
    # front corner intakes below the lamps
    # front corner intakes below the lamps: a raked teardrop in front view, rising to the outer corner
    prism_z(f'fcorner{sd}', round_poly([(sd * .4, .3), (sd * .62, .315), (sd * .84, .335), (sd * .93, .28), (sd * .9, .16), (sd * .62, .14), (sd * .42, .17)], 2), 1.8, 2.7)

# center front intake (trapezoid in plan, cut through the nose)
prism_z('fcentre', round_poly([(-.3, .27), (.3, .27), (.25, .15), (-.25, .15)], 2), 1.98, 2.7)
# rear recess: the tail becomes a dark cavity holding the exhausts and the mesh
prism('rearcav', [(-2.2, .64), (-2.6, .64), (-2.6, .3), (-2.2, .3)], -.64, .64)

# hood vents + headlamp recesses follow the surface: sample it first
bvh_body = None
def body_bvh():
    dg = bpy.context.evaluated_depsgraph_get(); return BVHTree.FromObject(body, dg)
bvh_body = body_bvh()
def surf_y(x, z, y0=3.):   # height of the body surface under (x, z)
    hit = bvh_body.ray_cast(G(x, y0, z), Vector((0, 0, -1)))
    return hit[0].z if hit[0] else None
def surf_front(x, y):      # nose surface z at (x, y), cast backwards from ahead of the car
    hit = bvh_body.ray_cast(G(x, y, 3.5), Vector((0, 1, 0)))
    return -hit[0].y if hit[0] else None
def surf_back(x, y):       # tail surface z at (x, y), cast forwards from behind the car
    hit = bvh_body.ray_cast(G(x, y, -3.5), Vector((0, -1, 0)))
    return -hit[0].y if hit[0] else None
def surf_side(y, z, sd=1): # flank x at (y, z)
    hit = bvh_body.ray_cast(G(sd * 2.5, y, z), Vector((-sd, 0, 0)))
    return abs(hit[0].x) if hit[0] else None

def surface_patch(name, corners_xz, depth, lift=.25, m='GAP', n=10):
    """a prism whose bottom follows the body surface `depth` below it, bounded by a quad in plan (x,z)."""
    (ax, az), (bx, bz), (cx, cz), (dx, dz) = corners_xz  # a-b front edge, d-c rear edge
    top = []; bot = []
    for i in range(n + 1):
        t = i / n
        for (px, pz) in ((lerp(ax, dx, t), lerp(az, dz, t)), (lerp(bx, cx, t), lerp(bz, cz, t))):
            y = surf_y(px, pz); bot.append(G(px, y - depth, pz)); top.append(G(px, y + lift, pz))
    verts = bot + top; N = len(bot); faces = []
    for i in range(n):
        a, b, c, d = 2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2
        faces.append((a, b, c, d)); faces.append((N + a, N + d, N + c, N + b))
        faces.append((a, d, N + d, N + a)); faces.append((b, N + b, N + c, c))
    faces.append((0, N, N + 1, 1)); faces.append((2 * n, 2 * n + 1, N + 2 * n + 1, N + 2 * n))
    ob = new_obj(name, verts, faces, m, False)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    return cutter(ob, m)

for sd in (1, -1):
    # twin hood extractor vents, raked outwards
    surface_patch(f'vent{sd}', [(sd * .2, 2.04), (sd * .42, 2.0), (sd * .6, 1.66), (sd * .36, 1.72)], .045, m='GLOSSBLACK')

def lamp_path(sd):  # boomerang headlamp: thick at the outer fender tip, sweeping down and in to a point
    pts = []
    for k in range(11):
        t = k / 10; x = sd * lerp(.88, .44, t); y = lerp(.47, .365, t ** 1.25)
        pts.append((x, y, surf_front(x, y) - .005))
    return pts
def lamp_h(t): return lerp(.05, .012, t ** .8)   # half-height along the lamp, outer -> inner
lamp_paths = {sd: lamp_path(sd) for sd in (1, -1)}
for sd in (1, -1):
    pts = lamp_paths[sd]
    verts = []; faces = []
    for i, (x, y, z) in enumerate(pts):
        h = lamp_h(i / (len(pts) - 1))
        verts += [G(x, y - h, z + .2), G(x, y + h, z + .2), G(x, y + h, z - .055), G(x, y - h, z - .055)]
    for i in range(len(pts) - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    faces.append((0, 1, 2, 3)); L = 4 * (len(pts) - 1); faces.append((L + 3, L + 2, L + 1, L))
    ob = new_obj(f'lampcut{sd}', verts, faces, 'GLOSSBLACK', False)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free(); cutter(ob, 'GLOSSBLACK')

# apply every cut in one exact boolean
mod = body.modifiers.new('cuts', 'BOOLEAN'); mod.operation = 'DIFFERENCE'; mod.solver = 'EXACT'; mod.operand_type = 'COLLECTION'; mod.collection = cutters
if hasattr(mod, 'material_mode'): mod.material_mode = 'TRANSFER'
dg = bpy.context.evaluated_depsgraph_get()
new_me = bpy.data.meshes.new_from_object(body.evaluated_get(dg)); body.modifiers.clear(); old = body.data; body.data = new_me; bpy.data.meshes.remove(old)
for ob in list(cutters.objects): bpy.data.objects.remove(ob)

def sharpen(ob, angle=38):  # smooth shading, hard edges on creases (the glTF exporter splits normals there)
    bm = bmesh.new(); bm.from_mesh(ob.data)
    for f in bm.faces: f.smooth = True
    lim = math.radians(angle)
    for e in bm.edges:
        e.smooth = not (len(e.link_faces) == 2 and e.calc_face_angle(0) > lim) and len(e.link_faces) == 2 and e.link_faces[0].material_index == e.link_faces[1].material_index
    bm.to_mesh(ob.data); bm.free()
# black lower nose and tail bands (the P1's dark intake band and open rear)
gi = [m.name for m in body.data.materials].index('GLOSSBLACK') if 'GLOSSBLACK' in [m.name for m in body.data.materials] else None
if gi is None: body.data.materials.append(M['GLOSSBLACK']); gi = len(body.data.materials) - 1
for p in body.data.polygons:
    c = p.center; x, y, z = c.x, c.z, -c.y; n = p.normal
    if (z > 1.95 and y < .335 and -n.y > .25) or (z < -2.12 and y < .46 and n.y > .25): p.material_index = gi
sharpen(body)
bvh_body = body_bvh()

# ---------------------------------------------------------------- detail helpers
def tube(name, pts, r, m, seg=10, res=12, smooth=True):
    """Catmull-Rom tube through game-space points."""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3; cu.resolution_u = res
    cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts): p.co = (*G(*q), 1)
    sp.use_endpoint_u = True; sp.order_u = min(4, len(pts))
    ob = bpy.data.objects.new(name, cu); scene.collection.objects.link(ob); cu.materials.append(M[m])
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob); ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob)
    if smooth: me.shade_smooth()
    return ob

def box(name, size, pos, m, rot=(0, 0, 0), bevel=0.):
    sx, sy, sz = size; x, y, z = pos
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.); bm.verts.ensure_lookup_table()
    for v in bm.verts: v.co = Vector((v.co.x * sx, v.co.z * sy, v.co.y * sz))   # local game axes
    if bevel: bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel, segments=2, affect='EDGES', profile=.5)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.materials.append(M[m])
    rx, ry, rz = rot
    R = Matrix.Rotation(rz, 4, 'Z') @ Matrix.Rotation(ry, 4, 'Y') @ Matrix.Rotation(rx, 4, 'X')   # game-space rotation
    for v in me.vertices:
        g = R @ v.co; v.co = G(g.x, g.y, g.z) + G(x, y, z)
    return ob

def extrude_x(name, poly_zy, x0, x1, m, smooth=False, bevel=0.):
    n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, smooth)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if bevel: bmesh.ops.bevel(bm, geom=[e for e in bm.edges if e.calc_face_angle(0) > .6], offset=bevel, segments=2, affect='EDGES', profile=.5)
    bm.to_mesh(ob.data); bm.free(); return ob

def extrude_y(name, poly_xz, y0, y1, m, bevel=0.):  # plan-view polygon (x, z) extruded vertically
    n = len(poly_xz); verts = [G(x, y0, z) for x, z in poly_xz] + [G(x, y1, z) for x, z in poly_xz]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = new_obj(name, verts, faces, m, False)
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if bevel: bmesh.ops.bevel(bm, geom=[e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > .6], offset=bevel, segments=2, affect='EDGES', profile=.5)
    bm.to_mesh(ob.data); bm.free(); return ob

def airfoil(chord, thick, n=14):
    """cambered, inverted (downforce) profile in (z, y): leading edge at z=0, trailing edge at z=-chord."""
    up = []; lo = []
    for i in range(n + 1):
        t = i / n; xc = (1 - math.cos(math.pi * t)) / 2
        yt = 5 * thick * (.2969 * math.sqrt(xc) - .126 * xc - .3516 * xc ** 2 + .2843 * xc ** 3 - .1036 * xc ** 4)
        camb = -.05 * chord * 4 * xc * (1 - xc)   # inverted camber
        up.append((-xc * chord, camb + yt * chord)); lo.append((-xc * chord, camb - yt * chord))
    return up + list(reversed(lo[1:-1]))

# ---------------------------------------------------------------- canopy: a cab-forward visor of dark glass
CW = [[-1.28, .15], [-1.0, .3], [-.8, .4], [-.4, .56], [.05, .66], [.55, .7], [.9, .72], [1.1, .68], [1.26, .55]]
CH = [[-1.28, .86], [-1.0, .9], [-.8, .95], [-.4, 1.06], [.05, 1.13], [.3, 1.11], [.6, 1.02], [.9, .88], [1.1, .76], [1.26, .64]]
def canopy_ring(z, sc=1., lift=0., a0=0.):
    cw = kf(CW, z) * sc; top = kf(CH, z) + lift; base = kf(YD, z) - .06
    half = [(0, base), (cw, base)]
    for k in range(1, 13):
        a = a0 + (math.pi / 2 - a0) * k / 12
        sa, ca = math.sin(a), math.cos(a); half.append((cw * (1 - .4 * sa ** 1.3) * ca ** .35, base + (top - base) * sa ** .7))
    half[-1] = (0, top)
    return half
cst = []
for i in range(40):
    z = -1.28 + 2.54 * i / 39; cst.append([G(x, y, z) for x, y in mirror_ring(canopy_ring(z))])
canopy = loft('Canopy', cst, 'GLASS')

# carbon roof skin: a thin shell over the top of the glass, leaving the visor windscreen and side glass exposed
roof = []
for i in range(26):
    z = -1.05 + 1.45 * i / 25; ring = canopy_ring(z, 1.012, .008)
    top_part = [p for p in ring[2:]]; top_part = top_part[4:]   # upper band only
    outer = top_part + [(-x, y) for (x, y) in reversed(top_part[:-1])]
    inner = [(x * .985, y - .012) for (x, y) in reversed(outer)]
    roof.append([G(x, y, z) for x, y in outer + inner])
roof_ob = loft('Roof', roof, 'CARBON')


# ---------------------------------------------------------------- roof snorkel: forward-facing intake on the roof, fading back into the spine
sn = []
for i in range(16):
    z = -.12 - .78 * i / 15; top = kf(CH, z) + .004; h = .065 * (1 - smooth_t(i / 15)) + .004; w = .085 * (1 - .35 * i / 15)
    sn.append([G(-w, top - .02, z), G(w, top - .02, z), G(w * .92, top + h * .7, z), G(0, top + h, z), G(-w * .92, top + h * .7, z)])
loft('Snorkel', sn, 'CARBON')
box('SnorkelMouth', (.13, .045, .012), (0, kf(CH, -.115) + .032, -.115), 'GLOSSBLACK', rot=(-.25, 0, 0), bevel=.004)

# door/window line: gloss black trim where the glass meets the body
for sd in (1, -1):
    tube(f'dlo{sd}', [(sd * kf(CW, z) * .99, kf(YD, z) - .045 + .03, z) for z in [-1.1 + 2.05 * k / 14 for k in range(15)]], .014, 'GLOSSBLACK', res=4)

# spine fin: runs off the back of the roof and down the engine cover to the tail — in body color
fin = []
for i in range(34):
    z = -.75 - 1.52 * i / 33; s = surf_y(0, z) if z < -1.28 else kf(CH, z) + .004
    if s is None: s = kf(YD, z)
    h = .008 + .045 * clamp((-.75 - z) / .7, 0, 1) * (1 - .6 * clamp((-1.7 - z) / .57, 0, 1))
    fin.append([G(0, s - .03, z), G(.017, s - .03, z), G(.013, s + h * .75, z), G(0, s + h, z), G(-.013, s + h * .75, z), G(-.017, s - .03, z)])
loft('Fin', fin, 'PAINT')

# engine-cover louvers either side of the fin
for sd in (1, -1):
    for k in range(7):
        z = -1.42 - k * .075; x0, x1 = .06, .52
        pts = [(sd * lerp(x0, x1, t), (surf_y(sd * lerp(x0, x1, t), z) or .85) + .012, z) for t in (0, .5, 1)]
        tube(f'louvre{sd}{k}', pts, .011, 'CARBON', res=3)

# ---------------------------------------------------------------- front end
for sd in (1, -1):
    pts = lamp_paths[sd]
    n = len(pts) - 1
    led = [(x, y + lamp_h(i / n) * .55, z - .03) for i, (x, y, z) in enumerate(pts)]          # upper LED blade
    fang = [(x, y - lamp_h(i / n) * .45, z - .03) for i, (x, y, z) in enumerate(pts[:6])]       # lower signature, outer half
    tube(f'led{sd}', led, .009, 'HEAD', res=6)
    tube(f'fang{sd}', fang, .008, 'HEAD', res=4)
    for i in (1, 3):   # two projector lenses in the thick outer end
        x, y, z = pts[i]; box(f'proj{sd}{i}', (.05, .045, .02), (x, y - .004, z - .04), 'CHROME', bevel=.008)
    # canards on the nose corners
    for k, yy in enumerate((.29, .4)):
        zc = surf_front(sd * .88, yy) or 2.0
        extrude_y(f'canard{sd}{k}', [(sd * .8, zc - .1), (sd * .95, zc - .2), (sd * .97, zc - .15), (sd * .83, zc - .02)], yy - .006, yy + .006, 'CARBON', bevel=.004)
    # slats inside the corner intakes
    for k in range(3):
        y = .18 + k * .045; zc = surf_front(sd * .66, y) or 2.1
        box(f'cslat{sd}{k}', (.36, .008, .12), (sd * .66, y, zc - .07), 'GLOSSBLACK')
# center intake: three horizontal blades
for k in range(3):
    y = .175 + k * .03; zc = surf_front(0, y) or 2.2
    box(f'fslat{k}', (.46, .01, .14), (0, y, zc - .08), 'CARBON', rot=(.12, 0, 0), bevel=.003)
# splitter: a flat carbon blade with a lip, poking out ahead of the nose
spl = [(-.96, 1.9)] + [(math.sin(a) * .98, 2.14 + math.cos(a) * .12) for a in [(-math.pi / 2) + math.pi * k / 16 for k in range(17)]] + [(.96, 1.9)]
extrude_y('Splitter', spl, .085, .115, 'CARBON', bevel=.008)
for sd in (): extrude_x(f'splend{sd}', [(1.9, .12), (2.22, .12), (2.18, .2), (1.95, .24)], sd * .955, sd * .975, 'CARBON')

# ---------------------------------------------------------------- flanks
for sd in (1, -1):
    # carbon sill blade between the wheels
    sill = []
    for i in range(20):
        z = -.9 + 1.75 * i / 19; x = (surf_side(.26, z, sd) or .95)
        sill.append([G(sd * (x - .05), .17, z), G(sd * (x + .045), .17, z), G(sd * (x + .06), .195, z), G(sd * (x - .04), .24, z)])
    loft(f'Sill{sd}', sill, 'CARBON', smooth=False)
    # strake across the side intake
    st = []
    for i in range(12):
        z = .7 - 1.1 * i / 11; y = lerp(.42, .47, i / 11); x = .9
        st.append([G(sd * (x - .2), y - .012, z), G(sd * (x + .005), y - .012, z), G(sd * (x + .005), y + .012, z), G(sd * (x - .2), y + .012, z)])
    loft(f'Strake{sd}', st, 'CARBON', smooth=False)
    # mirror: carbon stalk from the door top, body-color pod
    mz = .5; my = kf(YD, mz) + .02; mx = kf(CW, mz) + .06
    tube(f'mstalk{sd}', [(sd * (mx - .05), my - .03, mz + .04), (sd * (mx + .06), my + .01, mz), (sd * (mx + .12), my + .03, mz - .02)], .012, 'CARBON', res=4)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=12, radius=1.)
    me = bpy.data.meshes.new(f'mpod{sd}'); bm.to_mesh(me); bm.free(); pod = bpy.data.objects.new(f'mpod{sd}', me); scene.collection.objects.link(pod)
    me.materials.append(M['PAINT']); me.shade_smooth()
    for v in me.vertices:
        gx, gy, gz = v.co.x * .09, v.co.z * .042, v.co.y * .07
        if gz < 0: gz *= .45   # flat back face
        v.co = G(sd * (mx + .15) + gx, my + .045 + gy, mz - .04 + gz)

for sd in (1, -1):
    xv = (surf_side(.52, -.55, sd) or .84)
    extrude_x(f'ductvane{sd}', [(-.3, .48), (-.8, .53), (-.82, .51), (-.36, .46)], sd * (xv - .17), sd * (xv - .01), 'PAINT', bevel=.004)
    extrude_x(f'ductfloor{sd}', [(-.34, .3), (-.74, .32), (-.74, .305), (-.36, .285)], sd * (xv - .2), sd * (xv - .01), 'CARBON')

# ---------------------------------------------------------------- rear
yT = surf_y(0, -2.29) or .83
for sd in (1, -1):
    # tail lamp: a thin bar across the top of the tail that hooks down each corner
    # tail lamp: a thin C that frames the open rear, across the top and hooking down each side
    cpath = [(0, .69), (.3, .69), (.55, .685), (.66, .675), (.72, .64), (.735, .55), (.73, .44), (.7, .35)]
    pts = []
    for x, y in cpath:
        zb = surf_back(sd * x, y)
        if zb is not None and zb > -2.6: pts.append((sd * x, y, zb - .006))
    if len(pts) > 2: tube(f'tail{sd}', pts, .014, 'TAIL', res=6)
    # exhausts: big round pair at the center of the cavity
    for ex in ((0,) if sd == 1 else ()):   # one big centre exhaust
        bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=False, segments=32, radius1=.1, radius2=.11, depth=.3)
        me = bpy.data.meshes.new(f'exh{sd}'); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(f'exh{sd}', me); scene.collection.objects.link(o)
        me.materials.append(M['CHROME']); me.shade_smooth()
        for v in me.vertices: v.co = G(sd * ex + v.co.x, .5 + v.co.y, -2.3 + v.co.z)
        box(f'exhin{sd}', (.17, .17, .01), (sd * ex, .5, -2.2), 'GAP')
# mesh in the rear cavity: horizontal carbon bars
for k in range(6): box(f'rbar{k}', (1.5, .012, .03), (0, .36 + k * .055, -2.22), 'CARBON')
# diffuser: flat plate + vertical strakes
extrude_y('DiffPlate', [(-.95, -2.36), (.95, -2.36), (.95, -1.9), (-.95, -1.9)], .11, .135, 'CARBON', bevel=.005)
for k in range(7):
    x = -.72 + k * .24
    extrude_x(f'diff{k}', [(-1.95, .135), (-2.34, .135), (-2.34, .27), (-2.2, .27)], x - .01, x + .01, 'CARBON', bevel=.004)

# ---------------------------------------------------------------- swan-neck rear wing
WY, WZ, SPAN = .98, -1.9, 1.56
af = airfoil(.5, .12)
wing = extrude_x('Wing', [(WZ + z, WY + y) for z, y in af], -SPAN / 2, SPAN / 2, 'PAINT', smooth=True)
# rotate a touch (angle of attack) about its leading edge
R = Matrix.Rotation(math.radians(-7), 4, 'X'); piv = G(0, WY, WZ)
for v in wing.data.vertices: v.co = piv + R @ (v.co - piv)
bm = bmesh.new(); bm.from_mesh(wing.data)
for f in bm.faces: f.smooth = abs(f.normal.x) < .9
bm.to_mesh(wing.data); bm.free()
for sd in (1, -1):
    extrude_x(f'endplate{sd}', [(WZ + .04, WY - .1), (WZ - .5, WY - .12), (WZ - .5, WY + .06), (WZ - .08, WY + .04)], sd * (SPAN / 2), sd * (SPAN / 2 + .018), 'CARBON', bevel=.004)
    # swan neck: rises from the deck, arcs up and hooks onto the top of the wing
    x = sd * .34; zb = -1.62; yb = (surf_y(x, zb) or .86) - .02
    tube(f'swan{sd}', [(x, yb, zb), (x, yb + .12, zb - .07), (x, WY + .04, WZ - .1), (x, WY + .03, WZ - .22)], .03, 'CARBON', res=8)
    pass

# ---------------------------------------------------------------- underside & arch liners (so nothing reads as a hole to the sky)
extrude_y('Floor', [(-.86, -1.95), (.86, -1.95), (.86, 1.95), (-.86, 1.95)], .1, .14, 'GLOSSBLACK', bevel=.004)

# ---------------------------------------------------------------- tidy + export
for ob in scene.collection.objects:
    if ob.type == 'MESH' and ob.name not in ('Body',) and not any(s in ob.name for s in ('Wing',)):
        pass
objs = [o for o in scene.collection.objects if o.type == 'MESH']
tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)
print('objects', len(objs), 'tris', tris)

# preview render
if RENDER:
    world = bpy.data.worlds.new('W'); scene.world = world; world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (.035, .037, .045, 1); world.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.
    bpy.ops.mesh.primitive_plane_add(size=40); fl = bpy.context.active_object; fm = mat('FLOOR', (.05, .05, .055), 0., .35); fl.data.materials.append(fm)
    # stand-in wheels for the preview (the game builds its own wheels in afterhours.js)
    tm = mat('TYRE', (.015, .015, .016), 0., .75); rm = mat('RIM', (.03, .03, .035), .8, .25)
    for sx in (1, -1):
        for zw in (1.36, -1.36):
            c = G(sx * TRACK, .36, zw)
            bpy.ops.mesh.primitive_cylinder_add(radius=.36, depth=.3, location=c, rotation=(0, math.pi / 2, 0)); w = bpy.context.active_object; w.data.materials.append(tm)
            bpy.ops.mesh.primitive_cylinder_add(radius=.27, depth=.02, location=c + Vector((sx * .15, 0, 0)), rotation=(0, math.pi / 2, 0)); w = bpy.context.active_object; w.data.materials.append(rm)
            for k in range(10):
                a = 2 * math.pi * k / 10
                bpy.ops.mesh.primitive_cube_add(size=1, location=c + Vector((sx * .165, .14 * math.sin(a), -.14 * math.cos(a)))); sp = bpy.context.active_object
                sp.scale = (.012, .04, .17); sp.rotation_euler = (a, 0, 0); sp.data.materials.append(rm)
    def light(name, loc, energy, size, col=(1, 1, 1)):
        L = bpy.data.lights.new(name, 'AREA'); L.energy = energy; L.size = size; L.color = col
        o = bpy.data.objects.new(name, L); scene.collection.objects.link(o); o.location = loc
        d = Vector((0, 0, .5)) - o.location; o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    light('key', (4, 3, 6), 3000, 5); light('rim', (-5, -4, 3), 1800, 4, (.7, .8, 1.)); light('fill', (-3, 5, 2), 700, 6); light('top', (0, 0, 8), 1200, 8)
    cam = bpy.data.cameras.new('C'); cam.lens = 55; co = bpy.data.objects.new('C', cam); scene.collection.objects.link(co); scene.camera = co
    scene.render.engine = 'CYCLES'; scene.cycles.samples = int(os.environ.get('P1SAMPLES', 20)); scene.cycles.device = 'CPU'; scene.cycles.use_denoising = True
    scene.render.resolution_x = 960; scene.render.resolution_y = 540
    scene.view_settings.view_transform = 'AgX' if 'AgX' in [v.identifier for v in scene.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
    VIEWS = {'front': G(4.6, 1.35, 4.9), 'rear': G(-4.4, 1.6, -5.2), 'side': G(7.5, .9, .1), 'top': G(3.2, 5.5, 2.2), 'headon': G(0, .75, 8.2), 'rearlow': G(-4.6, .75, -5.6), 'front34': G(-4.2, 1.05, 5.4)}
    for tag, pos in [(t, VIEWS[t]) for t in os.environ.get('P1VIEWS', 'front,rear,side,top').split(',')]:
        co.location = pos; d = G(0, .55, 0) - pos; co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        scene.render.filepath = f'{RENDER}_{tag}.png'; bpy.ops.render.render(write_still=True)
    for o in list(scene.collection.objects):
        if o.type != 'MESH' or o.name.startswith(('Plane', 'Cylinder', 'Cube')): bpy.data.objects.remove(o)

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True,
                          export_normals=True, export_texcoords=False, export_materials='EXPORT', export_lights=False, export_cameras=False)
print('wrote', OUT, os.path.getsize(OUT))
