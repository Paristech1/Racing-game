"""AFTERHOURS — Roosevelt Blvd kit, built in Blender (bpy). Game coords: x right, y up, z forward. Blender: (x, -z, y).
Median kit: LampTwin, Guardrail, Conifer, Broadleaf, GuideSign.  Roadside kit: ParkSedan, ParkSUV, GasStation, StripBay, MallAnchor, LotPole.
Each asset is an Empty with its parts parented.
CLI:  python3 blvd_kit.py --out blvd_kit.glb [--render prefix]      Live: run inside Blender (builds a 'Blvd Kit' scene)
"""
import bpy, bmesh, math, os, random, sys
from mathutils import Vector, Matrix, noise
random.seed(7)
CLI = '--out' in sys.argv
OUT = sys.argv[sys.argv.index('--out') + 1] if CLI else None
RENDER = sys.argv[sys.argv.index('--render') + 1] if '--render' in sys.argv else None
def G(x, y, z): return Vector((x, -z, y))
if CLI:
    bpy.ops.wm.read_factory_settings(use_empty=True); scene = bpy.context.scene
    def DG(): return bpy.context.evaluated_depsgraph_get()
else:
    old = bpy.data.scenes.get('Blvd Kit')
    if old:
        for o in list(old.objects): bpy.data.objects.remove(o)
        bpy.data.scenes.remove(old)
    scene = bpy.data.scenes.new('Blvd Kit')
    for w in bpy.context.window_manager.windows: w.scene = scene
    VL = scene.view_layers[0]
    def DG():
        d = VL.depsgraph; d.update(); return d

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
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(DG()))
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

# ---------------------------------------------------------------- ROADSIDE (v2): cars, gas station, strip-mall bays, mall anchor, lot lights
# Buildings face +x (toward the road on the left side of the Blvd; the game rotates them 180° for the right side).
mat('CARPAINT', (.9, .9, .9), .55, .3); mat('CARGLASS', (.02, .025, .03), .3, .06); mat('TYRE', (.02, .02, .02), 0, .85); mat('TRIM', (.05, .05, .055), .3, .5)
mat('LENSW', (.8, .82, .85), .2, .1); mat('LENSR', (.35, .02, .02), .1, .2)
mat('STONE', (.36, .33, .3), 0, .95); mat('WHITE', (.85, .86, .88), .1, .5); mat('PUMP', (.05, .06, .07), .4, .4); mat('SCREEN', (.6, .8, 1.), 0, .3, emit=(.4, .7, 1.))
mat('BRICK', (.33, .16, .11), 0, .9); mat('STOREGLASS', (.95, .85, .65), 0, .2, emit=(1., .82, .55)); mat('FASCIA', (.1, .1, .11), .2, .6)
mat('PRECAST', (.62, .56, .46), 0, .85); mat('ENTRY', (.8, .9, 1.), 0, .2, emit=(.7, .85, 1.)); mat('ROOF', (.07, .07, .08), 0, 1.)

def loft_bm(stations):  # rings of game-space points (closed), capped
    bm = bmesh.new(); rings = [[bm.verts.new(G(*p)) for p in r] for r in stations]; n = len(stations[0])
    for i in range(len(rings) - 1):
        for j in range(n): bm.faces.new((rings[i][j], rings[i][(j + 1) % n], rings[i + 1][(j + 1) % n], rings[i + 1][j]))
    bm.faces.new(list(reversed(rings[0]))); bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); return bm
def car(asset, L, W, H, belt, hood, roofL, roofZ, ride=.16, wr=.34, wb=1.38, suv=False):
    # body: a rounded box section swept along z, nose and tail tucked in; cabin: a tapered glasshouse
    st = []
    for i in range(14):
        t = i / 13; z = -L / 2 + L * t; e = min(t, 1 - t) / .12; e = min(e, 1.)
        hw = W / 2 * (.9 + .1 * math.sin(e * math.pi / 2)); top = (hood if z > wb * .55 else belt) * (.92 + .08 * e) if not suv else belt * (.95 + .05 * e)
        bot = ride + .12 * (1 - e)
        st.append([(0, bot, z), (hw * .92, bot, z), (hw, bot + .12, z), (hw, top - .1, z), (hw * .93, top, z), (0, top + .02, z), (-hw * .93, top, z), (-hw, top - .1, z), (-hw, bot + .12, z), (-hw * .92, bot, z)])
    bodyo = add_mesh(asset + '_body', loft_bm(st), 'CARPAINT', asset)
    cuts = []                                                    # wheel arches: boolean cylinders so the tyres show
    for zw in (wb, -wb):
        cb = cyl(wr + .06, wr + .06, W + .4, 24); xform(cb, Matrix.Translation((0, 0, -(W + .4) / 2))); xform(cb, Matrix.Rotation(math.pi / 2, 4, 'Y')); xform(cb, Matrix.Translation(G(0, wr, zw)))
        me = bpy.data.meshes.new('cut'); cb.to_mesh(me); cb.free(); co_ = bpy.data.objects.new('cut', me); scene.collection.objects.link(co_); cuts.append(co_)
    for co_ in cuts:
        md = bodyo.modifiers.new('arch', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.solver = 'EXACT'; md.object = co_
    nm = bpy.data.meshes.new_from_object(bodyo.evaluated_get(DG())); bodyo.modifiers.clear(); om = bodyo.data; bodyo.data = nm; bpy.data.meshes.remove(om)
    for co_ in cuts: bpy.data.objects.remove(co_)
    wl = bmesh.new()                                             # dark arch liners
    for zw in (wb, -wb):
        lb = bmesh.new(); bmesh.ops.create_cone(lb, cap_ends=False, segments=20, radius1=wr + .055, radius2=wr + .055, depth=W - .1)
        xform(lb, Matrix.Rotation(math.pi / 2, 4, 'Y')); xform(lb, Matrix.Translation(G(0, wr, zw))); merge_into(wl, lb)
    bmesh.ops.delete(wl, geom=[v for v in wl.verts if v.co.z < wr - .02], context='VERTS')
    add_mesh(asset + '_liner', wl, 'TRIM', asset, smooth=False)
    cs = []
    zf, zr = roofZ + roofL / 2, roofZ - roofL / 2
    for z, k in ((zr - (.35 if not suv else .08), 0), (zr, 1), (zf, 1), (zf + (.75 if not suv else .5), 0)):
        hw = W / 2 * (.88 if k == 0 else .86); y0 = belt - .02; y1 = y0 + (H - belt) * (.12 if k == 0 else 1)
        cs.append([(hw, y0, z), (hw * .78 if k else hw * .95, y1, z), (-(hw * .78 if k else hw * .95), y1, z), (-hw, y0, z)])
    add_mesh(asset + '_cab', loft_bm(cs), 'CARGLASS', asset, smooth=False)
    add_mesh(asset + '_roof', boxbm(W * .86 * .78 * 2 / 2 + .02, .04, roofL * .98, 0, H - .01, roofZ), 'CARPAINT', asset, smooth=False)
    for sx in (1, -1):
        for zw in (wb, -wb):
            b = cyl(wr, wr, .22, 16); xform(b, Matrix.Translation((0, 0, -.11))); xform(b, Matrix.Rotation(math.pi / 2, 4, 'Y')); xform(b, Matrix.Translation(G(sx * (W / 2 - .12), wr, zw)))
            add_mesh(f'{asset}_t{sx}{zw}', b, 'TYRE', asset, smooth=False)
            h = cyl(wr * .62, wr * .62, .02, 12); xform(h, Matrix.Rotation(math.pi / 2, 4, 'Y')); xform(h, Matrix.Translation(G(sx * (W / 2 - .01), wr, zw)))
            add_mesh(f'{asset}_h{sx}{zw}', h, 'TRIM', asset, smooth=False)
        add_mesh(f'{asset}_hl{sx}', boxbm(.4, .1, .03, sx * (W / 2 - .3), hood - .12, L / 2 + .005), 'LENSW', asset, smooth=False)
        add_mesh(f'{asset}_tl{sx}', boxbm(.36, .12, .03, sx * (W / 2 - .28), belt - .12, -L / 2 - .005), 'LENSR', asset, smooth=False)
    add_mesh(asset + '_grille', boxbm(W * .5, .16, .03, 0, hood - .26, L / 2 + .004), 'TRIM', asset, smooth=False)
    add_mesh(asset + '_bumpr', boxbm(W * .96, .14, .06, 0, ride + .16, -L / 2), 'TRIM', asset, smooth=False)
car('ParkSedan', 4.7, 1.84, 1.44, .92, .84, 1.7, -.2)
car('ParkSUV', 4.8, 1.92, 1.76, 1.08, 1.04, 2.5, -.35, ride=.22, wr=.37, wb=1.42, suv=True)

# gas station: pitched canopy on stone-clad columns, exposed white trusses, recessed downlights, pump islands, bollards
A = 'GasStation'
CW, CD, CH = 24., 14., 5.6          # canopy length (z), depth (x), clearance
b = bmesh.new()
for sgn in (1, -1):                 # two roof planes meeting at a ridge along z
    vs = [b.verts.new(G(0, CH + 1.4, -CW / 2)), b.verts.new(G(0, CH + 1.4, CW / 2)), b.verts.new(G(sgn * CD / 2, CH + .5, CW / 2)), b.verts.new(G(sgn * CD / 2, CH + .5, -CW / 2))]
    b.faces.new(vs if sgn > 0 else list(reversed(vs)))
bmesh.ops.solidify(b, geom=b.faces[:], thickness=.18); bmesh.ops.recalc_face_normals(b, faces=b.faces)
add_mesh('gs_roof', b, 'WHITE', A, smooth=False)
add_mesh('gs_fasc_f', boxbm(.12, .6, CW, CD / 2, CH + .5, 0), 'WHITE', A, smooth=False)
add_mesh('gs_fasc_b', boxbm(.12, .6, CW, -CD / 2, CH + .5, 0), 'WHITE', A, smooth=False)
for z in [-CW / 2 + k * 3 for k in range(9)]:                                  # trusses: a bottom chord + two rafters + webs
    add_mesh(f'gs_chord{z}', boxbm(CD - .4, .12, .12, 0, CH + .3, z), 'WHITE', A, smooth=False)
    for sgn in (1, -1):
        tube(f'gs_raf{z}{sgn}', [(0, CH + 1.3, z), (sgn * CD / 4, CH + .92, z), (sgn * (CD / 2 - .2), CH + .5, z)], .06, 'WHITE', A, res=2)
        for f in (.25, .5, .75):
            x = sgn * (CD / 2 - .2) * f; tube(f'gs_web{z}{sgn}{f}', [(x, CH + .32, z), (x, CH + 1.3 - (CH + 1.3 - (CH + .5)) * abs(x) / (CD / 2) - .05, z)], .03, 'WHITE', A, res=1)
for z in [-CW / 2 + 1.5 + k * 3 for k in range(8)]:
    for x in (-3.5, 0, 3.5): add_mesh(f'gs_dl{z}{x}', boxbm(.9, .03, .9, x, CH + .23, z), 'LAMP', A, smooth=False)
for z in (-7.5, 0, 7.5):                                                      # pump islands with stone columns
    add_mesh(f'gs_isl{z}', boxbm(1.3, .18, 5.2, 0, .09, z), 'CONCRETE', A, smooth=False)
    add_mesh(f'gs_col{z}', boxbm(.7, CH + .1, .7, 0, (CH + .1) / 2 + .18, z + 2.1), 'STONE', A, smooth=False)
    add_mesh(f'gs_colcap{z}', boxbm(.86, .22, .86, 0, CH + .15, z + 2.1), 'WHITE', A, smooth=False)
    for dz in (-.9, .9):
        add_mesh(f'gs_pump{z}{dz}', boxbm(.55, 1.8, .9, 0, 1.08, z + dz - .4), 'PUMP', A, smooth=False)
        for sx in (1, -1): add_mesh(f'gs_scr{z}{dz}{sx}', boxbm(.02, .32, .5, sx * .285, 1.45, z + dz - .4), 'SCREEN', A, smooth=False)
    for dz in (-2.5, 2.5):
        for dx in (-.5, .5):
            bb = cyl(.1, .1, 1.1, 8); xform(bb, Matrix.Translation(G(dx, 0, z + dz))); add_mesh(f'gs_bol{z}{dz}{dx}', bb, 'WHITE', A, smooth=False)
# convenience store behind the canopy: masonry box, full-width storefront glass, parapet, fascia band (game adds the sign)
SX = -CD / 2 - 9.; add_mesh('gs_store', boxbm(12, 4.6, 20, SX - 6, 2.3, 0), 'BRICK', A, smooth=False)
add_mesh('gs_glass', boxbm(.05, 2.5, 16, SX + .02, 1.45, 0), 'STOREGLASS', A, smooth=False)
add_mesh('gs_para', boxbm(12.4, .9, 20.4, SX - 6, 5.05, 0), 'FASCIA', A, smooth=False)
add_mesh('gs_awn', boxbm(1.4, .12, 18, SX + .7, 3.0, 0), 'WHITE', A, smooth=False)
add_mesh('gs_sroof', boxbm(12, .05, 20, SX - 6, 4.63, 0), 'ROOF', A, smooth=False)

# strip-mall bay: 10 m wide, 18 m deep, brick piers, storefront glass with a door, sign fascia, coping, canopy with downlights
A = 'StripBay'
add_mesh('sb_box', boxbm(18, 6., 10, -9, 3., 0), 'BRICK', A, smooth=False)
add_mesh('sb_glass', boxbm(.05, 3.0, 7.6, .02, 1.65, .4), 'STOREGLASS', A, smooth=False)
add_mesh('sb_door', boxbm(.06, 2.4, 1.6, .03, 1.2, -3.8), 'TRIM', A, smooth=False)
add_mesh('sb_fascia', boxbm(.25, 1.4, 10, .12, 4.4, 0), 'FASCIA', A, smooth=False)
add_mesh('sb_cope', boxbm(.5, .18, 10, .1, 6.05, 0), 'CONCRETE', A, smooth=False)
add_mesh('sb_pier', boxbm(.4, 6.2, .5, .15, 3.1, 4.75), 'BRICK', A, smooth=False)
add_mesh('sb_canopy', boxbm(2.6, .2, 10, 1.3, 3.55, 0), 'FASCIA', A, smooth=False)
for z in (-3, 0, 3): add_mesh(f'sb_dl{z}', boxbm(.5, .03, .5, 1.6, 3.44, z), 'LAMP', A, smooth=False)
add_mesh('sb_roof', boxbm(18, .05, 10, -9, 6.02, 0), 'ROOF', A, smooth=False)

# mall anchor (department-store box): precast panels, dark fascia band, glass entry vestibule with a canopy
A = 'MallAnchor'
add_mesh('ma_box', boxbm(40, 11, 64, -20, 5.5, 0), 'PRECAST', A, smooth=False)
for z in [-30 + k * 6 for k in range(11)]: add_mesh(f'ma_rev{z}', boxbm(.18, 10.6, .22, .05, 5.3, z), 'CONCRETE', A, smooth=False)   # panel reveals
add_mesh('ma_band', boxbm(.3, 2.2, 64, .1, 9.4, 0), 'FASCIA', A, smooth=False)
add_mesh('ma_vest', boxbm(4, 4.2, 12, 2, 2.1, 0), 'ENTRY', A, smooth=False)
add_mesh('ma_vcan', boxbm(5.2, .35, 14, 2.4, 4.4, 0), 'WHITE', A, smooth=False)
add_mesh('ma_roof', boxbm(40, .05, 64, -20, 11.02, 0), 'ROOF', A, smooth=False)

# lot light: 12 m square pole, twin shoebox heads
A = 'LotPole'
add_mesh('lp_base', cyl(.35, .35, .7, 10), 'CONCRETE', A, smooth=False)
add_mesh('lp_pole', boxbm(.22, 11.5, .22, 0, 6.4, 0), 'GALV', A, smooth=False)
for sd in (1, -1):
    add_mesh(f'lp_arm{sd}', boxbm(1.1, .12, .12, sd * .6, 11.9, 0), 'GALV', A, smooth=False)
    add_mesh(f'lp_head{sd}', boxbm(.9, .2, .55, sd * 1.3, 11.85, 0), 'DARK', A, smooth=False)
    add_mesh(f'lp_led{sd}', boxbm(.8, .02, .45, sd * 1.3, 11.74, 0), 'LAMP', A, smooth=False)

tris = {a: sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in e.children) for a, e in roots.items()}
print('assets', tris)
if CLI:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True, export_texcoords=True,
                              export_normals=True, export_materials='EXPORT', export_lights=False, export_cameras=False)
    print('wrote', OUT, os.path.getsize(OUT))

# ---------------- preview: a slice of the Blvd roadside at night (lot, cars, gas station, strip mall, anchor)
def preview():
    lay = {'GasStation': G(-10, 0, 10), 'MallAnchor': G(-40, 0, -70), 'LotPole': G(4, 0, -12)}
    for a, p in lay.items(): roots[a].location = p
    for a in ('LampTwin', 'Conifer', 'Broadleaf', 'GuideSign', 'Guardrail'): roots[a].location = G(30, 0, 60 + list(roots).index(a) * 8)
    for i in range(4):
        e = bpy.data.objects.new(f'bay{i}', None); scene.collection.objects.link(e); e.location = G(-24, 0, -16 - i * 10)
        for c in roots['StripBay'].children: d = c.copy(); scene.collection.objects.link(d); d.parent = e
    roots['StripBay'].location = G(-24, 0, -56)
    random.seed(3); cols = [(.8, .8, .82), (.05, .05, .06), (.35, .02, .02), (.05, .12, .3), (.4, .42, .45), (.9, .9, .88)]
    for i in range(14):
        a = 'ParkSedan' if i % 3 else 'ParkSUV'; e = bpy.data.objects.new(f'pc{i}', None); scene.collection.objects.link(e)
        e.location = G(-6 - (i % 2) * 6, 0, -8 - (i // 2) * 2.9); e.rotation_euler = (0, 0, math.pi / 2 if i % 2 else -math.pi / 2)
        m = bpy.data.materials.new(f'cp{i}'); m.use_nodes = True; bs = m.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value = (*cols[i % 6], 1); bs.inputs['Metallic'].default_value = .5; bs.inputs['Roughness'].default_value = .25
        for c in roots[a].children:
            d = c.copy(); d.data = c.data.copy(); scene.collection.objects.link(d); d.parent = e
            if d.data.materials[0].name.startswith('CARPAINT'): d.data.materials[0] = m
    for a in ('ParkSedan', 'ParkSUV'): roots[a].location = G(0, -50, 0)
    gm = bpy.data.meshes.new('lot'); gm.from_pydata([(-150, -150, 0), (150, -150, 0), (150, 150, 0), (-150, 150, 0)], [], [(0, 1, 2, 3)]); mat('ASPH', (.035, .036, .04), 0, .55); gm.materials.append(MATS['ASPH'])
    scene.collection.objects.link(bpy.data.objects.new('lot', gm))
    w = bpy.data.worlds.new('Night'); scene.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (.01, .014, .03, 1)
    for p, e, c in ((G(-10, 5, 10), 3000, (1, .97, .9)), (G(4, 11, -12), 2500, (.9, .95, 1.)), (G(-24, 3, -30), 1200, (1, .85, .6)), (G(-40, 6, -70), 1500, (.9, .95, 1.))):
        L = bpy.data.lights.new('l', 'POINT'); L.energy = e; L.color = c; L.shadow_soft_size = 2; o = bpy.data.objects.new('l', L); scene.collection.objects.link(o); o.location = p
    cam = bpy.data.cameras.new('C'); cam.lens = 24; co = bpy.data.objects.new('KitCam', cam); scene.collection.objects.link(co); scene.camera = co
    co.location = G(22, 7, 26); co.rotation_euler = (G(-18, 3, -18) - co.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.resolution_x = 1280; scene.render.resolution_y = 720
if not CLI:
    preview()
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == 'VIEW_3D': a.spaces[0].shading.type = 'MATERIAL'; a.spaces[0].region_3d.view_perspective = 'CAMERA'
    bpy.ops.wm.save_as_mainfile(filepath=os.path.expanduser('~/Projects/afterhours_blvd_kit.blend'), copy=True)
    result = {'assets': tris}
if CLI and RENDER:
    preview(); scene.render.engine = 'CYCLES'; scene.cycles.samples = 24; scene.cycles.use_denoising = True
    if os.environ.get('CAM') == 'car':
        co = scene.camera; co.location = G(-1, 2.2, -3); co.rotation_euler = (G(-9, .6, -12) - co.location).to_track_quat('-Z', 'Y').to_euler(); co.data.lens = 35
    if os.environ.get('CAM') == 'gas':
        co = scene.camera; co.location = G(8, 3.2, 22); co.rotation_euler = (G(-12, 4, 6) - co.location).to_track_quat('-Z', 'Y').to_euler(); co.data.lens = 28
    scene.render.filepath = RENDER + '.png'; bpy.ops.render.render(write_still=True)
