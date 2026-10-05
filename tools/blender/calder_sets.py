"""AFTERHOURS — Calder Basin set pieces, v3 (Blender 5.x, bpy). Modelled against the Midjourney frames in docs/calder-ref and
look-dev'd in Cycles beside them before export. Game coords: x right, y up, z forward. Blender: (x, -z, y).

Assets (Empty + parented parts, one material per part, origin at grade):
  BridgeSpan   — one 120 m span of the Steel Bridge (frames 09/10): deep red box-truss arch ribs, Warren web, dense
                 overhead lattice, vertical hangers, red parapet railing with lit plinths, swan-neck lamps; span along z
  OTHouseA/B/C — Old Town houses (frames 11-14), facade on +x: honey stone, stone-framed lit windows, shutters, iron
                 balconies with flower boxes, arched shopfronts with awnings, tile eaves, lanterns, bougainvillea
  BellTower    — the plaza bell tower (frames 11/12): square shaft, lit arched belfry, octagonal lantern, dome, clock
  Palm         — date palm for the Old Town (frames 11/12)
  SwanPole     — Highway 9 light pole (frame 15): tapered mast, sweeping arm with an LED strip on its underside
  SoundWall    — 6 m Highway 9 sound-wall panel (frame 15): white frame, lit vertical slots
  Pier9        — slender white viaduct pier (1 m tall, the game scales y)
  SignGantry   — green truss sign bridge over the quay road (frame 01), 22 m span
  StoneWall    — 8 m dry-stone retaining wall module for the ridge hairpins (frame 02)
CLI:   blender -b -P calder_sets.py -- --out ../../models/calder_sets_kit.glb
Live:  exec inside Blender — builds 'Calder Sets LD' (the kit + look-dev sets with a camera per reference frame).
"""
import bpy, bmesh, math, sys, os, random
from mathutils import Vector, Matrix
ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGV[ARGV.index('--out') + 1] if '--out' in ARGV else None
PI, TAU = math.pi, math.tau
def G(x, y, z): return Vector((x, -z, y))

SC = 'Calder Sets LD'
old = bpy.data.scenes.get(SC)
if old:
    for o in list(old.objects): bpy.data.objects.remove(o)
    bpy.data.scenes.remove(old)
for c in [c for c in bpy.data.collections if c.name.startswith('CS_') or c.name in ('CalderSetsKit', 'SetsLD')]: bpy.data.collections.remove(c)
scene = bpy.data.scenes.new(SC)
if bpy.context.window: bpy.context.window.scene = scene
kit = bpy.data.collections.new('CalderSetsKit'); scene.collection.children.link(kit)
ld = bpy.data.collections.new('SetsLD'); scene.collection.children.link(ld)

MATS = {}
def mat(name, col, metal=0., rough=.5, emit=None, es=0.):
    if bpy.data.materials.get(name): bpy.data.materials.remove(bpy.data.materials[name])
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    MATS[name] = m; return m
mat('REDSTEEL', (.5, .05, .035), .55, .38); mat('STEEL', (.3, .32, .35), .85, .35); mat('DARK', (.03, .03, .035), .3, .5)
mat('LAMP', (1, .9, .7), 0, .3, emit=(1., .72, .42), es=14.); mat('REDLAMP', (1, .1, .08), 0, .3, emit=(1., .08, .05), es=14.)
mat('PLINTH', (1, .8, .6), 0, .3, emit=(1., .5, .2), es=6.)
mat('HONEY', (.66, .5, .32), 0, .85); mat('HONEY2', (.58, .4, .25), 0, .85); mat('STONE', (.36, .32, .27), 0, .9); mat('TRIM_LIGHT', (.82, .76, .64), 0, .65)
mat('TILE', (.42, .18, .1), 0, .75); mat('IRON', (.03, .03, .035), .7, .45); mat('WOODSH', (.16, .25, .2), 0, .75); mat('WOOD', (.25, .13, .07), 0, .7)
mat('WINLIT', (1, .8, .5), 0, .3, emit=(1., .66, .32), es=5.); mat('DARKGLASS', (.02, .025, .03), .8, .12); mat('WARM', (1, .85, .6), 0, .3, emit=(1., .66, .34), es=3.2)
mat('AWNING', (.45, .05, .05), 0, .8); mat('FLOWER', (.6, .04, .22), 0, .8); mat('LEAF', (.05, .13, .06), 0, .9); mat('BARK', (.2, .15, .1), 0, 1)
mat('CLOCK', (1, .95, .82), 0, .4, emit=(1., .9, .72), es=5.); mat('DOME', (.25, .35, .32), .6, .4)
mat('WHITECON', (.82, .82, .8), 0, .45); mat('LED', (1, .9, .8), 0, .3, emit=(1., .6, .3), es=30.)
mat('SIGNGREEN', (.03, .3, .14), .1, .5); mat('GANTRY', (.32, .55, .42), .5, .45); mat('DRYSTONE', (.42, .38, .32), 0, .95); mat('CONCRETE', (.5, .5, .49), 0, .85)

roots = {}
def root(a):
    if a not in roots:
        e = bpy.data.objects.new(a, None); kit.objects.link(e); roots[a] = e
    return roots[a]
def add(name, bm, m, a=None, coll=None, smooth=False):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(MATS[m])
    if smooth:
        for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(name, me); (coll or kit).objects.link(ob)
    if a: ob.parent = root(a)
    return ob
def bevel_bm(bm, off, seg=1):
    es = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > .6]
    if es and off > 0: bmesh.ops.bevel(bm, geom=es, offset=off, segments=seg, affect='EDGES', profile=.5, clamp_overlap=True)
    return bm
def box(sx, sy, sz, gx=0, gy=0, gz=0, bevel=0.):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    for v in bm.verts: v.co = Vector((v.co.x * sx, v.co.y * sz, v.co.z * sy)) + G(gx, gy, gz)
    return bevel_bm(bm, min(bevel, .45 * min(sx, sy, sz)))
# merge many small parts into one mesh per (asset, material): far fewer objects, one draw call per material in the game
PARTS = {}
def part(a, m, bm):
    key = (a, m)
    if key not in PARTS: PARTS[key] = bmesh.new()
    me = bpy.data.meshes.new('tmp'); bm.to_mesh(me); bm.free(); PARTS[key].from_mesh(me); bpy.data.meshes.remove(me)
def Bx(a, m, sx, sy, sz, gx, gy, gz, bevel=.03): part(a, m, box(sx, sy, sz, gx, gy, gz, bevel))
def beam(a, m, p, q, w, h=None, bevel=.02):
    h = h or w; P, Q = G(*p), G(*q); d = Q - P; L = d.length; t = d.normalized()
    up = Vector((0, 0, 1)) if abs(t.z) < .95 else Vector((1, 0, 0)); u = t.cross(up).normalized(); v = u.cross(t).normalized()
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    M = Matrix(((u.x * w, v.x * h, t.x * L), (u.y * w, v.y * h, t.y * L), (u.z * w, v.z * h, t.z * L)))
    for vv in bm.verts: vv.co = M @ vv.co + (P + Q) / 2
    part(a, m, bevel_bm(bm, min(bevel, .4 * min(w, h))))
def cyl(a, m, r, h, gx, gy, gz, seg=12, r2=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    for v in bm.verts: v.co = v.co + G(gx, gy + h / 2, gz)
    part(a, m, bm)
def tubep(a, m, pts, r, segs=8):
    bm = bmesh.new(); rings = []
    for k, p in enumerate(pts):
        t = (pts[min(k + 1, len(pts) - 1)] - pts[max(k - 1, 0)]).normalized()
        u = t.cross(Vector((0, 0, 1))); u = (u if u.length > 1e-4 else t.cross(Vector((1, 0, 0)))).normalized(); v = t.cross(u)
        rings.append([bm.verts.new(p + (u * math.cos(q) + v * math.sin(q)) * r) for q in [i / segs * TAU for i in range(segs)]])
    for k in range(len(rings) - 1):
        for i in range(segs): bm.faces.new((rings[k][i], rings[k][(i + 1) % segs], rings[k + 1][(i + 1) % segs], rings[k + 1][i]))
    part(a, m, bm)
def flush():
    for (a, m), bm in PARTS.items():
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); add(f'{a}_{m}', bm, m, a, smooth=False)
    PARTS.clear()

# ================= BridgeSpan (frames 09/10) =================
A = 'BridgeSpan'
HALF, RISE, X = 60., 27., 11.2
def up(z): return RISE * (1 - (z / HALF) ** 2) + 1.4
def lo(z): return max(1.4, up(z) - (4.2 + 4.4 * (abs(z) / HALF) ** 2))     # deep at the springings, slender at the crown
NS = 20; zs = [-HALF + 2 * HALF * i / NS for i in range(NS + 1)]
for sx in (-1, 1):
    x = sx * X
    for z0, z1 in zip(zs[:-1], zs[1:]):
        beam(A, 'REDSTEEL', (x, up(z0), z0), (x, up(z1), z1), 2.0, 2.6); beam(A, 'REDSTEEL', (x, lo(z0), z0), (x, lo(z1), z1), 1.6, 2.0)
    for i, z in enumerate(zs):
        if 0 < i < NS: beam(A, 'REDSTEEL', (x, lo(z), z), (x, up(z), z), .5, .6)
        if i < NS:
            zn = zs[i + 1]; beam(A, 'REDSTEEL', (x, lo(z), z), (x, up(zn), zn), .38) if i % 2 == 0 else beam(A, 'REDSTEEL', (x, up(z), z), (x, lo(zn), zn), .38)
        if lo(z) > 2.6: beam(A, 'STEEL', (x * .99, 1.0, z), (x * .99, lo(z), z), .12)                      # hangers
        if 0 < i < NS and i % 2 == 0: Bx(A, 'LAMP', .5, .35, .5, x - sx * .85, up(z) - .9, z, 0.)        # node uplights (frame 09)
    beam(A, 'REDSTEEL', (x, .55, -HALF), (x, .55, HALF), 1.2, 1.9)                                    # tie girder
    for z in (-HALF, HALF): Bx(A, 'CONCRETE', 2.8, 1.2, 3.6, x, -.5, z, .08)
    # parapet: red railing on a lit plinth (frame 10)
    px = sx * (X - 1.5)
    beam(A, 'REDSTEEL', (px, 1.15, -HALF), (px, 1.15, HALF), .12, .12); beam(A, 'REDSTEEL', (px, .75, -HALF), (px, .75, HALF), .08, .08)
    beam(A, 'REDSTEEL', (px, .35, -HALF), (px, .35, HALF), .25, .3)
    for k in range(int(2 * HALF / 2.4)):
        z = -HALF + 1.2 + k * 2.4; Bx(A, 'REDSTEEL', .1, 1.0, .1, px, .65, z, 0.)
        if k % 5 == 2: Bx(A, 'PLINTH', .06, .22, .7, px - sx * .14, .3, z, 0.)
    # swan-neck lamps every 30 m (frame 09)
    for z in (-45., -15., 15., 45.):
        cyl(A, 'STEEL', .14, 9, px + sx * .3, 0, z, 8, .1)
        arm = [G(px + sx * .3 - sx * 2.6 * (1 - math.cos(t * PI / 2)), 9 + 1.2 * math.sin(t * PI / 2), z) for t in [i / 8 for i in range(9)]]
        tubep(A, 'STEEL', arm, .09, 6); Bx(A, 'LAMP', .7, .18, .4, px + sx * .3 - sx * 2.6, 10.1, z, 0.)
for i, z in enumerate(zs[1:-1]):                                            # overhead: struts, X bracing, two stringers
    y = up(z); beam(A, 'REDSTEEL', (-X, y, z), (X, y, z), .7, .9)
for z0, z1 in zip(zs[1:-2], zs[2:-1]):
    beam(A, 'REDSTEEL', (-X, up(z0), z0), (X, up(z1), z1), .3); beam(A, 'REDSTEEL', (X, up(z0), z0), (-X, up(z1), z1), .3)
    for f in (-.35, .35): beam(A, 'REDSTEEL', (f * X * 2, up(z0) + .1, z0), (f * X * 2, up(z1) + .1, z1), .28)
for z in (-HALF + 10, HALF - 10):                                           # portal frames
    y = lo(z) - .2; beam(A, 'REDSTEEL', (-X, y, z), (X, y, z), 1.2, 1.7)
    for sx in (-1, 1): beam(A, 'REDSTEEL', (sx * X, y - 3.2, z), (sx * X * .55, y, z), .55)
for sx in (-1, 1): cyl(A, 'REDLAMP', .4, .5, sx * X, RISE + 2.5, 0, 8)
flush()

# ================= Old Town houses (frames 11-14) =================
def house(A, W, floors, shop=True, balc=(1,), seed=1):
    R = random.Random(seed); D = 9.; FH = 3.5; H = 1.2 + floors * FH
    Bx(A, 'HONEY' if seed % 2 else 'HONEY2', D, H, W, -D / 2, H / 2, 0, .04)
    Bx(A, 'STONE', .35, 1.1, W, .1, .55, 0, .03)                                              # base course
    for f in range(floors - 1): Bx(A, 'TRIM_LIGHT', .25, .22, W + .05, .05, 1.2 + FH * (f + 1) - .1, 0, .02)   # string courses
    Bx(A, 'TRIM_LIGHT', 1.0, .45, W + .5, .25, H + .1, 0, .05); Bx(A, 'TRIM_LIGHT', .7, .25, W + .3, .15, H - .3, 0, .03)   # cornice
    for k in range(int(W / .5) + 1): Bx(A, 'TRIM_LIGHT', .45, .22, .18, .25, H - .55, -W / 2 + .25 + k * .5, 0.)              # corbel brackets
    # tile eave + roof
    bm = bmesh.new(); V = [bm.verts.new(G(x, y, z)) for z in (-W / 2 - .4, W / 2 + .4) for (x, y) in ((1.0, H + .35), (-D / 2, H + 2.6), (-D - .3, H + .35))]
    bm.faces.new((V[0], V[3], V[4], V[1])); bm.faces.new((V[1], V[4], V[5], V[2])); bm.faces.new((V[0], V[1], V[2])); bm.faces.new((V[5], V[4], V[3]))
    bm.normal_update(); part(A, 'TILE', bm)
    nb = max(2, int(W / 2.6)); zs = [-W / 2 + W * (i + .5) / nb for i in range(nb)]
    # ground floor: arched shopfronts / doors with awnings, lit
    for i, z in enumerate(zs):
        if shop and i % 2 == 0:
            Bx(A, 'WARM', .12, 2.6, 2.0, .04, 1.5, z, 0.); Bx(A, 'TRIM_LIGHT', .22, .3, 2.5, .1, 2.95, z, .02)
            for s in (-1, 1): Bx(A, 'TRIM_LIGHT', .22, 2.8, .25, .1, 1.4, z + s * 1.12, .02)
            bm = bmesh.new(); V = [bm.verts.new(G(x, y, zz)) for zz in (z - 1.25, z + 1.25) for (x, y) in ((.15, 3.2), (1.6, 2.6))]
            bm.faces.new((V[0], V[1], V[3], V[2])); part(A, 'AWNING', bm)
        else:
            Bx(A, 'WOOD', .12, 2.5, 1.3, .04, 1.25, z, 0.); Bx(A, 'WARM', .14, .45, 1.0, .05, 2.75, z, 0.)                 # door + lit fanlight
            Bx(A, 'TRIM_LIGHT', .22, .35, 1.8, .1, 3.1, z, .03)
            Bx(A, 'LAMP', .22, .4, .22, .45, 3.0, z + 1.0, 0.); Bx(A, 'IRON', .45, .06, .06, .25, 3.3, z + 1.0, 0.)          # wall lantern
    # upper floors: stone-framed windows (lit or dark), open shutters, balconies with flower boxes
    for f in range(1, floors):
        y = 1.2 + FH * f + 1.3
        for i, z in enumerate(zs):
            lit = R.random() < .62
            Bx(A, 'WINLIT' if lit else 'DARKGLASS', .1, 1.9, 1.05, .03, y, z, 0.)
            Bx(A, 'TRIM_LIGHT', .2, .2, 1.4, .08, y - 1.05, z, .02); Bx(A, 'TRIM_LIGHT', .2, .3, 1.5, .08, y + 1.1, z, .02)
            for s in (-1, 1): Bx(A, 'TRIM_LIGHT', .18, 2.1, .16, .08, y, z + s * .6, .01); Bx(A, 'WOODSH', .06, 1.9, .55, .3, y, z + s * .95, 0.)
            if f in balc:
                Bx(A, 'TRIM_LIGHT', 1.0, .16, 1.9, .5, y - 1.0, z, .02)                                       # balcony slab
                for k in range(2): Bx(A, 'TRIM_LIGHT', .7, .3, .15, .35, y - 1.25, z + (k - .5) * 1.3, .02)   # corbels
                for k in range(8): Bx(A, 'IRON', .03, .9, .03, .97, y - .45, z - .85 + k * .243, 0.)
                Bx(A, 'IRON', .05, .05, 1.85, .97, y, z, 0.); Bx(A, 'FLOWER', .25, .3, 1.6, .85, y - .7, z, .03)
    # potted plants by the doors and a climbing vine strip (frames 12/13)
    for i, z in enumerate(zs):
        if i % 2: continue
        cyl(A, 'TILE', .32, .55, .7, 0, z + 1.4, 10, .42)
        bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=2, radius=.55)
        for v in bm.verts: v.co = Vector((v.co.x, v.co.y, v.co.z * 1.3)) + G(.7, 1.15, z + 1.4)
        part(A, 'LEAF', bm)
    flush()
house('OTHouseA', 9., 3, True, (1,), 1)
house('OTHouseB', 7., 4, False, (1, 2), 2)
house('OTHouseC', 11., 3, True, (2,), 3)

# ================= BellTower (frames 11/12) =================
A = 'BellTower'
T = 6.
Bx(A, 'STONE', T + 1.4, 2.5, T + 1.4, 0, 1.25, 0, .08)
Bx(A, 'HONEY', T, 24, T, 0, 14.5, 0, .05)
for y in (9, 17, 26.5): Bx(A, 'TRIM_LIGHT', T + .5, .45, T + .5, 0, y, 0, .05)
Bx(A, 'HONEY', T + .4, 7.5, T + .4, 0, 30.5, 0, .06)                                            # belfry
for k, (dx, dz) in enumerate(((1, 0), (-1, 0), (0, 1), (0, -1))):
    for j in (-1, 1):                                                                          # two lit arched openings a side
        ox, oz = dx * (T / 2 + .22), dz * (T / 2 + .22); off = j * 1.25
        cx, cz = (ox, oz + off) if dx else (ox + off, oz)
        Bx(A, 'WARM', .12 if dx else 1.5, 4.0, 1.5 if dx else .12, cx, 30.2, cz, 0.)
    Bx(A, 'CLOCK', .12 if dx else 2.6, 2.6, 2.6 if dx else .12, dx * (T / 2 + .06), 22.5, dz * (T / 2 + .06), 0.)
Bx(A, 'TRIM_LIGHT', T + 1.2, .6, T + 1.2, 0, 34.5, 0, .08)
bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=2.9, radius2=2.9, depth=4.5)       # octagonal lantern
for v in bm.verts: v.co = v.co + G(0, 37.1, 0)
part(A, 'HONEY', bm)
for k in range(8):
    a = TAU * k / 8 + TAU / 16; Bx(A, 'WARM', .9, 2.2, .9, 2.75 * math.cos(a), 37.0, 2.75 * math.sin(a), 0.)
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=3.0)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -.01], context='VERTS')
for v in bm.verts: v.co = Vector((v.co.x, v.co.y, v.co.z * 1.25)) + G(0, 39.4, 0)
part(A, 'DOME', bm); cyl(A, 'IRON', .12, 3, 0, 43, 0, 6)
flush()

# ================= Palm =================
A = 'Palm'
pts = [G(.06 * k * k * .1, k * .9, 0) for k in range(14)]
for k in range(13):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=False, segments=8, radius1=.32 - k * .008, radius2=.3 - k * .008, depth=.95)
    d = pts[k + 1] - pts[k]; R0 = d.to_track_quat('Z', 'Y').to_matrix().to_4x4()
    for v in bm.verts: v.co = (R0 @ v.co) + (pts[k] + pts[k + 1]) / 2
    part(A, 'BARK', bm)
top = pts[-1]
for j in range(14):
    a = TAU * j / 14; bm = bmesh.new(); rows = []
    for i in range(9):
        u = i / 8; L = 4.2 * u; dx, dz = math.cos(a) * L, math.sin(a) * L; dy = 1.0 * u - 2.6 * u * u; w = .55 * math.sin(PI * min(1, u * 1.1)) + .05
        n = Vector((-math.sin(a), math.cos(a), 0))
        c = top + Vector((dx, -dz, dy)); rows.append((bm.verts.new(c + Vector((n.x, -n.y, 0)) * w), bm.verts.new(c - Vector((n.x, -n.y, 0)) * w)))
    for i in range(8): bm.faces.new((rows[i][0], rows[i][1], rows[i + 1][1], rows[i + 1][0]))
    part(A, 'LEAF', bm)
flush()

# ================= Highway 9 (frame 15) =================
A = 'SwanPole'
cyl(A, 'WHITECON', .26, 12.5, 0, 0, 0, 12, .14)
arm = [G(-4.6 * (1 - math.cos(t * PI / 2)) ** 1.0, 12.5 + 1.8 * math.sin(t * PI) - .6 * t, 0) for t in [i / 16 for i in range(17)]]
tubep(A, 'WHITECON', arm, .13, 8)
tubep(A, 'LED', [p + Vector((0, 0, -.13)) for p in arm[3:]], .05, 6)
Bx(A, 'LED', .9, .1, .3, -4.6, 11.6, 0, 0.)
flush()
A = 'SoundWall'
Bx(A, 'WHITECON', .45, 3.6, 6., 0, 1.8, 0, .06); Bx(A, 'WHITECON', .8, .35, 6., 0, 3.75, 0, .05)
for k in range(3):
    z = -2 + k * 2; Bx(A, 'DARK', .2, 2.4, .9, .17, 2.0, z, .0); Bx(A, 'WARM', .06, 1.9, .14, .28, 2.0, z + .3, 0.)
flush()
A = 'Pier9'
bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=1.6, radius2=1.15, depth=1)
for v in bm.verts: v.co = Vector((v.co.x * 1.0, v.co.y * .62, v.co.z)) + G(0, .5, 0)
part(A, 'WHITECON', bm); flush()

# ================= SignGantry (frame 01) =================
A = 'SignGantry'
SPN, GH = 11.5, 7.6
for sx in (-1, 1):
    for dz in (-.6, .6):
        beam(A, 'GANTRY', (sx * SPN, 0, dz), (sx * SPN, GH + 1.2, dz), .28)
    for y in range(1, 9, 2): beam(A, 'GANTRY', (sx * SPN, y, -.6), (sx * SPN, y + 1.6, .6), .1)
for y in (GH, GH + 1.2):
    for dz in (-.6, .6): beam(A, 'GANTRY', (-SPN, y, dz), (SPN, y, dz), .22)
for k in range(24):
    x0 = -SPN + k * 2 * SPN / 24; x1 = x0 + 2 * SPN / 24
    beam(A, 'GANTRY', (x0, GH, -.6), (x1, GH + 1.2, -.6), .08); beam(A, 'GANTRY', (x0, GH, .6), (x1, GH + 1.2, .6), .08)
for x in (-5.2, 5.2): Bx(A, 'SIGNGREEN', 8.6, 2.6, .14, x, GH - .6, -.85, .03)
flush()

# ================= StoneWall (frame 02) =================
A = 'StoneWall'
bm = bmesh.new(); V = [bm.verts.new(G(x, y, z)) for z in (-4, 4) for (x, y) in ((0, 0), (0, 5.2), (-.9, 5.2), (-1.8, 0))]
bm.faces.new(V[:4][::-1]); bm.faces.new(V[4:])
for k in range(4): bm.faces.new((V[k], V[(k + 1) % 4], V[4 + (k + 1) % 4], V[4 + k]))
bm.normal_update(); part(A, 'DRYSTONE', bm)
Bx(A, 'TRIM_LIGHT', 1.2, .35, 8., -.45, 5.35, 0, .05)
R = random.Random(9)
for k in range(40):                                                     # proud stones break the face up
    Bx(A, 'DRYSTONE', .25, .35 + R.random() * .35, .5 + R.random() * .7, .05, .4 + R.random() * 4.5, -3.6 + R.random() * 7.2, .08)
flush()

# ================= look-dev sets =================
def inst(asset, x, y, z, ry=0., s=1.):
    cname = 'CS_' + asset
    if cname not in bpy.data.collections:
        c = bpy.data.collections.new(cname)
        for ch in root(asset).children: c.objects.link(ch)
    e = bpy.data.objects.new(asset + '_ld', None); e.instance_type = 'COLLECTION'; e.instance_collection = bpy.data.collections[cname]
    e.location = G(x, y, z); e.rotation_euler[2] = ry; e.scale = (s, s, s); ld.objects.link(e); return e
def plane(name, m, x0, x1, z0, z1, y=0.):
    bm = bmesh.new(); V = [bm.verts.new(G(x, y, z)) for (x, z) in ((x0, z0), (x1, z0), (x1, z1), (x0, z1))]; bm.faces.new(V)
    add(name, bm, m, coll=ld)
mat('ROADWET', (.03, .03, .035), .3, .1); mat('WATER', (.01, .015, .02), .9, .06); mat('COBBLE', (.12, .1, .08), .1, .25)
mat('CITYWIN', (1, .85, .6), 0, .4, emit=(1., .75, .45), es=3.); mat('CITYDARK', (.02, .025, .035), .5, .4)
mat('BULB', (1, .9, .7), 0, .3, emit=(1., .72, .4), es=60.)
# --- bridge set (frames 09/10): three spans, wet deck, harbor, skyline ---
BX = 0.
for k in (-1, 0, 1): inst('BridgeSpan', BX, 0, k * 120)
plane('BR_deck', 'ROADWET', BX - 9.4, BX + 9.4, -200, 200, .02); plane('BR_water', 'WATER', BX - 900, BX + 900, -400, 1400, -14)
R = random.Random(4)
for k in range(140):
    x = BX + R.uniform(-700, 700); z = R.uniform(700, 1100); h = R.uniform(15, 110) * (1.4 if abs(x - BX) < 250 else .8); w = R.uniform(12, 30)
    bm = box(w, h, w, x, h / 2 - 14, z); add(f'BR_bld{k}', bm, 'CITYDARK', coll=ld)
    for j in range(int(h / 9)):
        if R.random() < .7: add(f'BR_w{k}_{j}', box(w * .8, 1.2, .3, x, j * 9 + 4 - 14, z - w / 2 - .2), 'CITYWIN', coll=ld)
# --- old town set (frames 11-14): cobbled street, houses both sides, tower at the end, palms, string lights ---
OX = 1500.
plane('OT_street', 'COBBLE', OX - 9, OX + 9, -20, 160, .0)
z = -10.; R = random.Random(12); kinds = ['OTHouseA', 'OTHouseB', 'OTHouseC']; widths = {'OTHouseA': 9., 'OTHouseB': 7., 'OTHouseC': 11.}
while z < 120:
    for sd in (-1, 1):
        kd = R.choice(kinds); inst(kd, OX + sd * 6.0, 0, z + widths[kd] / 2 + (0 if sd > 0 else 3), PI if sd > 0 else 0.)
    z += 10.
inst('BellTower', OX + 2, 0, 150)
for zz in (18., 52., 88.): inst('Palm', OX - 4.6, 0, zz); inst('Palm', OX + 4.8, 0, zz + 15)
for k in range(26):                                                     # zig-zag festoons of bulbs between the eaves
    z0 = 2 + k * 5; ya, yb = 8.5 + (k % 3), 9.0 + ((k + 1) % 3)
    pts = [G(OX - 5.8 + 11.6 * t, ya + (yb - ya) * t - 1.6 * math.sin(PI * t), z0 + 5 * t) for t in [i / 20 for i in range(21)]]
    for p in pts[1:-1]:
        bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=1, radius=.075)
        for v in bm.verts: v.co += p
        add(f'OT_b{k}_{len(pts)}_{p.x:.0f}{p.y:.0f}', bm, 'BULB', coll=ld)
# --- Highway 9 set (frame 15): curved white deck on piers, LED fascia, swan poles, sound walls, cypresses ---
HX = 3000.
def hw(t): a = -.4 + t * 1.1; return Vector((HX + 260 * math.sin(a), 0, 260 * (1 - math.cos(a))))
N = 60; bm = bmesh.new(); prev = None
for i in range(N + 1):
    c = hw(i / N); d = (hw(min(1, i / N + .01)) - hw(max(0, i / N - .01))).normalized(); n = Vector((d.z, 0, -d.x))
    row = [bm.verts.new(G(*(c + n * o + Vector((0, y, 0))))) for (o, y) in ((-11.5, 0), (11.5, 0), (11.9, -.6), (11.6, -1.9), (10.6, -2.4), (-10.6, -2.4), (-11.6, -1.9), (-11.9, -.6))]
    if prev:
        for k in range(8): bm.faces.new((prev[k], prev[(k + 1) % 8], row[(k + 1) % 8], row[k]))
    prev = row
add('HW_deck', bm, 'WHITECON', coll=ld)
bm = bmesh.new(); prev = None
for i in range(N + 1):
    c = hw(i / N); d = (hw(min(1, i / N + .01)) - hw(max(0, i / N - .01))).normalized(); n = Vector((d.z, 0, -d.x))
    row = [bm.verts.new(G(*(c + n * -11.98 + Vector((0, y, 0))))) for y in (-1.25, -.85)]
    if prev: bm.faces.new((prev[0], prev[1], row[1], row[0]))
    prev = row
add('HW_led', bm, 'LED', coll=ld)
plane('HW_road', 'ROADWET', HX - 300, HX + 300, -100, 400, -40)
for i in range(0, N + 1, 4):
    c = hw(i / N); d = (hw(min(1, i / N + .01)) - hw(max(0, i / N - .01))).normalized(); ry = math.atan2(d.x, d.z); n = Vector((d.z, 0, -d.x))
    e = inst('Pier9', c.x, -40, c.z, -ry); e.scale = (1, 1, 38)
    p = c + n * 10.8; inst('SwanPole', p.x, 0, p.z, -ry)
    for j in range(2):
        q = c + n * 11.0 + d * (j * 6 - 3); inst('SoundWall', q.x, 0, q.z, -ry)
R = random.Random(21)
for k in range(160):
    x, z = HX + R.uniform(-280, 280), R.uniform(-60, 380); h = R.uniform(9, 16)
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=7, radius1=1.2, radius2=.05, depth=h)
    for v in bm.verts: v.co += G(x, h / 2 - 40, z)
    add(f'HW_cyp{k}', bm, 'LEAF', coll=ld)

# ================= world, cameras, render =================
if bpy.data.worlds.get('CalderSetsDusk'): bpy.data.worlds.remove(bpy.data.worlds['CalderSetsDusk'])
w = bpy.data.worlds.new('CalderSetsDusk'); scene.world = w; w.use_nodes = True; nt = w.node_tree; bg = nt.nodes['Background']
sky = nt.nodes.new('ShaderNodeTexSky')
for k, v in (('sun_elevation', math.radians(-1.)), ('sun_rotation', math.radians(180)), ('altitude', 300.), ('air_density', 1.6), ('aerosol_density', 3.), ('ozone_density', 3.)):
    try: setattr(sky, k, v)
    except Exception: pass
nt.links.new(sky.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = .14
def cam(name, p, l, fov=60.):
    cd = bpy.data.cameras.new(name); cd.angle = math.radians(fov); cd.clip_end = 4000; o = bpy.data.objects.new(name, cd); ld.objects.link(o)
    o.location = G(*p); o.rotation_euler = (G(*l) - o.location).to_track_quat('-Z', 'Y').to_euler(); return o
cam('CAM_bridge', (BX + 3.0, 1.3, -165), (BX + .5, 4.5, 0), 84)
cam('CAM_oldtown', (OX + 1.2, 1.1, -12), (OX + .2, 7.5, 120), 58)
cam('CAM_highway', (HX - 40, 6, -40), (HX + 60, -4, 90), 55)
r = scene.render; r.resolution_x, r.resolution_y = 960, 540; r.engine = 'CYCLES'
scene.cycles.device = 'CPU'; scene.cycles.samples = 24; scene.cycles.use_denoising = True; scene.cycles.max_bounces = 4
r.image_settings.file_format = 'JPEG'; r.image_settings.quality = 88
try: scene.view_settings.view_transform = 'AgX'; scene.view_settings.look = 'AgX - Punchy'
except Exception: pass

if OUT:
    for o in scene.objects: o.select_set(False)
    for o in kit.all_objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT), export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_materials='EXPORT')
result = {'assets': {a: sum(len(o.data.polygons) for o in e.children) for a, e in roots.items()}}
