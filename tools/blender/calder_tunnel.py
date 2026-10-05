"""AFTERHOURS — Calder Tunnel hero kit + look-dev scene (Blender 5.x, bpy). Built from the Midjourney tunnel frames in
docs/calder-ref (05/06 portal, 07/08 fins, 03/04 gallery). Game coords: x right, y up, z forward. Blender: (x, -z, y).

Assets (Empty + parented parts, one material per part, origin on the road centreline at grade, tube along local +z):
  PortalHood  — lens-shaped hood: titanium outer shell, copper lining, LED lip ring + inset ring; reaches back to z = -21
                (place at the mouth facing out; flip 180 degrees for the exit portal)
  HexRing     — one 2.15 m ring of faceted hex panels with lit seams around the elliptical vault (AS x BS); the game swaps
                HEXFACE / HEXEDGE materials per act (copper throat, cyan hex vault)
  FinRing0..3 — one 1.45 m ring of 34 swept, bevelled fins (inner ellipse A x B, depth FD) at four spiral phases; vertex
                colour R = glow (1 on the inner edge, 0 at the root) drives the edge light in the game shader
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
scene = bpy.data.scenes.new(SC_NAME)
if bpy.context.window:
    bpy.context.window.scene = scene
kit = bpy.data.collections.new('CalderTunnelKit'); scene.collection.children.link(kit)
ld = bpy.data.collections.new('LookDev'); scene.collection.children.link(ld)

# ---------------- materials ----------------
MATS = {}
def mat(name, col, metal=0., rough=.5, emit=None, es=0., glow_attr=False):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True; nt = m.node_tree; b = nt.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    if glow_attr:                                         # fins: emission = glow^3 from the colour attribute (look-dev only)
        at = nt.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'Col'
        sp = nt.nodes.new('ShaderNodeSeparateColor'); pw = nt.nodes.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 3.
        mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = es
        nt.links.new(at.outputs['Color'], sp.inputs[0]); nt.links.new(sp.outputs[0], pw.inputs[0]); nt.links.new(pw.outputs[0], mu.inputs[0])
        nt.links.new(mu.outputs[0], b.inputs['Emission Strength'])
    MATS[name] = m; return m
mat('TITANIUM', (.62, .64, .68), 1., .27)
mat('COPPER', (.86, .47, .27), 1., .2)
mat('DARKMETAL', (.03, .032, .035), .8, .38)
mat('LEDCU', (1, .7, .45), 0, .3, emit=(1., .58, .28), es=28.)
mat('LEDCY', (.6, .95, 1), 0, .3, emit=(.35, .92, 1.), es=24.)
mat('HEXFACE', (.82, .45, .25), 1., .22)
mat('HEXEDGE', (1, .7, .4), 0, .3, emit=(1., .55, .25), es=22.)
mat('FIN', (.86, .7, .56), .55, .32, emit=(1., .6, .3), es=30., glow_attr=True)
mat('FINBACK', (.06, .035, .02), 0, .7, emit=(.5, .22, .08), es=.6)
mat('ROAD', (.035, .036, .04), .35, .09)
mat('BRONZE', (.62, .42, .28), .8, .3)
mat('GLASS', (.05, .07, .09), 1., .02)
mat('WARMLED', (1, .9, .8), 0, .3, emit=(1., .82, .6), es=30.)

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
    st = max(0., math.sin(t)); reach = 3 + 18 * st ** .85; k = 1 + .62 * (1 - u) ** 2 * (.55 + .45 * st)
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

# ---------------- FinRing0..3 (1.45 m pitch, four spiral phases) ----------------
NF, TW, LEAN, PITCH, THK = 34, .55, 1.35, 1.45, .07
T0F, T1F = -.02, PI + .02; DT = (T1F - T0F) / NF
for ph in range(4):
    bm = bmesh.new(); glow = []; roll = DT * ph / 4
    for j in range(-1, NF):
        ta = T0F + roll + j * DT; tb = ta + DT * .9
        if tb < T0F or ta > T1F: continue
        ta, tb = max(ta, T0F), min(tb, T1F)
        quad = [(ta, 0., 0.), (tb, TW, 0.), (tb, TW - LEAN, FD), (ta, -LEAN, FD)]   # (angle, z, depth out) inner edge first
        vs = []
        for side in (0, 1):                                  # two faces THK apart along z make a slat
            for t, z, dout in quad:
                taper = 1 - .35 * (dout / FD)                    # thinner at the root, a tapered blade
                vs.append(bm.verts.new(E(A + dout, B + dout, t, z + side * THK * taper)))
                glow.append(max(0., 1 - dout / FD))
        f, b = vs[:4], vs[4:]
        bm.faces.new(f); bm.faces.new(b[::-1])
        for k in range(4): bm.faces.new((f[k], b[k], b[(k + 1) % 4], f[(k + 1) % 4]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    add('FinRing%d_Fins' % ph, bm, 'FIN', parent='FinRing%d' % ph, colattr=glow)
bm = grid(2, 41, lambda i, j: E(AS + .15, BS + .15, -.05 + (PI + .1) * j / 40, i * PITCH))
add('FinBack', bm, 'FINBACK', parent='FinRing0')

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
k = 0; z = 28.
while z < LD['fins1']: inst('FinRing%d' % (k % 4), z); z += PITCH; k += 1
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
w = bpy.data.worlds.get('CalderDusk') or bpy.data.worlds.new('CalderDusk'); scene.world = w; w.use_nodes = True
bg = w.node_tree.nodes.get('Background'); bg.inputs[0].default_value = (.55, .32, .42, 1); bg.inputs[1].default_value = .6
vol = w.node_tree.nodes.get('Volume Scatter') or w.node_tree.nodes.new('ShaderNodeVolumeScatter'); vol.inputs['Density'].default_value = .006
out = w.node_tree.nodes.get('World Output'); w.node_tree.links.new(vol.outputs[0], out.inputs['Volume'])
# cameras per act (game chase-cam height)
def cam(name, z, x=0., y=1.6, look=40., fov=64.):
    cd = bpy.data.cameras.new(name); cd.angle = math.radians(fov); cd.clip_end = 2000; o = bpy.data.objects.new(name, cd); ld.objects.link(o)
    o.location = G(x, y, z); d = (G(0, 1.2, z + look) - o.location); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return o
cam('CAM_portal', -40, 1.5, 3.2, 40, 60); cam('CAM_throat', 4, 0, 1.5, 30); cam('CAM_fins', 70, -2, 1.4, 40)
cam('CAM_gallery', 170, 1.5, 1.5, 40, 70); cam('CAM_hex', 270, 0, 1.4, 40)
r = scene.render; r.resolution_x, r.resolution_y = 960, 540
for eng in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT'):
    try: r.engine = eng; break
    except Exception: pass
try:
    scene.eevee.use_volumetric_shadows = False; scene.eevee.taa_render_samples = 32
except Exception: pass
r.image_settings.file_format = 'JPEG'; r.image_settings.quality = 82
try: scene.view_settings.view_transform = 'AgX'; scene.view_settings.look = 'AgX - Punchy'
except Exception: pass

if OUT:                                                   # export only the kit collection
    for o in scene.objects: o.select_set(False)
    for o in kit.all_objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT), export_format='GLB', use_selection=True, export_apply=True, export_yup=True)
result = {'hex_cols': NCOL, 'hex_faces': len(bpy.data.objects['HexRing_Face'].data.polygons), 'fin_faces': len(bpy.data.objects['FinRing0_Fins'].data.polygons)}
