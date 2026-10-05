"""AFTERHOURS — Calder Tunnel hero kit + look-dev scene (Blender 5.x, bpy). Built from the Midjourney tunnel frames in
docs/calder-ref (05/06 portal, 07/08 fins, 03/04 gallery). Game coords: x right, y up, z forward. Blender: (x, -z, y).

Assets (Empty + parented parts, one material per part, origin on the road centreline at grade, tube along local +z):
  PortalHood  — lens-shaped hood: titanium outer shell, copper lining, LED lip ring + inset ring; reaches back to z = -21
                (place at the mouth facing out; flip 180 degrees for the exit portal)
  HexRing     — one 2.15 m ring of faceted hex panels with lit seams around the elliptical vault (AS x BS); the game swaps
                HEXFACE / HEXEDGE materials per act (copper throat, cyan hex vault)
  FinSlat     — one swept rib of the fin vault (look-dev reference; the game generates the same slats along the curve)
CLI:   blender -b -P calder_tunnel.py -- --out ../../models/calder_tunnel.glb
Live:  exec inside Blender — builds the 'Calder Tunnel LD' scene (assets + a straight look-dev tube, cameras per act).
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector
ARGV = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGV[ARGV.index('--out') + 1] if '--out' in ARGV else None
PI = math.pi
A, B, FD = 10.6, 8.2, 1.9                 # fin vault inner ellipse and fin depth (match calderTunnel in afterhours.js)
AS, BS = A + FD + .25, B + FD + .25        # the shell behind the fins / portal throat
def G(x, y, z): return Vector((x, -z, y))
def E(a, b, t, z, d=0.):                   # point on the vault ellipse, pushed d metres inward along the normal
    x, y = a * math.cos(t), b * math.sin(t)
    nx, ny = b * math.cos(t), a * math.sin(t); l = math.hypot(nx, ny) or 1
    return G(x - nx / l * d, y - ny / l * d, z)

SC_NAME = 'Calder Tunnel LD'
old = bpy.data.scenes.get(SC_NAME)
if old:
    for o in list(old.objects): bpy.data.objects.remove(o)
    bpy.data.scenes.remove(old)
for c in [c for c in bpy.data.collections if c.name.endswith('_C') or c.name in ('CalderTunnelKit', 'LookDev')]: bpy.data.collections.remove(c)
scene = bpy.data.scenes.new(SC_NAME)
if bpy.context.window:
    bpy.context.window.scene = scene
kit = bpy.data.collections.new('CalderTunnelKit'); scene.collection.children.link(kit)
ld = bpy.data.collections.new('LookDev'); scene.collection.children.link(ld)

# ---------------- materials ----------------
MATS = {}
def mat(name, col, metal=0., rough=.5, emit=None, es=0., glow_attr=False):
    if bpy.data.materials.get(name): bpy.data.materials.remove(bpy.data.materials[name])
    m = bpy.data.materials.new(name)
    m.use_nodes = True; nt = m.node_tree; b = nt.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    if glow_attr:                                         # fins: emission = glow^3 from the colour attribute (look-dev only)
        at = nt.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'Col'
        sp = nt.nodes.new('ShaderNodeSeparateColor'); pw = nt.nodes.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 5.
        mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = es
        nt.links.new(at.outputs['Color'], sp.inputs[0]); nt.links.new(sp.outputs[0], pw.inputs[0]); nt.links.new(pw.outputs[0], mu.inputs[0])
        nt.links.new(mu.outputs[0], b.inputs['Emission Strength'])
    MATS[name] = m; return m
mat('TITANIUM', (.62, .64, .68), 1., .27)
mat('COPPER', (.86, .47, .27), 1., .2)
mat('DARKMETAL', (.03, .032, .035), .8, .38)
mat('LEDCU', (1, .7, .45), 0, .3, emit=(1., .58, .28), es=9.)
mat('LEDCY', (.6, .95, 1), 0, .3, emit=(.35, .92, 1.), es=8.)
mat('HEXFACE', (.82, .45, .25), 1., .22)
mat('HEXEDGE', (1, .7, .4), 0, .3, emit=(1., .55, .25), es=7.)
mat('FIN', (.55, .36, .24), .65, .3, emit=(1., .55, .25), es=5., glow_attr=True)
mat('FINBACK', (.06, .035, .02), 0, .7, emit=(.6, .26, .09), es=.5)
mat('ROAD', (.035, .036, .04), .35, .09)
mat('BRONZE', (.62, .42, .28), .8, .3)
mat('GLASS', (.05, .07, .09), 1., .02)
mat('WARMLED', (1, .9, .8), 0, .3, emit=(1., .82, .6), es=9.)

roots = {}
def root(a):
    if a not in roots:
        e = bpy.data.objects.new(a, None); kit.objects.link(e); roots[a] = e
    return roots[a]
def add(name, bm, m, coll=None, parent=None, smooth=False, colattr=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free(); me.materials.append(MATS[m])
    if smooth:
        for p in me.polygons: p.use_smooth = True
    if colattr is not None:                               # per-vertex glow, written as the COLOR_0 attribute 'Col'
        ca = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
        for i, g in enumerate(colattr): ca.data[i].color = (g, g, g, 1.)
    ob = bpy.data.objects.new(name, me); (coll or kit).objects.link(ob)
    if parent: ob.parent = root(parent)
    return ob
def grid(rows, cols, fn, close=False):                    # quad grid from fn(i, j) -> Vector
    bm = bmesh.new(); vs = [[bm.verts.new(fn(i, j)) for j in range(cols)] for i in range(rows)]
    for i in range(rows - 1):
        for j in range(cols - 1): bm.faces.new((vs[i][j], vs[i][j + 1], vs[i + 1][j + 1], vs[i + 1][j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); return bm
def tube(pts, r, segs=10):                                # a lit cable / LED ring through points
    bm = bmesh.new(); rings = []
    for k, p in enumerate(pts):
        t = (pts[min(k + 1, len(pts) - 1)] - pts[max(k - 1, 0)]).normalized()
        u = t.cross(Vector((0, 0, 1))); u = (u if u.length > 1e-4 else t.cross(Vector((1, 0, 0)))).normalized(); v = t.cross(u)
        rings.append([bm.verts.new(p + (u * math.cos(a) + v * math.sin(a)) * r) for a in [i / segs * 2 * PI for i in range(segs)]])
    for k in range(len(rings) - 1):
        for i in range(segs): bm.faces.new((rings[k][i], rings[k][(i + 1) % segs], rings[k + 1][(i + 1) % segs], rings[k + 1][i]))
    return bm

# ---------------- PortalHood ----------------
def hood_pt(u, t, d=0.):
    st = max(0., math.sin(t)); reach = 3 + 14 * st ** .85; k = 1 + .38 * (1 - u) ** 2 * (.6 + .4 * st)
    return E(AS * k, BS * k, t, -reach * (1 - u), d)
NU, NT = 18, 56
TS = [-.06 + (PI + .12) * j / NT for j in range(NT + 1)]
bm = grid(NU + 1, NT + 1, lambda i, j: hood_pt(i / NU, TS[j], -1.1))             # titanium outer shell
add('Hood_Shell', bm, 'TITANIUM', parent='PortalHood', smooth=True)
bm = grid(NU + 1, NT + 1, lambda i, j: hood_pt(.02 + .98 * i / NU, TS[j], .02))  # copper lining
add('Hood_Lining', bm, 'COPPER', parent='PortalHood', smooth=True)
bm = grid(2, NT + 1, lambda i, j: hood_pt(0., TS[j], (-1.1, .02)[i]))             # the thick rim face
add('Hood_Rim', bm, 'TITANIUM', parent='PortalHood', smooth=True)
add('Hood_LipLED', tube([hood_pt(.03, t, .25) for t in TS], .34), 'LEDCU', parent='PortalHood', smooth=True)
add('Hood_InsetLED', tube([hood_pt(.4, t, .2) for t in TS], .22), 'LEDCU', parent='PortalHood', smooth=True)

# ---------------- HexRing (2.15 m module, tiles along z) ----------------
def ell_len(a, b, t0, t1, n=400):
    pts = [Vector((a * math.cos(t0 + (t1 - t0) * i / n), b * math.sin(t0 + (t1 - t0) * i / n))) for i in range(n + 1)]
    cum = [0.]
    for i in range(n): cum.append(cum[-1] + (pts[i + 1] - pts[i]).length)
    return cum, n
HR = .64; HROW = math.sqrt(3) * HR; HLEN = 2 * HROW                                # flat-top hexes, two rows per module
T0H, T1H = .02, PI - .02
cum, nn = ell_len(AS, BS, T0H, T1H)
NCOL = int(cum[-1] / (1.5 * HR)) // 2 * 2; SP = cum[-1] / NCOL
def t_at(sig):                                            # ellipse angle at arc length sig
    sig = max(0., min(cum[-1], sig))
    lo, hi = 0, nn
    while hi - lo > 1:
        m = (lo + hi) // 2
        if cum[m] < sig: lo = m
        else: hi = m
    f = (sig - cum[lo]) / max(1e-6, cum[hi] - cum[lo]); return T0H + (T1H - T0H) * (lo + f) / nn
def S(sig, z, d): return E(AS, BS, t_at(sig), z, d)
bmF, bmE = bmesh.new(), bmesh.new()
sx = SP / (1.5 * HR)                                      # stretch the hexes a touch to close the arch exactly
for c in range(NCOL + 1):
    sig0 = c * SP
    for r in range(-1, 3):
        z0 = r * HROW + (HROW / 2 if c % 2 else 0)
        if z0 - HROW / 2 >= HLEN or z0 + HROW / 2 <= 0: continue
        corner = [(sig0 + HR * sx * math.cos(k * PI / 3), z0 + HR * math.sin(k * PI / 3)) for k in range(6)]
        inner = [(sig0 + (HR - .09) * sx * math.cos(k * PI / 3), z0 + (HR - .09) * math.sin(k * PI / 3)) for k in range(6)]
        if any(z < -1e-6 or z > HLEN + 1e-6 for _, z in corner):  # clip to the module: keep whole hexes owned by this module
            if not (0 <= z0 < HLEN): continue
        if any(s < -1e-6 or s > cum[-1] + 1e-6 for s, _ in corner): continue
        cv = bmF.verts.new(S(sig0, z0, .32)); iv = [bmF.verts.new(S(s, z, .12)) for s, z in inner]   # faceted face, dished in
        for k in range(6): bmF.faces.new((cv, iv[k], iv[(k + 1) % 6]))
        ov = [bmE.verts.new(S(s, z, .02)) for s, z in corner]; iv2 = [bmE.verts.new(S(s, z, .12)) for s, z in inner]
        for k in range(6): bmE.faces.new((ov[k], ov[(k + 1) % 6], iv2[(k + 1) % 6], iv2[k]))
bmesh.ops.recalc_face_normals(bmF, faces=bmF.faces); bmesh.ops.recalc_face_normals(bmE, faces=bmE.faces)
add('HexRing_Face', bmF, 'HEXFACE', parent='HexRing'); add('HexRing_Edge', bmE, 'HEXEDGE', parent='HexRing')
bm = grid(2, 41, lambda i, j: E(AS + .05, BS + .05, -.05 + (PI + .1) * j / 40, i * HLEN))
add('HexRing_Back', bm, 'DARKMETAL', parent='HexRing')

# ---------------- FinSlat: one swept rib of the fin vault (Midjourney fin frames). In the game the same parametrisation
# is generated along the curved track (calderTunnel in afterhours.js); here it is a straight 1:1 copy for look-dev. A slat's
# inner edge climbs the arch on a diagonal (z = KAP * arc length), its root leans LEAN back so the broad face looks at the
# driver, and it is THK thick. Vertex colour R = glow (1 on the inner edge, 0 at the root).
KAP, LEAN, THK, FPITCH, FDEP = .62, 1.6, .16, 1.25, 2.3
cumF, nF = ell_len(A, B, -.02, PI + .02)
def tF(sig):
    sig = max(0., min(cumF[-1], sig)); lo, hi = 0, nF
    while hi - lo > 1:
        m = (lo + hi) // 2
        if cumF[m] < sig: lo = m
        else: hi = m
    f = (sig - cumF[lo]) / max(1e-6, cumF[hi] - cumF[lo]); return -.02 + (PI + .04) * (lo + f) / nF
def slat(z0, ns=56):
    bm = bmesh.new(); glow = []; L = cumF[-1]; rows = []
    for i in range(ns + 1):
        sg = L * i / ns; t = tF(sg); z = z0 + KAP * (sg - L / 2)
        row = []
        for dz, dout in ((0, 0), (THK, 0), (THK - LEAN, FDEP), (-LEAN, FDEP)):   # inner front, inner back, root back, root front
            row.append(bm.verts.new(E(A + dout, B + dout, t, z + dz))); glow.append(1 - dout / FDEP)
        rows.append(row)
    for i in range(ns):
        r0, r1 = rows[i], rows[i + 1]
        for k in range(4): bm.faces.new((r0[k], r0[(k + 1) % 4], r1[(k + 1) % 4], r1[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); return bm, glow
bm, glow = slat(0.); add('FinSlat_Blade', bm, 'FIN', parent='FinSlat', colattr=glow, smooth=True)
bm = grid(2, 41, lambda i, j: E(A + FDEP + .3, B + FDEP + .3, -.05 + (PI + .1) * j / 40, (-1, 1)[i] * FPITCH / 2))
add('FinSlat_Back', bm, 'FINBACK', parent='FinSlat')

# ---------------- look-dev tube: portal -> copper hex throat -> fins -> gallery -> cyan hex, straight, dusk outside ----------------
def inst(asset, z, flip=False, mats=None):
    src = root(asset); e = bpy.data.objects.new(asset + '_ld', None); e.instance_type = 'COLLECTION'
    if asset + '_C' not in bpy.data.collections:
        c = bpy.data.collections.new(asset + '_C')
        for ch in src.children: c.objects.link(ch)
    e.instance_collection = bpy.data.collections[asset + '_C']; e.location = G(0, 0, z)
    if flip: e.rotation_euler[2] = PI
    ld.objects.link(e); return e
LD = {'portal': 0., 'throat1': 28., 'fins1': 150., 'gal0': 156., 'gal1': 236., 'hex0': 242., 'hex1': 330.}
inst('PortalHood', 0.)
for k in range(int(28 / HLEN)): inst('HexRing', k * HLEN)
z = 28. + 12
while z < LD['fins1'] - 12: inst('FinSlat', z); z += FPITCH
z = LD['hex0']
while z < LD['hex1']: inst('HexRing', z); z += HLEN
bm = grid(2, 2, lambda i, j: G((-14, 14)[j], 0, (-60, 400)[i])); add('LD_Road', bm, 'ROAD', coll=ld)
for sd in (-1, 1):
    bm = grid(2, 2, lambda i, j: G(sd * (7.55 + .2 * j), .03, (-10, 400)[i])); add('LD_EdgeLED%d' % sd, bm, 'WARMLED', coll=ld)
# gallery: bronze vault on the right, glass on the left (in the game the glass faces the harbor)
TG = 1.95
bm = grid(2, 31, lambda i, j: E(A + .2, B + .7, TG * j / 30, (LD['gal0'], LD['gal1'])[i])); add('LD_GalVault', bm, 'BRONZE', coll=ld, smooth=True)
bm = grid(2, 15, lambda i, j: E(A + .2, B + .7, TG + (PI - TG) * j / 14, (LD['gal0'], LD['gal1'])[i])); add('LD_GalGlass', bm, 'GLASS', coll=ld, smooth=True)
for i in range(5):
    tc, ph = (.5, .82, 1.12, 1.42, 1.7)[i], (0, 1.7, 3.1, 4.4, 5.9)[i]
    pts = [E(A + .16, B + .66, tc + .17 * math.sin(z / (23 + i * 3) + ph), z) for z in [LD['gal0'] + q for q in range(0, 81, 2)]]
    add('LD_GalLine%d' % i, tube(pts, .06, 6), 'WARMLED', coll=ld)
# dusk world + volumetric haze
if bpy.data.worlds.get('CalderDusk'): bpy.data.worlds.remove(bpy.data.worlds['CalderDusk'])
w = bpy.data.worlds.new('CalderDusk'); scene.world = w; w.use_nodes = True
nt = w.node_tree; bg = nt.nodes.get('Background'); bg.inputs[1].default_value = 1.
for n in [n for n in nt.nodes if n.type in ('TEX_GRADIENT', 'VALTORGB', 'TEX_COORD', 'MAPPING', 'SEPARATE_XYZ')]: nt.nodes.remove(n)
tc = nt.nodes.new('ShaderNodeTexCoord'); sx = nt.nodes.new('ShaderNodeSeparateXYZ'); cr = nt.nodes.new('ShaderNodeValToRGB')
nt.links.new(tc.outputs['Generated'], sx.inputs[0]); nt.links.new(sx.outputs['Z'], cr.inputs[0]); nt.links.new(cr.outputs[0], bg.inputs[0])
el = cr.color_ramp.elements; el[0].position, el[0].color = .5, (.9, .42, .2, 1); el[1].position, el[1].color = .62, (.16, .12, .3, 1)
e2 = el.new(.53); e2.color = (.75, .32, .38, 1)                     # orange band on the horizon to violet overhead (frame 05)
sun = bpy.data.objects.new('LD_Sun', bpy.data.lights.new('LD_Sun', 'SUN')); sun.data.energy = 1.6; sun.data.color = (1, .62, .42)
sun.rotation_euler = (math.radians(84), 0, math.radians(200)); ld.objects.link(sun)
hz = bpy.data.materials.new('LD_Haze'); hz.use_nodes = True; hn = hz.node_tree
for n in list(hn.nodes):
    if n.type != 'OUTPUT_MATERIAL': hn.nodes.remove(n)
vs = hn.nodes.new('ShaderNodeVolumeScatter'); vs.inputs['Density'].default_value = .005; vs.inputs['Color'].default_value = (1, .85, .7, 1)
hn.links.new(vs.outputs[0], hn.nodes['Material Output'].inputs['Volume']); MATS['LD_Haze'] = hz
bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.)
for v in bm.verts: v.co = Vector((v.co.x * 26, v.co.y * 340 - 175, v.co.z * 12 + 6))
add('LD_HazeBox', bm, 'LD_Haze', coll=ld)
# hillside around the portal, with cypresses (frames 05/06)
bm = grid(2, 2, lambda i, j: G((-400, 400)[j], -.05, (-600, 0)[i])); add('LD_Ground', bm, 'DARKMETAL', coll=ld)
mat('ROCK', (.16, .12, .1), 0, .9); mat('CYPRESS', (.04, .07, .04), 0, .9)
bm = grid(9, 41, lambda i, j: G((-90 + 180 * j / 40), max(0., 34 - abs(-90 + 180 * j / 40) * .18) * min(1, i / 2) - .2, -2 + i * 8))
add('LD_Hill', bm, 'ROCK', coll=ld, smooth=True)
import random; rnd = random.Random(5)
for k in range(46):
    x = rnd.choice((-1, 1)) * rnd.uniform(16, 70); h = rnd.uniform(9, 16); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=1.3, radius2=.05, depth=h)
    for v in bm.verts: v.co += G(x, h / 2 + max(0., 34 - abs(x) * .18) * .9 - 1, rnd.uniform(-8, 40))
    add('LD_Cyp%d' % k, bm, 'CYPRESS', coll=ld)
# cameras per act (game chase-cam height)
def cam(name, z, x=0., y=1.6, look=40., fov=64.):
    cd = bpy.data.cameras.new(name); cd.angle = math.radians(fov); cd.clip_end = 2000; o = bpy.data.objects.new(name, cd); ld.objects.link(o)
    o.location = G(x, y, z); d = (G(0, 1.2, z + look) - o.location); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return o
cam('CAM_portal', -78, 1.5, 2.6, 80, 50); cam('CAM_throat', 4, 0, 1.5, 30); cam('CAM_fins', 70, -2, 1.4, 40)
cam('CAM_gallery', 170, 1.5, 1.5, 40, 70); cam('CAM_hex', 270, 0, 1.4, 40)
r = scene.render; r.resolution_x, r.resolution_y = 960, 540
r.engine = 'CYCLES'                                       # path tracing: the tube must really occlude the sky for the fins to read
try:
    pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = 'METAL'; pr.get_devices()
    for d in pr.devices: d.use = True
    scene.cycles.device = 'GPU'
except Exception: pass
scene.cycles.samples = 96; scene.cycles.use_denoising = True; scene.cycles.max_bounces = 6; scene.cycles.volume_step_rate = 4.
for k, v in (('use_raytracing', True), ('taa_render_samples', 48), ('volumetric_tile_size', '4'), ('volumetric_end', 400.)):
    try: setattr(scene.eevee, k, v)
    except Exception: pass
r.image_settings.file_format = 'JPEG'; r.image_settings.quality = 82
try: scene.view_settings.view_transform = 'AgX'; scene.view_settings.look = 'AgX - Punchy'
except Exception: pass

if OUT:                                                   # export only the kit collection
    for o in scene.objects: o.select_set(False)
    for o in kit.all_objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT), export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
result = {'hex_cols': NCOL, 'hex_faces': len(bpy.data.objects['HexRing_Face'].data.polygons), 'slat_faces': len(bpy.data.objects['FinSlat_Blade'].data.polygons)}
