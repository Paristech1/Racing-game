"""AFTERHOURS — Mt Airy kit, built in Blender (bpy). Game coords: x right, y up, z forward. Blender: (x, -z, y).
Assets (Empty + parented parts), facades face +x, origin = front-centre at grade:
  ShopSchist, ShopBrick  — three-storey Germantown Ave mixed-use, 9 m wide
  Theatre                — 1920s Art Deco playhouse with marquee, 24 m wide
  StoneTwin              — gray Wissahickon-schist twin, slate roof, cross gables, full-width porch, 13 m wide
CLI:  python3 mtairy_kit.py --out mtairy_kit.glb [--render prefix]     Live: run inside Blender ('MtAiry Kit' scene)
"""
import bpy, bmesh, math, os, random, sys
from mathutils import Vector, Matrix
random.seed(11)
CLI = '--out' in sys.argv
OUT = sys.argv[sys.argv.index('--out') + 1] if CLI else None
RENDER = sys.argv[sys.argv.index('--render') + 1] if '--render' in sys.argv else None
def G(x, y, z): return Vector((x, -z, y))
if CLI:
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
else:
    old = bpy.data.scenes.get('MtAiry Kit')
    if old:
        for o in list(old.objects): bpy.data.objects.remove(o)
        bpy.data.scenes.remove(old)
    scene = bpy.data.scenes.new('MtAiry Kit')
    for w in bpy.context.window_manager.windows: w.scene = scene

MATS = {}
def mat(name, col, metal=0., rough=.5, emit=None, es=6.):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    MATS[name] = m
mat('SCHIST', (.3, .3, .28), 0, .95); mat('BRICK', (.33, .15, .1), 0, .9); mat('BUFF', (.55, .45, .32), 0, .85); mat('LIMESTONE', (.62, .58, .5), 0, .8)
mat('TRIM', (.85, .83, .78), 0, .6); mat('SLATE', (.1, .11, .13), .1, .7); mat('DARK', (.03, .03, .035), .3, .5); mat('FASCIA', (.06, .06, .07), .2, .6)
mat('STOREGLASS', (1, .85, .6), 0, .2, emit=(1., .8, .5)); mat('WINLIT', (1, .8, .5), 0, .3, emit=(1., .72, .42), es=3.); mat('WINDARK', (.02, .025, .03), .5, .1)
mat('AWNING', (.8, .8, .8), 0, .8); mat('LAMP', (1, .95, .8), 0, .3, emit=(1., .9, .7), es=10.); mat('WOOD', (.25, .16, .1), 0, .8)

roots = {}
def root(a):
    if a not in roots:
        e = bpy.data.objects.new(a, None); scene.collection.objects.link(e); roots[a] = e
    return roots[a]
def add(name, bm, m, a, smooth=False):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(MATS[m])
    if smooth: me.shade_smooth()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); ob.parent = root(a); return ob
def box(sx, sy, sz, gx=0, gy=0, gz=0):  # game-space size (x, y, z) and centre
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    for v in bm.verts: v.co = Vector((v.co.x * sx, v.co.y * sz, v.co.z * sy)) + G(gx, gy, gz)
    return bm
def B(a, name, m, sx, sy, sz, gx, gy, gz): return add(name, box(sx, sy, sz, gx, gy, gz), m, a)
def cylv(r, h, gx, gy, gz, seg=20):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=h)
    for v in bm.verts: v.co = v.co + G(gx, gy + h / 2, gz)
    return bm
def prism_x(poly_yz, x0, x1):  # gable/roof shapes: polygon in (z, y) extruded along x
    bm = bmesh.new(); n = len(poly_yz)
    a = [bm.verts.new(G(x0, y, z)) for z, y in poly_yz]; b = [bm.verts.new(G(x1, y, z)) for z, y in poly_yz]
    bm.faces.new(a); bm.faces.new(list(reversed(b)))
    for i in range(n): bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); return bm
def prism_z(poly_xy, z0, z1):
    bm = bmesh.new(); n = len(poly_xy)
    a = [bm.verts.new(G(x, y, z0)) for x, y in poly_xy]; b = [bm.verts.new(G(x, y, z1)) for x, y in poly_xy]
    bm.faces.new(a); bm.faces.new(list(reversed(b)))
    for i in range(n): bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); return bm

def window(a, tag, x, y, z, w=1.05, h=1.7, lit=True, lintel='LIMESTONE'):
    B(a, f'{tag}w', 'WINLIT' if lit else 'WINDARK', .06, h, w, x + .02, y, z)
    B(a, f'{tag}mul', 'TRIM', .08, .06, w, x + .05, y + h * .08, z)                      # meeting rail of a double-hung sash
    B(a, f'{tag}lin', lintel, .16, .22, w + .3, x + .06, y + h / 2 + .14, z)              # stone lintel
    B(a, f'{tag}sil', lintel, .22, .1, w + .24, x + .09, y - h / 2 - .06, z)              # sill

# ---------------- three-storey Germantown Ave shop (facade material varies)
def shop(a, wall):
    Wd, D, H = 9., 13., 11.
    B(a, 'body', wall, D, H, Wd, -D / 2, H / 2, 0)
    B(a, 'glass', 'STOREGLASS', .06, 2.7, 6.4, .03, 1.75, .6)
    B(a, 'door', 'WOOD', .08, 2.5, 1.2, .02, 1.25, -3.3)
    for z in (-4.25, 4.25, -2.5): B(a, f'pier{z}', 'LIMESTONE', .3, 3.4, .5, .12, 1.7, z)
    B(a, 'kick', 'LIMESTONE', .16, .4, 6.4, .06, .2, .6)
    B(a, 'band', 'FASCIA', .22, .8, Wd, .1, 3.7, 0)                                         # sign band (the game paints a name here)
    aw = prism_z([(0, 3.2), (1.5, 2.55), (1.5, 2.3), (0, 3.05)], -3.6, 4.1); add('awn', aw, 'AWNING', a)
    for fl, y in enumerate((5.6, 8.6)):
        for k, z in enumerate((-2.9, 0, 2.9)): window(a, f'f{fl}{k}', 0, y, z, lit=random.random() < .55)
    B(a, 'belt', 'LIMESTONE', .2, .18, Wd, .08, 4.2, 0)
    B(a, 'cornice', 'TRIM', .55, .35, Wd + .2, .2, H - .3, 0)
    for z in [-4.2 + k * .7 for k in range(13)]: B(a, f'dent{z}', 'TRIM', .2, .16, .2, .45, H - .56, z)   # dentils under the cornice
    B(a, 'parapet', wall, .4, .6, Wd, -.2, H + .3, 0); B(a, 'cope', 'LIMESTONE', .5, .12, Wd + .05, -.2, H + .64, 0)
    B(a, 'roof', 'SLATE', D, .05, Wd, -D / 2, H + .02, 0)
shop('ShopSchist', 'SCHIST'); shop('ShopBrick', 'BRICK')

# ---------------- Art Deco theatre (1920s playhouse): buff brick, stepped parapet with vertical fins, triangular marquee
A = 'Theatre'; Wd, D, H = 24., 30., 12.5
B(A, 'body', 'BUFF', D, H, Wd, -D / 2, H / 2, 0)
for z, h in ((-7.5, 3.2), (-3.5, 4.2), (0, 5.2), (3.5, 4.2), (7.5, 3.2)): B(A, f'step{z}', 'BUFF', .6, h, 3.2, -.1, H + h / 2 - 1, z)   # stepped deco parapet
for z in (-9.5, -5.5, -1.6, 1.6, 5.5, 9.5): B(A, f'fin{z}', 'LIMESTONE', .5, 9.5, .5, .2, 7.8, z)                                         # vertical fins
B(A, 'lobby', 'STOREGLASS', .06, 2.8, 12, .03, 1.5, 0)
for z in (-6.8, 6.8): B(A, f'box{z}', 'DARK', .12, 2.2, 2.2, .06, 1.6, z)                                                                   # poster cases
add('marq', prism_z([(0, 3.3), (3.2, 3.6), (3.2, 5.3), (0, 5.6)], -8, 8), 'FASCIA', A)                                                      # marquee body
for y in (3.55, 5.35):
    for z in [-7.6 + k * .4 for k in range(39)]: B(A, f'bulb{y}{z}', 'LAMP', .1, .1, .1, 3.25, y, z)                                       # chaser bulbs
B(A, 'marqface', 'STOREGLASS', .04, 1.3, 15, 3.24, 4.45, 0)                                                                                 # the lit letter board
add('blade', prism_x([(-.35, 6.5), (.35, 6.5), (.35, 14.5), (-.35, 14.5)], .2, 2.4), 'FASCIA', A)                                           # vertical blade sign
for y in [6.9 + k * .8 for k in range(10)]:
    for x in (.3, 2.3): B(A, f'bb{y}{x}', 'LAMP', .08, .08, .08, x, y, .38); B(A, f'bb2{y}{x}', 'LAMP', .08, .08, .08, x, y, -.38)
B(A, 'roof', 'SLATE', D, .05, Wd, -D / 2, H + .02, 0)

# ---------------- gray-stone twin: schist walls, steep slate roof along the street, two front cross gables, dormer, porch
A = 'StoneTwin'; Wd, D, H = 13., 11., 7.
B(A, 'body', 'SCHIST', D, H, Wd, -D / 2, H / 2, 0)
add('roof', prism_z([(-D - .5, H), (.5, H), (-D / 2, H + 5.2)], -Wd / 2 - .3, Wd / 2 + .3), 'SLATE', A)
for z in (-3.4, 3.4):                                                                   # front cross gables (one per house of the pair)
    add(f'gab{z}', prism_x([(z - 2.2, H - .2), (z + 2.2, H - .2), (z, H + 3.6)], -2.2, .15), 'SCHIST', A)
    add(f'gabr{z}', prism_x([(z - 2.6, H - .3), (z + 2.6, H - .3), (z, H + 3.95)], -2.6, .5), 'SLATE', A)
    B(A, f'gabw{z}', 'WINLIT' if random.random() < .5 else 'WINDARK', .06, 1.4, .9, .17, H + 1.2, z)
    B(A, f'gabt{z}', 'TRIM', .1, .12, 4.4, .2, H - .1, z)
    for k, zz in enumerate((z - 1.3, z + 1.3)): window(A, f'up{z}{k}', 0, 5.2, zz, w=.95, h=1.6, lit=random.random() < .45, lintel='TRIM')
    window(A, f'dn{z}', 0, 2.1, z - 1.2, w=1.5, h=1.9, lit=random.random() < .6, lintel='TRIM')
    B(A, f'door{z}', 'WOOD', .08, 2.3, 1.05, .03, 1.35, z + 1.4)
    B(A, f'fan{z}', 'WINLIT', .06, .3, 1.05, .03, 2.65, z + 1.4)
B(A, 'party', 'SCHIST', .6, 1.2, .5, .1, H + 3.6, 0)                                    # chimneys at the party wall and ends
for z in (0, -5.8, 5.8): B(A, f'chim{z}', 'BRICK', .9, 2.6, .9, -D / 2, H + 4.6, z)
B(A, 'porchfl', 'WOOD', 2.8, .3, Wd - .4, 1.4, .55, 0); B(A, 'porchst', 'LIMESTONE', 2.9, .4, Wd - .3, 1.45, .2, 0)
add('porchroof', prism_z([(0, 3.25), (2.9, 3.0), (2.9, 3.15), (0, 3.55)], -Wd / 2 + .2, Wd / 2 - .2), 'SLATE', A)
B(A, 'porchbeam', 'TRIM', .25, .3, Wd - .4, 2.7, 2.9, 0)
for z in (-6., -2.2, 2.2, 6.): add(f'col{z}', cylv(.14, 2.3, 2.65, .7, z), 'TRIM', A)
for z in (-4.1, 4.1): B(A, f'rail{z}', 'TRIM', .08, .08, 3.2, 2.7, 1.55, z); B(A, f'bal{z}', 'TRIM', .05, .8, 3.2, 2.7, 1.1, z)
B(A, 'steps', 'LIMESTONE', 1.2, .35, 1.8, 3.4, .17, 0)
for z in (-3.4, 3.4): B(A, f'plamp{z}', 'LAMP', .18, .25, .18, .3, 2.75, z + .7)       # porch lamps

tris = {a: sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in e.children) for a, e in roots.items()}
print('assets', tris)
if CLI:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True, export_texcoords=True,
                              export_normals=True, export_materials='EXPORT', export_lights=False, export_cameras=False)
    print('wrote', OUT, os.path.getsize(OUT))

def preview():  # a block of the Avenue at night: shops both sides of a street, the theatre, twins beyond
    roots['ShopSchist'].location = G(-7, 0, 0); roots['ShopBrick'].location = G(-7, 0, 9.2); roots['Theatre'].location = G(-7, 0, -18)
    for i, a in enumerate(['ShopBrick', 'ShopSchist', 'ShopBrick']):
        e = bpy.data.objects.new(f'cp{i}', None); scene.collection.objects.link(e); e.location = G(7, 0, -i * 9.2 + 9); e.rotation_euler = (0, 0, math.pi)
        for c in roots[a].children: d = c.copy(); scene.collection.objects.link(d); d.parent = e
    roots['StoneTwin'].location = G(12, 0, -30); roots['StoneTwin'].rotation_euler = (0, 0, math.pi)
    gm = bpy.data.meshes.new('st'); gm.from_pydata([(-80, -80, 0), (80, -80, 0), (80, 80, 0), (-80, 80, 0)], [], [(0, 1, 2, 3)]); mat('ROAD', (.03, .03, .032), 0, .5); gm.materials.append(MATS['ROAD'])
    scene.collection.objects.link(bpy.data.objects.new('street', gm))
    w = bpy.data.worlds.new('Night'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.012, .016, .03, 1)
    for p, e in ((G(0, 6, 0), 1800), (G(0, 6, -20), 1800), (G(0, 6, 18), 1500)):
        L = bpy.data.lights.new('l', 'POINT'); L.energy = e; L.color = (1, .82, .6); L.shadow_soft_size = 1.5; o = bpy.data.objects.new('l', L); scene.collection.objects.link(o); o.location = p
    cam = bpy.data.cameras.new('C'); cam.lens = 22; co = bpy.data.objects.new('KitCam', cam); scene.collection.objects.link(co); scene.camera = co
    co.location = G(1.5, 2.2, 26); co.rotation_euler = (G(-1, 5, -12) - co.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.resolution_x = 1280; scene.render.resolution_y = 720
if not CLI:
    preview()
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == 'VIEW_3D': a.spaces[0].shading.type = 'MATERIAL'; a.spaces[0].region_3d.view_perspective = 'CAMERA'
    bpy.ops.wm.save_as_mainfile(filepath=os.path.expanduser('~/Projects/afterhours_mtairy_kit.blend'), copy=True)
    result = {'assets': tris}
if CLI and RENDER:
    preview(); scene.render.engine = 'CYCLES'; scene.cycles.samples = 24; scene.cycles.use_denoising = True
    scene.render.filepath = RENDER + '.png'; bpy.ops.render.render(write_still=True)
