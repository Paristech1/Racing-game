"""AFTERHOURS — Calder Basin kit, built in Blender (bpy). Game coords: x right, y up, z forward. Blender: (x, -z, y).
Assets (Empty + parented parts, one material per part; origin at grade):
  GantryCrane  — ship-to-shore container crane, red steel, boom reaching out over +x, legs straddling z = +-14
  TrussArch    — one 120 m span of the Steel Bridge: K-truss through-arch, top and bottom chords, X bracing overhead,
                 portal frames; span along z (-60..60), deck level y = 0. js/afterhours.js scales x to the road width.
  ClockTower   — slender honey-stone bell tower, 7 x 7 m, 52 m, arched belfry, clock faces, tile pyramid roof
  OTHouse      — old-town house, facade on +x, 9 m frontage: arched door, shutters, iron balcony, outside stair, lantern
  Belvedere    — the ridge pavilion: elliptical white roof slabs over a lit glass drum, LED edge
  TunnelRing   — 6 m segment of the futuristic tunnel: white panel shell, ribs, three light lines, amber road-level strips
  TunnelHex    — 6 m segment of the hex-lattice gallery: steel hexagon frames and lattice over a warm light skin
  TunnelPortal — sculpted white tunnel mouth with an LED ring and wing walls (tunnel runs +z, face at z = 0)
  PierColumn, PierCap — highway viaduct pier (column is 1 m tall, the game scales it), hammerhead cap under a 24 m deck
  FloodMast, Cypress — container-yard flood-light mast; tall Mediterranean cypress for the ridge
  Container    — 40 ft shipping container (12.2 x 2.9 x 2.6, long side along z); PAINT is tinted per instance
CLI:  python3 calder_kit.py --out ../../models/calder_kit.glb [--render prefix]     Live: run inside Blender ('Calder Kit' scene)
Detail policy (tools/blender/README.md): boxes and prisms go through a bmesh bevel so corners catch the night rig.
Look references: the Midjourney key frames in levels/calder-basin-asset-pack.md (ridge pavilion and cypresses, honey-stone
old town with outside stairs and a bell tower, red K-truss arch bridge, container yard with tall stacks and flood masts,
futuristic tunnel interior / portal / hex gallery, elevated highway). Each asset below says which frames it follows.
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix
CLI = '--out' in sys.argv
OUT = sys.argv[sys.argv.index('--out') + 1] if CLI else None
RENDER = sys.argv[sys.argv.index('--render') + 1] if '--render' in sys.argv else None
TAU = math.pi * 2
def G(x, y, z): return Vector((x, -z, y))
if CLI:
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
else:
    old = bpy.data.scenes.get('Calder Kit')
    if old:
        for o in list(old.objects): bpy.data.objects.remove(o)
        bpy.data.scenes.remove(old)
    scene = bpy.data.scenes.new('Calder Kit')
    for w in bpy.context.window_manager.windows: w.scene = scene

MATS = {}
def mat(name, col, metal=0., rough=.5, emit=None, es=6.):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    MATS[name] = m
mat('CRANE', (.55, .06, .05), .6, .45); mat('STEEL', (.3, .32, .35), .85, .35); mat('DARK', (.03, .03, .035), .3, .5)
mat('LAMP', (1, .95, .8), 0, .3, emit=(1., .85, .6), es=10.); mat('REDLAMP', (1, .1, .08), 0, .3, emit=(1., .08, .05), es=12.)
mat('STONE', (.5, .46, .4), 0, .85); mat('TRIM_LIGHT', (.82, .8, .74), 0, .6); mat('COPPER', (.2, .42, .36), .5, .55)
mat('CLOCK', (1, .95, .82), 0, .4, emit=(1., .93, .78), es=4.); mat('WINLIT', (1, .8, .5), 0, .3, emit=(1., .72, .42), es=3.)
mat('WHITE', (.9, .9, .88), 0, .45); mat('GLASS', (.9, .85, .7), .2, .15, emit=(1., .86, .62), es=2.5); mat('LED', (1, 1, 1), 0, .3, emit=(1, 1, 1), es=8.)
mat('PAINT', (.8, .8, .8), .3, .55)

roots = {}
def root(a):
    if a not in roots:
        e = bpy.data.objects.new(a, None); scene.collection.objects.link(e); roots[a] = e
    return roots[a]
def add(name, bm, m, a, smooth=False):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(MATS[m])
    if smooth: me.shade_smooth()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); ob.parent = root(a); return ob
def bevel_bm(bm, off, seg=1):
    es = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > .6]
    if es and off > 0: bmesh.ops.bevel(bm, geom=es, offset=off, segments=seg, affect='EDGES', profile=.5, clamp_overlap=True)
    return bm
def box(sx, sy, sz, gx=0, gy=0, gz=0, bevel=0.):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    for v in bm.verts: v.co = Vector((v.co.x * sx, v.co.y * sz, v.co.z * sy)) + G(gx, gy, gz)
    return bevel_bm(bm, min(bevel, .45 * min(sx, sy, sz)))
def B(a, name, m, sx, sy, sz, gx, gy, gz, bevel=.04):
    return add(name, box(sx, sy, sz, gx, gy, gz, bevel), m, a)
def beam(a, name, m, p, q, w, h=None, bevel=.03):
    """box from game point p to q with cross-section w x h (h along the most 'up' perpendicular)"""
    h = h or w; P, Q = G(*p), G(*q); d = Q - P; L = d.length; t = d.normalized()
    up = Vector((0, 0, 1)) if abs(t.z) < .95 else Vector((1, 0, 0)); u = t.cross(up).normalized(); v = u.cross(t).normalized()
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    M = Matrix(((u.x * w, v.x * h, t.x * L), (u.y * w, v.y * h, t.y * L), (u.z * w, v.z * h, t.z * L)))
    for vv in bm.verts: vv.co = M @ vv.co + (P + Q) / 2
    return add(name, bevel_bm(bm, min(bevel, .4 * min(w, h))), m, a)
def cylv(r, h, gx, gy, gz, seg=16, r2=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=h)
    for v in bm.verts: v.co = v.co + G(gx, gy + h / 2, gz)
    return bm
def pyramid(w, h, gx, gy, gz):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=4, radius1=w / math.sqrt(2), radius2=0, depth=h)
    bmesh.ops.rotate(bm, verts=bm.verts, cent=Vector((0, 0, 0)), matrix=Matrix.Rotation(math.pi / 4, 3, 'Z'))
    for v in bm.verts: v.co = v.co + G(gx, gy + h / 2, gz)
    return bm

# ---------------- GantryCrane (ship-to-shore, ~62 m to the apex) ----------------
A = 'GantryCrane'
LX, LZ = 9., 14.                  # legs at x = +-9 (landside / waterside rail), z = +-14
for sx in (-1, 1):
    for sz in (-1, 1):
        beam(A, f'leg{sx}{sz}', 'CRANE', (sx * LX, 0, sz * LZ), (sx * LX * .8, 34, sz * LZ * .86), 1.6)
    beam(A, f'sill{sx}', 'CRANE', (sx * LX, 1.2, -LZ), (sx * LX, 1.2, LZ), 1.2, 1.6)          # bogie sill beam on each rail
    beam(A, f'portal{sx}', 'CRANE', (sx * LX * .8, 34, -LZ * .86), (sx * LX * .8, 34, LZ * .86), 1.6, 2.2)
    beam(A, f'xbr{sx}', 'CRANE', (sx * LX, 4, -LZ), (sx * LX * .82, 30, LZ * .88), .6)               # leg diagonal
    for sz in (-1, 1):
        B(A, f'bogie{sx}{sz}', 'DARK', 2.4, 1.4, 5., sx * LX, .7, sz * LZ)
for sz in (-1, 1):
    beam(A, f'tie{sz}', 'CRANE', (-LX * .8, 34, sz * LZ * .86), (LX * .8, 34, sz * LZ * .86), 1.4, 1.8)
    beam(A, f'boom{sz}', 'CRANE', (-26, 38, sz * 4.2), (52, 38, sz * 4.2), 1.2, 2.6)                 # boom girders out over the water (+x)
    beam(A, f'apexleg{sz}', 'CRANE', (-LX * .8, 34, sz * LZ * .86), (-2, 62, sz * 3), 1.2)
    beam(A, f'apexleg2{sz}', 'CRANE', (LX * .8, 34, sz * LZ * .86), (-2, 62, sz * 3), 1.2)
    beam(A, f'stayf{sz}', 'STEEL', (-2, 62, sz * 3), (50, 39.3, sz * 4.2), .35)                       # forestays
    beam(A, f'stayb{sz}', 'STEEL', (-2, 62, sz * 3), (-25, 39.3, sz * 4.2), .35)
for k in range(-25, 53, 6):
    beam(A, f'bx{k}', 'CRANE', (k, 36.7, -4.2), (k + 3, 39.3, 4.2), .3)                                # boom lacing
beam(A, 'apexbar', 'CRANE', (-2, 62, -3), (-2, 62, 3), 1.4)
B(A, 'house', 'STEEL', 12, 6, 9, -20, 42.4, 0, .12)                                                   # machinery house on the back reach
B(A, 'cab', 'DARK', 3.4, 2.8, 3, 6, 35.2, 0, .1); B(A, 'cabwin', 'WINLIT', 3.5, 1.2, 2.6, 6.05, 35.4, 0, 0.)
B(A, 'trolley', 'STEEL', 5, 2, 6, 24, 36.2, 0, .08)
add('spreader', box(2.6, .8, 12.4, 24, 20, 0, .05), 'DARK', A)
for sz in (-1, 1): beam(A, f'rope{sz}', 'STEEL', (24, 35.2, sz * 2), (24, 20.4, sz * 5), .08)
for p in ((-2, 63, 0), (52, 39.6, -4.2), (52, 39.6, 4.2), (-26, 46, 0)):
    add(f'av{p}', cylv(.45, .45, *p, seg=8), 'REDLAMP', A)                                             # aviation lights
for sx in (-1, 1): B(A, f'flood{sx}', 'LAMP', 1.6, .5, 1.2, sx * LX * .8, 33, 0, 0.)


# ---------------- extra materials for the Midjourney-driven pass ----------------
mat('HONEY', (.62, .5, .34), 0, .85); mat('TILE', (.42, .2, .12), 0, .8); mat('IRON', (.04, .04, .045), .7, .45)
mat('PANEL', (.86, .88, .9), .1, .3); mat('AMBER', (1, .6, .2), 0, .3, emit=(1., .55, .15), es=8.); mat('WARM', (1, .9, .72), 0, .3, emit=(1., .88, .66), es=6.)
mat('CONCRETE', (.5, .5, .49), 0, .85); mat('WOODSH', (.12, .22, .2), 0, .8); mat('LEAF', (.08, .16, .09), 0, .95); mat('BARK', (.16, .12, .09), 0, 1)

def lathe(prof, n, gx, gy, gz, sx=1., sz=1.):
    """surface of revolution around the vertical axis; prof = [(r, y)] bottom -> top"""
    bm = bmesh.new(); rings = []
    for r, y in prof:
        rings.append([bm.verts.new(G(gx + sx * r * math.cos(TAU * k / n), gy + y, gz + sz * r * math.sin(TAU * k / n))) for k in range(n)])
    for a, b in zip(rings[:-1], rings[1:]):
        for k in range(n): bm.faces.new((a[k], a[(k + 1) % n], b[(k + 1) % n], b[k]))
    bm.normal_update(); return bm
def disc(rx, rz, y0, y1, gx, gz, n=40):
    """elliptical slab (plan rx by rz), y0..y1"""
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=n, radius1=1, radius2=1, depth=1)
    for v in bm.verts: v.co = Vector((gx + v.co.x * rx, -(gz + v.co.y * rz), (y0 + y1) / 2 + v.co.z * (y1 - y0)))
    return bm
def strip(a, name, m, pts, w, t, z0, z1):
    """extrude a 2D cross-section polyline (x, y) into a shell along z (game), thickness t inward"""
    for i, (p, q) in enumerate(zip(pts[:-1], pts[1:])):
        bm = bmesh.new(); dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy); nx, ny = -dy / L * t, dx / L * t
        V = [bm.verts.new(G(x, y, z)) for z in (z0, z1) for (x, y) in (p, q, (q[0] + nx, q[1] + ny), (p[0] + nx, p[1] + ny))]
        for f in ((0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)): bm.faces.new([V[k] for k in f])
        bm.normal_update(); add(f'{name}{i}', bm, m, a)

# ---------------- TrussArch: one 120 m span, K-truss through-arch (Midjourney bridge frames: deep red-orange truss arch,
# lower chord following the arch, K web between the chords, X bracing overhead, portal frames at the ends) ----------------
A = 'TrussArch'
HALF, RISE, DEPTH, X = 60., 26., 5.2, 9.6
def up(z): return RISE * (1 - (z / HALF) ** 2) + 1.2                      # top chord
def lo(z): return max(1.2, up(z) - DEPTH * (1 - .55 * (abs(z) / HALF) ** 2))  # bottom chord, meets the deck at the ends
NS = 20; zs = [-HALF + 2 * HALF * i / NS for i in range(NS + 1)]
for sx in (-1, 1):
    x = sx * X
    for z0, z1 in zip(zs[:-1], zs[1:]):
        beam(A, f'top{sx}{z0:.0f}', 'CRANE', (x, up(z0), z0), (x, up(z1), z1), 1.3, 1.6)
        beam(A, f'bot{sx}{z0:.0f}', 'CRANE', (x, lo(z0), z0), (x, lo(z1), z1), 1.0, 1.2)
    for i, z in enumerate(zs[1:-1]):
        beam(A, f'vert{sx}{z:.0f}', 'CRANE', (x, lo(z), z), (x, up(z), z), .55)
        zm = (z + zs[i + 2]) / 2 if i + 2 < len(zs) else z
        beam(A, f'k{sx}{z:.0f}', 'CRANE', (x, (lo(z) + up(z)) / 2, z), (x, up(zs[i + 2]) if i + 2 <= NS else up(z), zs[i + 2] if i + 2 <= NS else z), .4)
        beam(A, f'k2{sx}{z:.0f}', 'CRANE', (x, (lo(z) + up(z)) / 2, z), (x, lo(zs[i + 2]) if i + 2 <= NS else lo(z), zs[i + 2] if i + 2 <= NS else z), .4)
        if lo(z) > 2.5: beam(A, f'hg{sx}{z:.0f}', 'STEEL', (x, 1.2, z), (x, lo(z), z), .2)
    beam(A, f'tie{sx}', 'CRANE', (x, .5, -HALF), (x, .5, HALF), 1.1, 1.8)
    for z in (-HALF, HALF): B(A, f'bear{sx}{z:.0f}', 'CONCRETE', 2.6, 1.2, 3.4, x, -.6, z, .08)
    for z in range(-54, 55, 12): B(A, f'deckl{sx}{z}', 'LAMP', .25, .25, 1.6, sx * (X - .9), 1.1, z, 0.)
for z in zs[2:-2:2]:
    y = up(z); beam(A, f'strut{z:.0f}', 'CRANE', (-X, y, z), (X, y, z), .7, .9)
for z0, z1 in zip(zs[2:-3:2], zs[4:-1:2]):
    beam(A, f'xa{z0:.0f}', 'CRANE', (-X, up(z0), z0), (X, up(z1), z1), .35); beam(A, f'xb{z0:.0f}', 'CRANE', (X, up(z0), z0), (-X, up(z1), z1), .35)
for z in (-HALF + 9, HALF - 9):                                             # portal frames where the arch clears the trucks
    y = lo(z) - .2; beam(A, f'portal{z:.0f}', 'CRANE', (-X, y, z), (X, y, z), 1.1, 1.6)
    for sx in (-1, 1): beam(A, f'pk{z:.0f}{sx}', 'CRANE', (sx * X, y - 3, z), (sx * X * .6, y, z), .5)
for sx in (-1, 1): add(f'crown{sx}', cylv(.4, .4, sx * X, RISE + 2.4, 0, seg=8), 'REDLAMP', A)

# ---------------- ClockTower (Midjourney old town: slender honey-stone bell tower, arched belfry, stone pyramid roof, clock) ----------------
A = 'ClockTower'
T = 7.
B(A, 'plinth', 'HONEY', T + 1.6, 3, T + 1.6, 0, 1.5, 0, .1)
B(A, 'shaft', 'HONEY', T, 30, T, 0, 18, 0, .06)
for y in (12, 22, 33): B(A, f'band{y}', 'TRIM_LIGHT', T + .5, .45, T + .5, 0, y, 0, .05)
B(A, 'belfry', 'HONEY', T + .3, 8, T + .3, 0, 37, 0, .08)
for k, (dx, dz) in enumerate(((1, 0), (-1, 0), (0, 1), (0, -1))):
    ox, oz = dx * (T / 2 + .17), dz * (T / 2 + .17); wx, wz = (.12, 2.6) if dx else (2.6, .12)
    B(A, f'bell{k}', 'DARK', wx, 4.6, wz, ox, 37.4, oz, 0.)                                           # belfry arch opening
    B(A, f'face{k}', 'CLOCK', .12 if dx else 3.2, 3.2, 3.2 if dx else .12, ox, 28, oz, 0.)            # lit clock face
    for y in (8, 16): B(A, f'win{k}{y}', 'WINLIT', .12 if dx else 1, 2, 1 if dx else .12, ox, y, oz, 0.)
    B(A, f'door{k}', 'DARK', .12 if dx else 2.6, 3.6, 2.6 if dx else .12, ox * 1.12, 4.8, oz * 1.12, 0.)
B(A, 'cornice', 'TRIM_LIGHT', T + 1.2, .7, T + 1.2, 0, 41.3, 0, .1)
add('roof', pyramid(T + 1.1, 10, 0, 41.6, 0), 'TILE', A)
add('finial', cylv(.15, 2.5, 0, 51.4, 0, seg=6), 'IRON', A)

# ---------------- OTHouse: old-town house, honey stone, facade on +x, 9 m frontage along z, 13 m tall
# (Midjourney frames: arched doors, outside stair flights, iron balconies, shutters, lanterns, tile cornice) ----------------
A = 'OTHouse'
W9, D9, H9 = 9., 10., 13.
B(A, 'mass', 'HONEY', D9, H9, W9, -D9 / 2, H9 / 2, 0, .05)
B(A, 'cornice', 'TRIM_LIGHT', .8, .5, W9 + .4, .1, H9 - .4, 0, .05)
add('roof', bevel_bm(box(D9 + .6, .5, W9 + .6, -D9 / 2, H9 + .25, 0), .05), 'TILE', A)
B(A, 'door', 'DARK', .14, 2.4, 1.8, .05, 1.2, -2.2, 0.)
B(A, 'doorarch', 'DARK', .14, .5, 1.3, .05, 2.6, -2.2, 0.)
B(A, 'transom', 'WARM', .16, .5, 1.2, .06, 2.7, -2.2, 0.)
for z in (-2.2, 1.0, 3.4):
    for fl, y in enumerate((5.6, 9.4)):
        lit = (z * 7 + fl * 3) % 3 != 0
        B(A, f'w{z}{y}', 'WINLIT' if lit else 'DARK', .12, 1.8, 1.0, .05, y, z, 0.)
        for s in (-1, 1): B(A, f'sh{z}{y}{s}', 'WOODSH', .1, 1.9, .5, .12, y, z + s * .8, 0.)
B(A, 'shop', 'WARM', .12, 2.2, 2.6, .05, 1.5, 2.6, 0.)
B(A, 'balcony', 'HONEY', 1.3, .2, 3.2, .65, 4.5, 1.0, .03)
for k in range(9): B(A, f'bal{k}', 'IRON', .05, 1, .05, 1.28, 5.1, -.5 + k * .375, 0.)
B(A, 'balrail', 'IRON', .07, .07, 3.2, 1.28, 5.6, 1.0, 0.)
for k in range(7): B(A, f'step{k}', 'HONEY', 1.2, .3 + k * .55, .45, .6, (.3 + k * .55) / 2, -3.9 + k * .45, .02)   # outside stair up to the first floor
B(A, 'landing', 'HONEY', 1.2, .2, 1.4, .6, 3.95, -.0, .02)
B(A, 'lantern', 'LAMP', .25, .4, .25, .4, 3.3, -3.3, 0.)

# ---------------- Belvedere (Midjourney ridge frames: white organic pavilion, a sweeping elliptical roof slab cantilevered
# over a lit glass drum, LED edge) ----------------
A = 'Belvedere'
add('podium', disc(20, 30, 0, 1, 0, 0), 'STONE', A)
add('drum', lathe([(10.5, 1), (10.5, 7.5)], 40, -3, 0, 0, 1, 1.5), 'GLASS', A)
add('roof', disc(22, 34, 8.4, 9.4, 3, 2, 48), 'WHITE', A)
add('roof2', disc(17, 26, 9.4, 10.0, 1, 0, 48), 'WHITE', A)
add('edge', disc(22.25, 34.25, 8.6, 8.9, 3, 2, 48), 'LED', A)
for k in range(10):
    a = TAU * k / 10; add(f'col{k}', cylv(.3, 7.4, -3 + 9.6 * math.cos(a), 1, 14.4 * math.sin(a), seg=10), 'WHITE', A, smooth=True)
for k in range(14):
    a = TAU * k / 14; B(A, f'dl{k}', 'LAMP', .9, .1, .9, 3 + 16 * math.cos(a), 8.3, 2 + 24 * math.sin(a), 0.)

# ---------------- TunnelRing: one 6 m segment of the futuristic tunnel (Midjourney: smooth white composite panels, ribs,
# continuous light lines overhead, amber at road level). Road 2W = 14 m; shell clears it with sidewalks: x = +-10.6 ----------------
A = 'TunnelRing'
RT, YC = 10.6, 1.8
arc = [(RT * math.cos(math.radians(a)), YC + RT * .78 * math.sin(math.radians(a))) for a in range(0, 181, 12)]
prof = [(RT, 0)] + arc + [(-RT, 0)]
strip(A, 'shell', 'PANEL', prof, 0, -.35, -2.95, 2.75)
strip(A, 'rib', 'DARK', [(x * 1.0, y) for x, y in prof], 0, -.6, 2.75, 3.0)
for a in (72, 90, 108):                                                    # three light lines overhead
    x, y = RT * .985 * math.cos(math.radians(a)), YC + RT * .78 * .985 * math.sin(math.radians(a))
    B(A, f'led{a}', 'LED', .45, .12, 5.7, x, y - .05, -.1, 0.)
for sx in (-1, 1):
    B(A, f'amber{sx}', 'AMBER', .1, .16, 5.7, sx * (RT - .05), .9, -.1, 0.)
    B(A, f'walk{sx}', 'CONCRETE', 3.4, .3, 6, sx * (RT - 1.7), .15, -.1, .02)

# ---------------- TunnelHex: 6 m of the hex-lattice gallery (Midjourney: hexagon ribs with warm light between them) ----------------
A = 'TunnelHex'
hexp = [(10.8, 0), (10.8, 4.6), (6.2, 10.4), (-6.2, 10.4), (-10.8, 4.6), (-10.8, 0)]
strip(A, 'glow', 'WARM', hexp, 0, -.15, -3, 3)
for z in (-3, 0, 3):
    for p, q in zip(hexp[:-1], hexp[1:]): beam(A, f'f{z}{p[0]:.0f}{p[1]:.0f}', 'STEEL', (p[0] * .985, p[1] * .985, z), (q[0] * .985, q[1] * .985, z), .45, .7)
for p, q in zip(hexp[1:-2], hexp[2:-1]):
    for k in range(3):
        t0, t1 = k / 3, (k + 1) / 3
        P0 = (p[0] + (q[0] - p[0]) * t0, p[1] + (q[1] - p[1]) * t0); P1 = (p[0] + (q[0] - p[0]) * t1, p[1] + (q[1] - p[1]) * t1)
        beam(A, f'la{p[0]:.0f}{k}', 'STEEL', (P0[0] * .975, P0[1] * .975, -3), (P1[0] * .975, P1[1] * .975, 0), .22)
        beam(A, f'lb{p[0]:.0f}{k}', 'STEEL', (P1[0] * .975, P1[1] * .975, 0), (P0[0] * .975, P0[1] * .975, 3), .22)
for sx in (-1, 1): B(A, f'hwalk{sx}', 'CONCRETE', 3.6, .3, 6, sx * 9, .15, 0, .02)

# ---------------- TunnelPortal: sculpted white mouth with a light ring (Midjourney portal frame); tunnel runs +z, face at z = 0 ----------------
A = 'TunnelPortal'
outer = [(RT + 3.2, -1)] + [((RT + 3.2) * math.cos(math.radians(a)), YC + (RT * .78 + 3.4) * math.sin(math.radians(a))) for a in range(0, 181, 9)] + [(-(RT + 3.2), -1)]
inner = [(RT + .2, 0)] + [((RT + .2) * math.cos(math.radians(a)), YC + (RT * .78 + .2) * math.sin(math.radians(a))) for a in range(0, 181, 9)] + [(-(RT + .2), 0)]
for i in range(len(outer) - 1):                                             # thick hood between the outer and inner arcs, flared back
    bm = bmesh.new(); o0, o1, i0, i1 = outer[i], outer[i + 1], inner[i], inner[i + 1]
    V = [bm.verts.new(G(x, y, z)) for (x, y, z) in ((o0[0], o0[1], -2.5), (o1[0], o1[1], -2.5), (i1[0], i1[1], 0), (i0[0], i0[1], 0),
                                                       (o0[0] * 1.02, o0[1] * 1.02, 6), (o1[0] * 1.02, o1[1] * 1.02, 6), (i1[0], i1[1], 6), (i0[0], i0[1], 6))]
    for f in ((0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (3, 2, 6, 7)): bm.faces.new([V[k] for k in f])
    bm.normal_update(); add(f'hood{i}', bm, 'WHITE', A)
strip(A, 'ring', 'LED', [(x * 1.004, y * 1.004 if y > .5 else y) for x, y in inner], 0, .25, -.15, .05)
for sx in (-1, 1):
    add(f'wing{sx}', bevel_bm(box(9, 7, 1.4, sx * (RT + 7.5), 3.5, -1.2), .2), 'WHITE', A)
    B(A, f'wled{sx}', 'LED', 8, .12, .1, sx * (RT + 7.5), 6.2, -1.95, 0.)

# ---------------- highway viaduct: PierColumn (1 m tall, scaled in y by the game), PierCap (hammerhead under a 22 m deck) ----------------
A = 'PierColumn'
add('col', bevel_bm(box(3.2, 1, 2.2, 0, .5, 0), .4), 'CONCRETE', A)
A = 'PierCap'
bm = bmesh.new(); V = [bm.verts.new(G(x, y, z)) for z in (-1.4, 1.4) for (x, y) in ((-12, 0), (12, 0), (12, -.8), (2.2, -2.8), (-2.2, -2.8), (-12, -.8))]
bm.faces.new(V[:6]); bm.faces.new(V[6:][::-1])
for k in range(6): bm.faces.new((V[k], V[(k + 1) % 6], V[6 + (k + 1) % 6], V[6 + k]))
bm.normal_update(); add('cap', bevel_bm(bm, .08), 'CONCRETE', A)

# ---------------- yard + ridge props ----------------
A = 'FloodMast'                                                            # yard flood-light mast (Midjourney container frames)
add('pole', cylv(.45, 30, 0, 0, 0, seg=10, r2=.3), 'STEEL', A, smooth=True)
B(A, 'frame', 'STEEL', 1.2, 2.4, 5.4, 0, 30.6, 0, .03)
for z in (-2, -.7, .7, 2):
    for y in (30, 31.2): B(A, f'fl{z}{y}', 'LAMP', .3, .9, 1.1, .55, y, z, 0.)
A = 'Cypress'                                                              # tall narrow Mediterranean cypress (ridge frames)
add('trunk', cylv(.22, 2.2, 0, 0, 0, seg=6), 'BARK', A)
add('crown', lathe([(.2, 1.2), (1.3, 3), (1.6, 6), (1.3, 10), (.7, 13), (0, 15)], 9, 0, 0, 0), 'LEAF', A)

# ---------------- Container (40 ft), unchanged from the first pass: the Midjourney yard frames match it ----------------
A = 'Container'
CW, CH, CL = 2.44, 2.59, 12.19
B(A, 'body', 'PAINT', CW, CH, CL, 0, CH / 2, 0, .04)
for z in [-CL / 2 + 1.2 + i * 1.95 for i in range(6)]:
    for sx in (-1, 1): B(A, f'rib{sx}{z:.1f}', 'PAINT', .1, CH - .3, .4, sx * (CW / 2 + .04), CH / 2, z, 0.)
for sx in (-1, 1):
    for sz in (-1, 1): B(A, f'cast{sx}{sz}', 'DARK', .2, CH + .02, .2, sx * (CW / 2 - .08), CH / 2, sz * (CL / 2 - .08), 0.)
B(A, 'door', 'DARK', CW - .3, CH - .3, .06, 0, CH / 2, CL / 2 + .02, 0.)
for sx in (-.5, -.2, .2, .5): B(A, f'bar{sx}', 'STEEL', .06, CH - .4, .1, sx, CH / 2, CL / 2 + .07, 0.)

tris = {a: sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in e.children) for a, e in roots.items()}
print('assets', tris)
if CLI:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True, export_texcoords=True,
                              export_normals=True, export_materials='EXPORT', export_lights=False, export_cameras=False)
    print('wrote', OUT, os.path.getsize(OUT))

def preview():  # the kit laid out at dusk: crane on the quay, a bridge span, tower and houses, the pavilion, a tunnel run
    lay = {'GantryCrane': (-60, 0, -40, 0), 'TrussArch': (40, 0, 20, 0), 'ClockTower': (-40, 0, 95, 0), 'OTHouse': (-70, 0, 70, 0),
           'Belvedere': (90, 0, 150, 0), 'TunnelPortal': (150, 0, -60, 0), 'TunnelRing': (150, 0, -54, 0), 'TunnelHex': (150, 0, -42, 0),
           'PierCap': (-120, 14, 30, 0), 'FloodMast': (-30, 0, -70, 0), 'Cypress': (70, 0, 120, 0)}
    for k, (x, y, z, r) in lay.items(): roots[k].location = G(x, y, z); roots[k].rotation_euler = (0, 0, r)
    roots['PierColumn'].location = G(-120, 0, 30); roots['PierColumn'].scale = (1, 1, 14)
    cols = [(.6, .1, .08), (.08, .25, .5), (.75, .5, .1), (.15, .4, .2), (.5, .5, .52)]
    for i in range(12):
        e = bpy.data.objects.new(f'ct{i}', None); scene.collection.objects.link(e); e.location = G(-14 + (i % 4) * 2.6, (i // 4) * 2.6, -40)
        m = bpy.data.materials.new(f'ctm{i}'); m.use_nodes = True; m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (*cols[i % 5], 1)
        for c in roots['Container'].children: d = c.copy(); d.data = c.data.copy(); d.data.materials[0] = m; scene.collection.objects.link(d); d.parent = e
    gm = bpy.data.meshes.new('gr'); gm.from_pydata([(-300, -300, 0), (300, -300, 0), (300, 300, 0), (-300, 300, 0)], [], [(0, 1, 2, 3)]); mat('ROAD', (.035, .035, .04), 0, .55); gm.materials.append(MATS['ROAD'])
    scene.collection.objects.link(bpy.data.objects.new('ground', gm))
    w = bpy.data.worlds.new('Dusk'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.12, .07, .06, 1)
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 1.2; sun.color = (1, .62, .4); so = bpy.data.objects.new('sun', sun); scene.collection.objects.link(so); so.rotation_euler = (math.radians(80), 0, math.radians(-60))
    cam = bpy.data.cameras.new('C'); cam.lens = 24; co = bpy.data.objects.new('KitCam', cam); scene.collection.objects.link(co); scene.camera = co
    co.location = G(140, 45, -170); co.rotation_euler = (G(20, 10, 40) - co.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.resolution_x = 1280; scene.render.resolution_y = 720
if not CLI:
    preview()
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == 'VIEW_3D': a.spaces[0].shading.type = 'MATERIAL'; a.spaces[0].region_3d.view_perspective = 'CAMERA'
    result = {'assets': tris}
if CLI and RENDER:
    preview(); scene.render.engine = 'BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'CYCLES'
    if scene.render.engine == 'CYCLES': scene.cycles.samples = 24
    scene.render.filepath = RENDER + '.png'; bpy.ops.render.render(write_still=True)
