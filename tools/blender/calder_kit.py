"""AFTERHOURS — Calder Basin kit, built in Blender (bpy). Game coords: x right, y up, z forward. Blender: (x, -z, y).
Assets (Empty + parented parts, one material per part; origin at grade):
  GantryCrane  — ship-to-shore container crane, red steel, boom reaching out over +x, legs straddling z = +-14
  TrussArch    — one 120 m span of the Steel Bridge: two red tied-arch ribs at x = +-9.6 with hangers and portal braces,
                 span along z (-60..60), deck level y = 0. js/afterhours.js scales x to the road width.
  ClockTower   — old-town stone clock tower, 9 x 9 m, 40 m, lit clock faces, copper pyramid roof
  Belvedere    — the finish pavilion: thin white roof slab on slender columns over a lit glass box, LED edge
  Container    — 40 ft shipping container (12.2 x 2.9 x 2.6, long side along z), corrugated sides; PAINT is tinted per instance
CLI:  python3 calder_kit.py --out ../../models/calder_kit.glb [--render prefix]     Live: run inside Blender ('Calder Kit' scene)
Detail policy (tools/blender/README.md): boxes and prisms go through a bmesh bevel so corners catch the night rig.
Built from the level doc (levels/calder-basin-quay-to-ridge.md). Midjourney key frames (asset pack prompts A1a-A1e) were
queued but not yet used: the next pass reworks these assets to match the picked frames.
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

# ---------------- TrussArch: one 120 m bridge span ----------------
A = 'TrussArch'
HALF, RISE, X = 60., 24., 9.6
def arch_y(z): return RISE * (1 - (z / HALF) ** 2)
NS = 16
for sx in (-1, 1):
    zs = [-HALF + 2 * HALF * i / NS for i in range(NS + 1)]
    for z0, z1 in zip(zs[:-1], zs[1:]):
        beam(A, f'rib{sx}{z0:.0f}', 'CRANE', (sx * X, arch_y(z0) + 1.2, z0), (sx * X, arch_y(z1) + 1.2, z1), 1.3, 1.9)
    beam(A, f'tie{sx}', 'CRANE', (sx * X, .4, -HALF), (sx * X, .4, HALF), 1.1, 1.6)                     # tie girder at deck level
    for z in zs[1:-1]:
        beam(A, f'hg{sx}{z:.0f}', 'STEEL', (sx * X, 1.2, z), (sx * X, arch_y(z) + .4, z), .22)         # hangers
    for z0, z1 in zip(zs[1:-2], zs[2:-1]):
        beam(A, f'dg{sx}{z0:.0f}', 'STEEL', (sx * X, 1.2, z0), (sx * X, arch_y(z1) + .3, z1), .16)    # diagonal web
    for z in (-HALF, HALF): B(A, f'bear{sx}{z:.0f}', 'STONE', 2.6, 1.2, 3.4, sx * X, -.6, z, .08)
for z in (-36, -18, 0, 18, 36):
    y = arch_y(z) + 1.8
    beam(A, f'wind{z}', 'CRANE', (-X, y, z), (X, y, z), .8, 1.)                                        # top lateral braces over the road
    for sx in (-1, 1): beam(A, f'kb{z}{sx}', 'CRANE', (sx * X, y - 2.5, z), (sx * X * .55, y, z), .4)
for z in (-30, 30):
    beam(A, f'xw{z}', 'CRANE', (-X, arch_y(z - 9) + 1.8, z - 9), (X, arch_y(z + 9) + 1.8, z + 9), .5)
    beam(A, f'xw2{z}', 'CRANE', (X, arch_y(z - 9) + 1.8, z - 9), (-X, arch_y(z + 9) + 1.8, z + 9), .5)
for sx in (-1, 1):
    add(f'crown{sx}', cylv(.4, .4, sx * X, RISE + 2.2, 0, seg=8), 'REDLAMP', A)
    for z in range(-50, 51, 20): B(A, f'deckl{sx}{z}', 'LAMP', .25, .25, 1.8, sx * (X - .9), .9, z, 0.)  # lamps on the tie girder

# ---------------- ClockTower ----------------
A = 'ClockTower'
B(A, 'plinth', 'STONE', 11, 3, 11, 0, 1.5, 0, .1)
B(A, 'shaft', 'STONE', 9, 28, 9, 0, 17, 0, .08)
for y in (10, 20): B(A, f'band{y}', 'TRIM_LIGHT', 9.5, .5, 9.5, 0, y, 0, .05)
B(A, 'belfry', 'STONE', 9.6, 7, 9.6, 0, 34.5, 0, .1)
for k, (dx, dz, ry) in enumerate(((4.85, 0, 0), (-4.85, 0, 0), (0, 4.85, 1), (0, -4.85, 1))):
    sx, sz = (.3, 4.6) if not ry else (4.6, .3)
    B(A, f'face{k}', 'CLOCK', sx, 4.6, sz, dx, 34.5, dz, 0.)                                           # lit clock face
    for y in (8, 14, 22): B(A, f'win{k}{y}', 'WINLIT', sx if not ry else 1.4, 2.2, sz if ry else 1.4, dx * 1.003, y, dz * 1.003, 0.)
    B(A, f'arch{k}', 'DARK', sx if not ry else 3.4, 3.6, sz if ry else 3.4, dx * 1.004, 4.8, dz * 1.004, 0.)
B(A, 'cornice', 'TRIM_LIGHT', 10.6, .8, 10.6, 0, 38.4, 0, .1)
add('roof', pyramid(10.4, 9, 0, 38.8, 0), 'COPPER', A)
add('finial', cylv(.18, 3, 0, 47.6, 0, seg=6), 'STEEL', A)
for dx in (-4.5, 4.5):
    for dz in (-4.5, 4.5): add(f'pin{dx}{dz}', cylv(.5, 2.4, dx, 38.8, dz, seg=8, r2=.05), 'COPPER', A)

# ---------------- Belvedere pavilion (finish) ----------------
A = 'Belvedere'
B(A, 'podium', 'STONE', 30, 1, 44, 0, .5, 0, .1)
B(A, 'glassbox', 'GLASS', 16, 6, 26, -3, 4, 0, 0.)
for z in (-12, -6, 0, 6, 12): B(A, f'mull{z}', 'DARK', 16.2, 6, .25, -3, 4, z, 0.)
B(A, 'slab', 'WHITE', 36, .9, 50, 0, 10, 0, .3)
B(A, 'fascia', 'LED', 36.3, .2, 50.3, 0, 9.5, 0, 0.)
for x in (-16, 16):
    for z in range(-22, 23, 11): add(f'col{x}{z}', cylv(.28, 8.6, x, 1, z, seg=12), 'WHITE', A, smooth=True)
for z in range(-20, 21, 5): B(A, f'dl{z}', 'LAMP', 1.2, .1, 1.2, 8, 9.5, z, 0.)
B(A, 'stair', 'STONE', 6, .5, 20, 17, .25, 0, .05)

# ---------------- Container (40 ft) ----------------
A = 'Container'
CW, CH, CL = 2.44, 2.59, 12.19
B(A, 'body', 'PAINT', CW, CH, CL, 0, CH / 2, 0, .04)
for z in [-CL / 2 + 1.2 + i * 1.95 for i in range(6)]:   # six stiffener ribs a side (full corrugation was 500 tris; a yard holds ~2000 of these)
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

def preview():  # the kit laid out at dusk: crane on the quay, a bridge span, the tower and the pavilion beyond
    roots['GantryCrane'].location = G(-40, 0, -20); roots['TrussArch'].location = G(40, 0, 20); roots['ClockTower'].location = G(-30, 0, 90)
    roots['Belvedere'].location = G(50, 0, 120)
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
    co.location = G(100, 30, -120); co.rotation_euler = (G(0, 15, 30) - co.location).to_track_quat('-Z', 'Y').to_euler()
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
