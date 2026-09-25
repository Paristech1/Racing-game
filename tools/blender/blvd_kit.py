"""AFTERHOURS — Roosevelt Blvd kit, built in Blender (bpy). Game coords: x right, y up, z forward. Blender: (x, -z, y).
Assets (each an Empty with its parts parented): LampTwin, Guardrail, Conifer, Broadleaf, GuideSign.
Run: python3 blvd_kit.py --out kit.glb [--render prefix]
"""
import bpy, bmesh, math, os, random, sys
from mathutils import Vector, Matrix, noise
random.seed(7)
OUT = sys.argv[sys.argv.index('--out') + 1]
RENDER = sys.argv[sys.argv.index('--render') + 1] if '--render' in sys.argv else None
def G(x, y, z): return Vector((x, -z, y))
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

MATS = {}
def mat(name, col, metal=0., rough=.5, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = 8.
    MATS[name] = m
mat('GALV', (.55, .57, .6), .85, .38); mat('LAMP', (1, .97, .9), 0, .3, emit=(1., .93, .8)); mat('DARK', (.03, .03, .035), .4, .5)
mat('CONCRETE', (.62, .58, .5), 0, .9); mat('BARK', (.09, .07, .05), 0, 1.); mat('LEAF', (.05, .13, .05), 0, .9); mat('NEEDLE', (.03, .08, .045), 0, .9)
mat('SIGN', (.02, .33, .15), 0, .4); mat('SIGNBACK', (.5, .52, .55), .7, .4)

roots = {}
def root(asset):
    if asset not in roots:
        e = bpy.data.objects.new(asset, None); scene.collection.objects.link(e); roots[asset] = e
    return roots[asset]
def add_mesh(name, bm, m, asset, smooth=True):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(MATS[m])
    if smooth: me.shade_smooth()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); ob.parent = root(asset); return ob
def xform(bm, M):
    for v in bm.verts: v.co = M @ v.co
def cyl(r1, r2, h, seg=10):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r1, radius2=r2, depth=h)
    xform(bm, Matrix.Translation((0, 0, h / 2))); return bm
def boxbm(sx, sy, sz, gx=0, gy=0, gz=0):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
    for v in bm.verts: v.co = Vector((v.co.x * sx, v.co.y * sz, v.co.z * sy)) + G(gx, gy, gz)
    return bm
def tube(name, pts, r, m, asset, res=8):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2; cu.resolution_u = res; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for p, q in zip(sp.points, pts): p.co = (*G(*q), 1)
    sp.use_endpoint_u = True; sp.order_u = min(4, len(pts))
    ob = bpy.data.objects.new(name, cu); scene.collection.objects.link(ob); cu.materials.append(MATS[m])
    dg = bpy.context.evaluated_depsgraph_get(); me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob); bpy.data.curves.remove(cu)
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.shade_smooth(); ob.parent = root(asset); return ob
def merge_into(bm, b2):
    me = bpy.data.meshes.new('tmp'); b2.to_mesh(me); b2.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)

# 1. twin-arm davit streetlight: tapered galvanised pole on a concrete footing, two swept arms, flat LED heads
A = 'LampTwin'
add_mesh('lt_pole', cyl(.2, .11, 9.6, 12), 'GALV', A)
add_mesh('lt_base', cyl(.34, .3, .45, 12), 'CONCRETE', A, smooth=False)
add_mesh('lt_door', boxbm(.14, .32, .03, 0, 1.0, .2), 'DARK', A, smooth=False)
for sd in (1, -1):
    tube(f'lt_arm{sd}', [(0, 9.1, 0), (sd * .25, 9.75, 0), (sd * 1.2, 10.05, 0), (sd * 2.6, 10.1, 0), (sd * 3.45, 10.0, 0)], .065, 'GALV', A)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=1.)
    for v in bm.verts:
        gx, gy, gz = v.co.x * .55, v.co.z * .12, v.co.y * .26
        if gy < 0: gy *= .35
        v.co = G(sd * 3.65 + gx, 9.98 + gy, gz)
    add_mesh(f'lt_head{sd}', bm, 'GALV', A)
    add_mesh(f'lt_led{sd}', boxbm(.8, .02, .34, sd * 3.66, 9.945, 0), 'LAMP', A, smooth=False)

# 2. W-beam guardrail module, 4 m long, corrugated face toward +x, steel posts on blockouts
A = 'Guardrail'
prof = [(0, .56), (.05, .6), (.09, .64), (.05, .68), (0, .72), (.05, .76), (.09, .8), (.05, .84), (0, .87)]
bm = bmesh.new(); rows = [[bm.verts.new(G(.2 + x, y, z)) for x, y in prof] for z in (-2.02, 2.02)]
for i in range(len(prof) - 1): bm.faces.new((rows[0][i], rows[0][i + 1], rows[1][i + 1], rows[1][i]))
bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=.012); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
add_mesh('gr_beam', bm, 'GALV', A)
for z in (-1.9, .1):
    add_mesh(f'gr_post{z}', boxbm(.1, .95, .15, 0, .475, z), 'GALV', A, smooth=False)
    add_mesh(f'gr_block{z}', boxbm(.16, .3, .14, .12, .71, z), 'DARK', A, smooth=False)

# 3. tall median conifer: stacked, noise-jittered cones on a short trunk
A = 'Conifer'
add_mesh('cf_trunk', cyl(.2, .08, 3.2, 8), 'BARK', A)
bm = bmesh.new()
for k in range(10):
    h0 = 1.4 + k * 1.05; r = 2.5 * (1 - k / 11) + .25; b2 = bmesh.new()
    bmesh.ops.create_cone(b2, cap_ends=True, segments=13, radius1=r, radius2=r * .42, depth=2.1)
    for v in b2.verts:
        n = noise.noise(v.co * 2.1 + Vector((k * 1.7, 0, 0))); v.co.x *= 1 + .3 * n; v.co.y *= 1 + .3 * n; v.co.z += h0 + 1.05 - .25 * (v.co.x ** 2 + v.co.y ** 2) ** .5 / max(r, .1)
    merge_into(bm, b2)
add_mesh('cf_needles', bm, 'NEEDLE', A, smooth=False)

# 4. median shade tree: trunk, three limbs, a cloud of lumpy leaf masses
A = 'Broadleaf'
add_mesh('bl_trunk', cyl(.25, .14, 4.2, 8), 'BARK', A)
for k, a in enumerate((0, 2.1, 4.2)):
    tube(f'bl_limb{k}', [(0, 3.6, 0), (math.cos(a) * 1.0, 4.8, math.sin(a) * 1.0), (math.cos(a) * 1.8, 5.9, math.sin(a) * 1.8)], .1, 'BARK', A, res=4)
bm = bmesh.new()
for k in range(9):
    b2 = bmesh.new(); bmesh.ops.create_icosphere(b2, subdivisions=2, radius=1.)
    a = k / 9 * 6.283 + random.random(); rr = 1.2 + random.random() * 1.4; s = 1.6 + random.random() * 1.1
    c = G(math.cos(a) * rr, 6.4 + random.random() * 2.2, math.sin(a) * rr)
    for v in b2.verts:
        n = noise.noise(v.co * 2.3 + Vector((k * 3, 0, 0))); v.co = v.co * s * (1 + .22 * n) + c
    merge_into(bm, b2)
add_mesh('bl_leaves', bm, 'LEAF', A, smooth=False)

# 5. single-post guide sign: I-beam post, galvanised backing, green face with 0..1 UVs (the game paints the legend)
A = 'GuideSign'
add_mesh('gs_post', boxbm(.22, 5.6, .3, 0, 2.8, -.3), 'GALV', A, smooth=False)
add_mesh('gs_back', boxbm(3.3, 1.9, .08, 0, 5.1, -.02), 'SIGNBACK', A, smooth=False)
bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap')
vs = [bm.verts.new(G(x, y, .03)) for x, y in ((-1.6, 4.2), (1.6, 4.2), (1.6, 6.0), (-1.6, 6.0))]
f = bm.faces.new(vs)
for l, uv in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): l[uvl].uv = uv
bm.normal_update()
if f.normal.dot(G(0, 0, 1)) < 0:
    f.normal_flip()
    for l, uv in zip(f.loops, ((0, 1), (1, 1), (1, 0), (0, 0))): pass
add_mesh('gs_face', bm, 'SIGN', A, smooth=False)
for x in (-1.1, 1.1): add_mesh(f'gs_brk{x}', boxbm(.08, 1.7, .1, x, 5.1, -.12), 'GALV', A, smooth=False)

tris = {a: sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in e.children) for a, e in roots.items()}
print('assets', tris)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True, export_texcoords=True,
                          export_normals=True, export_materials='EXPORT', export_lights=False, export_cameras=False)
print('wrote', OUT, os.path.getsize(OUT))

if RENDER:  # Blender (Cycles) preview: the kit laid out along a strip of median grass at dusk
    for i, a in enumerate(['LampTwin', 'Conifer', 'Broadleaf', 'GuideSign', 'Guardrail']): roots[a].location = G((i - 2) * 7.5, 0, 0)
    for a, dz in (('Guardrail', 4.04), ('Guardrail', -4.04)):
        e = bpy.data.objects.new(a + '_dup', None); scene.collection.objects.link(e); e.location = roots[a].location + G(0, 0, dz)
        for c in roots[a].children:
            d = c.copy(); scene.collection.objects.link(d); d.parent = e
    world = bpy.data.worlds.new('W'); scene.world = world; world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (.12, .15, .24, 1); world.node_tree.nodes['Background'].inputs['Strength'].default_value = .6
    bpy.ops.mesh.primitive_plane_add(size=80); gnd = bpy.context.active_object; mat('GRASS', (.05, .09, .035), 0, 1.); gnd.data.materials.append(MATS['GRASS'])
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 2.2; sun.color = (1., .82, .62); so = bpy.data.objects.new('sun', sun); scene.collection.objects.link(so); so.rotation_euler = (math.radians(62), 0, math.radians(35))
    cam = bpy.data.cameras.new('C'); cam.lens = 32; co = bpy.data.objects.new('C', cam); scene.collection.objects.link(co); scene.camera = co
    co.location = G(3, 4.2, 26); d = G(0, 4.6, 0) - co.location; co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    scene.render.engine = 'CYCLES'; scene.cycles.samples = 24; scene.cycles.use_denoising = True
    scene.render.resolution_x = 1280; scene.render.resolution_y = 600; scene.render.filepath = RENDER + '.png'
    bpy.ops.render.render(write_still=True)
