"""AFTERHOURS — Volcano P1 hero build (showcase renders, not loaded by the game).

Builds the game body from volcano_p1.py at a higher resolution, then adds what the game
does not need: real wheels (tyres with tread, split 10-spoke rims, drilled carbon-ceramic
discs, calipers), an interior, panel shut lines, car-paint / carbon-weave / glass shaders,
a studio, named cameras, and renders.

    python3 volcano_p1_hero.py --blend /tmp/p1_hero.blend [--render /tmp/hero] \
        [--views front34,side,rear34,headon,top,wheel] [--samples 96] [--res 1600x900] [--look studio|night]

Open the .blend in Blender to orbit it or re-render on a GPU (cameras are named Cam_<view>).
"""
import os, sys, math, runpy
import bpy, bmesh
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
def arg(k, d=None): return sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
BLEND = arg('--blend', '/tmp/volcano_p1_hero.blend')
RENDER = arg('--render')
VIEWS = arg('--views', 'front34,side,rear34,headon,top,wheel').split(',')
SAMPLES = int(arg('--samples', 96))
RES = [int(v) for v in arg('--res', '1600x900').split('x')]
LOOK = arg('--look', 'studio')

# ---------------------------------------------------------------- base body, denser than the game build
os.environ.setdefault('P1NS', '320'); os.environ.setdefault('P1PER', '6')
argv = sys.argv; sys.argv = [argv[0], '--out', '/tmp/_p1_hero_base.glb']
ns = runpy.run_path(os.path.join(HERE, 'volcano_p1.py'))
sys.argv = argv
G, M, kf, tube, sharpen = ns['G'], ns['M'], ns['kf'], ns['tube'], ns['sharpen']
surf_y, surf_side, extrude_x, box, lerp = ns['surf_y'], ns['surf_side'], ns['extrude_x'], ns['box'], ns['lerp']
CW, CH, YD = ns['CW'], ns['CH'], ns['YD']
scene = bpy.context.scene
body = bpy.data.objects['Body']

# ---------------------------------------------------------------- shaders
def bsdf(m): return m.node_tree.nodes['Principled BSDF']
def setp(m, **kw):
    b = bsdf(m)
    for k, v in kw.items():
        k = k.replace('_', ' ')
        b.inputs[k].default_value = (*v, 1) if isinstance(v, tuple) and len(v) == 3 else v
def newmat(name, col, metal=0., rough=.5, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True; setp(m, Base_Color=col, Metallic=metal, Roughness=rough, **kw); return m
def node(m, kind, **props):
    n = m.node_tree.nodes.new(kind)
    for k, v in props.items(): setattr(n, k, v)
    return n
def link(m, a, b): m.node_tree.links.new(a, b)

# Volcano Yellow: metallic-flake base under a glassy clear coat
P = M['PAINT']; setp(P, Base_Color=(.92, .42, .0), Metallic=.3, Roughness=.28, Coat_Weight=1., Coat_Roughness=.015, Coat_IOR=1.5)
fl = node(P, 'ShaderNodeTexNoise'); fl.inputs['Scale'].default_value = 2200.; fl.inputs['Detail'].default_value = 1.
bu = node(P, 'ShaderNodeBump'); bu.inputs['Strength'].default_value = .035
link(P, fl.outputs['Fac'], bu.inputs['Height']); link(P, bu.outputs['Normal'], bsdf(P).inputs['Normal'])

# carbon: 2x2 twill from two crossed wave bands picked by a checker, under clear coat
C = M['CARBON']; setp(C, Metallic=.1, Roughness=.4, Coat_Weight=.6, Coat_Roughness=.05)
tc = node(C, 'ShaderNodeTexCoord'); mp = node(C, 'ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 1)
link(C, tc.outputs['Object'], mp.inputs['Vector'])
ck = node(C, 'ShaderNodeTexChecker'); ck.inputs['Scale'].default_value = 140.
wa = node(C, 'ShaderNodeTexWave'); wa.bands_direction = 'X'; wa.inputs['Scale'].default_value = 560.; wa.inputs['Distortion'].default_value = 0.
wb = node(C, 'ShaderNodeTexWave'); wb.bands_direction = 'Y'; wb.inputs['Scale'].default_value = 560.; wb.inputs['Distortion'].default_value = 0.
for n in (ck, wa, wb): link(C, mp.outputs['Vector'], n.inputs['Vector'])
mx = node(C, 'ShaderNodeMix'); mx.data_type = 'FLOAT'
link(C, ck.outputs['Fac'], mx.inputs[0]); link(C, wa.outputs['Fac'], mx.inputs[2]); link(C, wb.outputs['Fac'], mx.inputs[3])
cr = node(C, 'ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (.0025, .0028, .0033, 1); cr.color_ramp.elements[1].color = (.022, .023, .027, 1)
link(C, mx.outputs[0], cr.inputs['Fac']); link(C, cr.outputs['Color'], bsdf(C).inputs['Base Color'])

setp(M['GLASS'], Base_Color=(.16, .18, .2), Metallic=0., Roughness=0., Transmission_Weight=1., IOR=1.45)
setp(M['LENS'], Base_Color=(1., 1., 1.), Roughness=.0, Transmission_Weight=1., Alpha=1.)
setp(M['HEAD'], Emission_Strength=28.); setp(M['TAIL'], Emission_Strength=22.)
setp(M['GLOSSBLACK'], Metallic=0., Roughness=.06, Coat_Weight=1.)
setp(M['CHROME'], Base_Color=(.62, .56, .5), Metallic=1., Roughness=.22)   # titanium exhaust
TYRE = newmat('TYRE', (.004, .004, .0045), 0., .7)
RIM = newmat('RIM', (.012, .012, .013), .7, .34, Coat_Weight=.5, Coat_Roughness=.1)
LIP = newmat('RIMLIP', (.55, .56, .58), 1., .18)
DISC = newmat('DISC', (.09, .09, .095), .3, .55)
CAL = newmat('CALIPER', (.9, .38, .0), 0., .2, Coat_Weight=1., Coat_Roughness=.03)
HAT = newmat('HAT', (.45, .45, .47), 1., .35)
SEAT = newmat('ALCANTARA', (.012, .012, .013), 0., .95)
STITCH = newmat('STITCH', (.92, .42, .0), 0., .6)
INTER = newmat('INTERIOR', (.01, .01, .011), 0., .7)

# ---------------------------------------------------------------- mesh helpers
def mesh(name, verts, faces, m, smooth=True, crease=None):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.materials.append(m)
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    if smooth:
        me.shade_smooth()
        if crease: sharpen(ob, crease)
    return ob

def lathe(prof, seg=96, t0=0., t1=2 * math.pi, closed=True):
    """profile [(r, a)] revolved about the wheel axle; returns wheel-local (a, r cos t, r sin t) verts + faces"""
    full = abs((t1 - t0) - 2 * math.pi) < 1e-6; S = seg if full else seg + 1; n = len(prof); V = []; F = []
    for k in range(S):
        t = t0 + (t1 - t0) * k / seg
        V += [(a, r * math.cos(t), r * math.sin(t)) for r, a in prof]
    for k in range(seg):
        k2 = (k + 1) % S
        for j in range(n if closed else n - 1):
            j2 = (j + 1) % n; F.append((k * n + j, k * n + j2, k2 * n + j2, k2 * n + j))
    if not full and closed:
        F.append(tuple(range(n))); F.append(tuple(range((S - 1) * n + n - 1, (S - 1) * n - 1, -1)))
    return V, F

def place(V, sx, centre):  # wheel-local -> blender; axle along blender X, +a points outboard
    return [Vector((centre.x + sx * a, centre.y + y, centre.z + z)) for a, y, z in V]

# ---------------------------------------------------------------- wheels (positions from BODIES.p1: x = ±1.0, z = ±1.36, r = .36)
def tyre_profile():
    out = [(.268, .128), (.283, .143), (.31, .152), (.338, .151), (.352, .143), (.3585, .13), (.3605, .112)]
    tread = []
    for g in (.068, .024, -.024, -.068):
        tread += [(.3605, g + .007), (.351, g + .006), (.351, g - .006), (.3605, g - .007)]
    inb = [(r, -a) for r, a in reversed(out)]
    return out + tread + inb + [(.261, -.118), (.261, .118)]

def spokes(sx, c):
    V = []; F = []
    for p in range(5):
        phi = 2 * math.pi * p / 5 + math.pi / 2
        for side in (-1, 1):
            base = len(V); NS = 9
            for i in range(NS):
                u = i / (NS - 1); r = lerp(.068, .261, u)
                ang = phi + side * lerp(.06, .155, u ** .8)
                a = lerp(.062, .118, u ** 1.6)          # concave face: hub sits deeper than the rim
                w = lerp(.017, .011, u); t = lerp(.034, .022, u)
                for (dw, da) in ((-w, 0), (w, 0), (w * .8, -t), (-w * .8, -t)):
                    aa = ang + dw / r
                    V.append((a + da, r * math.cos(aa), r * math.sin(aa)))
            for i in range(NS - 1):
                for j in range(4):
                    a0 = base + 4 * i + j; a1 = base + 4 * i + (j + 1) % 4
                    F.append((a0, a1, a1 + 4, a0 + 4))
            F.append((base + 3, base + 2, base + 1, base)); L = base + 4 * (NS - 1); F.append((L, L + 1, L + 2, L + 3))
    return V, F

def wheel(tag, sx, zw, front):
    c = Vector((0, 0, 0)); parts = []   # built about the hub, then parented to an empty at the wheel centre
    V, F = lathe(tyre_profile(), 128); parts.append(mesh(f'tyre_{tag}', place(V, sx, c), F, TYRE, crease=40))
    V, F = lathe([(.251, -.128), (.259, -.13), (.261, .108), (.269, .122), (.276, .13), (.273, .136), (.261, .134), (.251, .118)], 128)
    parts.append(mesh(f'barrel_{tag}', place(V, sx, c), F, RIM, crease=50))
    V, F = lathe([(.2615, .1355), (.2745, .1365), (.2755, .1335), (.262, .1325)], 128); parts.append(mesh(f'lip_{tag}', place(V, sx, c), F, LIP))
    V, F = spokes(sx, c); parts.append(mesh(f'spokes_{tag}', place(V, sx, c), F, RIM, crease=55))
    V, F = lathe([(.001, .075), (.06, .075), (.072, .066), (.074, .03), (.001, .03)], 64); parts.append(mesh(f'hub_{tag}', place(V, sx, c), F, RIM, crease=50))
    V, F = lathe([(.001, .108), (.03, .108), (.036, .1), (.036, .072), (.001, .072)], 6); parts.append(mesh(f'nut_{tag}', place(V, sx, c), F, LIP, smooth=False))
    V, F = lathe([(.1, -.017), (.218, -.017), (.22, -.02), (.22, -.046), (.218, -.049), (.1, -.049)], 128); parts.append(mesh(f'disc_{tag}', place(V, sx, c), F, DISC, crease=50))
    V, F = lathe([(.001, .03), (.104, .03), (.104, -.03), (.096, -.03), (.096, .022), (.001, .022)], 64); parts.append(mesh(f'hat_{tag}', place(V, sx, c), F, HAT, crease=50))
    # drill holes: small dark plugs through the disc face
    V = []; F = []
    for ring, (rr, cnt) in enumerate(((.13, 26), (.16, 26), (.19, 26))):
        for k in range(cnt):
            t = 2 * math.pi * (k + ring / 3) / cnt; cy, cz = rr * math.cos(t), rr * math.sin(t); b = len(V)
            for a in (-.0155, -.0505):
                for q in range(8):
                    u = 2 * math.pi * q / 8; V.append((a, cy + .0055 * math.cos(u), cz + .0055 * math.sin(u)))
            F += [tuple(b + q for q in range(8)), tuple(b + 8 + q for q in reversed(range(8)))]
            F += [(b + q, b + (q + 1) % 8, b + 8 + (q + 1) % 8, b + 8 + q) for q in range(8)]
    parts.append(mesh(f'drill_{tag}', place(V, sx, c), F, M['GAP'], smooth=False))
    # caliper: a six-piston monobloc arc gripping the trailing top of the disc
    tc = math.radians(48 if front else 132)
    V, F = lathe([(.165, -.066), (.236, -.066), (.246, -.056), (.246, -.002), (.236, .01), (.165, .01), (.159, -.028)], 24, tc - .5, tc + .5)
    parts.append(mesh(f'caliper_{tag}', place(V, sx, c), F, CAL, crease=45))
    root = bpy.data.objects.new(f'Wheel_{tag}', None); scene.collection.objects.link(root); root.location = G(sx * 1.0, .36, zw)
    root.empty_display_size = .4
    for p in parts: p.parent = root
    return root, parts

wheels = {}
for sx, sn in ((1, 'R'), (-1, 'L')):
    for zw, fn in ((1.36, 'F'), (-1.36, 'R')):
        wheels[fn + sn] = wheel(fn + sn, sx, zw, zw > 0)

# ---------------------------------------------------------------- cabin: black tub under the glass, seats, dash, wheel
body.data.materials.append(INTER); ii = len(body.data.materials) - 1
for p in body.data.polygons:
    cc = p.center; x, y, z = cc.x, cc.z, -cc.y
    if -1.22 < z < 1.0 and abs(x) < kf(CW, z) * .985 and p.normal.z > .25 and y > .55:
        p.material_index = ii

def deck(z): return kf(YD, z)
for sd in (1, -1):
    x0 = sd * .25
    # seat shell: reclined back + cushion in one side profile, with raised bolsters
    prof = [(-.62, deck(-.62) + .02), (-.08, deck(-.08) + .02), (.18, deck(.18) + .06), (.18, deck(.18) + .1), (-.38, deck(-.38) + .1),
            (-.5, .95), (-.58, 1.0), (-.68, .98), (-.7, .94)]
    extrude_x(f'seat{sd}', prof, x0 - .16, x0 + .16, 'GAP', bevel=.03).data.materials[0] = SEAT
    for bx in (-.16, .16):
        bol = [(-.6, deck(-.6) + .05), (-.1, deck(-.1) + .07), (.16, deck(.16) + .13), (-.42, deck(-.42) + .2), (-.55, .94), (-.66, .95)]
        o = extrude_x(f'bolster{sd}{bx}', bol, x0 + bx - .035, x0 + bx + .035, 'GAP', bevel=.02); o.data.materials[0] = SEAT
    tube(f'stitch{sd}', [(x0, deck(-.36) + .105, -.36), (x0, .94, -.5), (x0, .985, -.58)], .004, 'TAIL', res=6).data.materials[0] = STITCH
dash = [(.42, .79), (.55, .85), (.72, .8), (.74, .74), (.42, .73)]
extrude_x('Dash', dash, -.4, .4, 'GAP', bevel=.02).data.materials[0] = INTER
box('Tunnel', (.16, .1, .78), (0, deck(.1) + .05, .1), 'CARBON', bevel=.015)
# steering wheel (left-hand drive): flat-bottomed race rim facing the driver, tilted back at the top
swc = Vector((-.25, .86, .38)); tb = math.radians(22)
X = Vector((1, 0, 0)); U = Vector((0, math.cos(tb), math.sin(tb))); N = Vector((0, math.sin(tb), -math.cos(tb)))
def swp(lx, ly, lz=0.): return swc + lx * X + ly * U + lz * N
V = []; F = []; segs = 56; rs = 10
for i in range(segs):
    t = 2 * math.pi * i / segs; R0 = .15
    for j in range(rs):
        u = 2 * math.pi * j / rs; rr = R0 + .016 * math.cos(u)
        lx, ly = rr * math.cos(t), max(rr * math.sin(t), -.125 + .016 * math.cos(u))
        V.append(G(*swp(lx, ly, .016 * math.sin(u))))
for i in range(segs):
    for j in range(rs):
        a = i * rs + j; b = i * rs + (j + 1) % rs; c2 = ((i + 1) % segs) * rs + (j + 1) % rs; d = ((i + 1) % segs) * rs + j
        F.append((a, b, c2, d))
mesh('SteeringWheel', V, F, SEAT)
for k, t in enumerate((0, math.pi, -math.pi / 2)):
    tube(f'swspoke{k}', [tuple(swp(0, 0)), tuple(swp(.08 * math.cos(t), .08 * math.sin(t) * (1.5 if t < 0 else 1), .01)), tuple(swp(.155 * math.cos(t), max(.155 * math.sin(t), -.12)))], .012, 'CARBON', res=3)
tube('Column', [tuple(swp(0, 0, .03)), tuple(swc + Vector((0, -.08, .22))), (swc.x, .8, .66)], .024, 'CARBON', res=4)

# ---------------------------------------------------------------- panel shut lines
def on_side(pts_yz, sd):
    out = []
    for y, z in pts_yz:
        x = surf_side(y, z, sd)
        if x: out.append((sd * (x + .0006), y, z))
    return out
def on_top(pts_xz):
    out = []
    for x, z in pts_xz:
        y = surf_y(x, z)
        if y: out.append((x, y + .0006, z))
    return out
for sd in (1, -1):
    tube(f'shut_door{sd}', on_side([(.8, .92), (.74, .935), (.68, .93), (.66, .925)], sd), .0028, 'GAP', res=6)
    tube(f'shut_hood{sd}', on_top([(sd * .6, 1.02), (sd * .64, 1.3), (sd * .66, 1.6), (sd * .6, 1.92)]), .0028, 'GAP', res=8)
    tube(f'shut_eng{sd}', on_top([(sd * .62, -.98), (sd * .66, -1.3), (sd * .66, -1.7), (sd * .6, -2.1)]), .0028, 'GAP', res=8)
tube('shut_hoodx', on_top([(x, 1.02) for x in (-.6, -.3, 0, .3, .6)]), .0028, 'GAP', res=8)
tube('shut_engx', on_top([(x, -.98) for x in (-.62, -.3, 0, .3, .62)]), .0028, 'GAP', res=8)
# single wiper resting at the base of the windscreen
tube('Wiper', [(-.42, kf(CH, .9) + .012, .9), (0, kf(CH, .93) + .016, .93), (.3, kf(CH, .95) + .012, .95)], .006, 'GLOSSBLACK', res=4)

# ---------------------------------------------------------------- organise
car = bpy.data.collections.new('Volcano P1 hero'); scene.collection.children.link(car)
for o in list(scene.collection.objects):
    scene.collection.objects.unlink(o); car.objects.link(o)
studio = bpy.data.collections.new('Studio'); scene.collection.children.link(studio)
def add(o): studio.objects.link(o); return o

# ---------------------------------------------------------------- studio + cameras
world = bpy.data.worlds.new('Studio'); scene.world = world; world.use_nodes = True
bg = world.node_tree.nodes['Background']
def area(name, loc, target, energy, size, size_y=None, col=(1, 1, 1)):
    L = bpy.data.lights.new(name, 'AREA'); L.energy = energy; L.color = col
    if size_y: L.shape = 'RECTANGLE'; L.size = size; L.size_y = size_y
    else: L.size = size
    o = add(bpy.data.objects.new(name, L)); o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o

# cyclorama: floor that sweeps up into a back wall
V = []; F = []; W = 30; nr = 24
prof = [(-14, 0)] + [(6 + 5 * math.sin(math.pi / 2 * k / nr), 5 - 5 * math.cos(math.pi / 2 * k / nr)) for k in range(nr + 1)] + [(11, 14)]
for i, (u, h) in enumerate(prof):
    V += [(-W / 2, u, h), (W / 2, u, h)]
for i in range(len(prof) - 1): F.append((2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2))
me = bpy.data.meshes.new('Cyc'); me.from_pydata(V, [], F); me.shade_smooth(); cyc = add(bpy.data.objects.new('Cyc', me))
if LOOK == 'night':
    bg.inputs['Color'].default_value = (.004, .005, .007, 1); bg.inputs['Strength'].default_value = 1.
    FLOOR = newmat('FLOOR', (.012, .012, .014), 0., .12)
    area('key_warm', (4.5, 4.5, 3.2), (0, 0, .5), 2600, 3.5, col=(1., .72, .45))
    area('rim_orange', (-5, -5, 2.6), (0, 0, .6), 2400, 3, col=(1., .45, .15))
    area('fill_blue', (-5, 4, 1.5), (0, 0, .5), 260, 5, col=(.55, .7, 1.))
    area('top_strip', (0, 0, 5.5), (0, 0, 0), 900, 7, 1.2, col=(.9, .93, 1.))
else:
    bg.inputs['Color'].default_value = (.32, .33, .35, 1); bg.inputs['Strength'].default_value = .22
    FLOOR = newmat('FLOOR', (.16, .165, .175), 0., .28)
    area('softbox_top', (0, 0, 5.2), (0, 0, 0), 2600, 7., 3.2)
    area('strip_R', (4.8, 0, 2.4), (0, 0, .7), 1400, 8., .6)
    area('strip_L', (-4.8, 0, 2.4), (0, 0, .7), 1400, 8., .6)
    area('rim_back', (0, 7, 2.0), (0, 0, .6), 900, 6., 2.)
    area('fill_front', (0, -8, 1.6), (0, 0, .6), 500, 6., 2.)
cyc.data.materials.append(FLOOR)

AIM = G(0, .52, 0)
CAMS = {   # name: (position, lens, aim)
    'front34': (G(-5.3, 1.25, 6.2), 50, AIM),
    'side':    (G(9.2, .78, .05), 50, AIM),
    'rear34':  (G(5.4, 1.5, -6.1), 50, AIM),
    'headon':  (G(0, .72, 8.6), 55, G(0, .5, 0)),
    'top':     (G(4.6, 5.4, 3.6), 45, AIM),
    'wheel':   (G(-2.35, .58, 2.75), 50, G(-1.0, .38, 1.4)),
}
cams = {}
for k, (pos, lens, aim) in CAMS.items():
    cd = bpy.data.cameras.new(f'Cam_{k}'); cd.lens = lens; cd.dof.use_dof = k == 'wheel'
    if k == 'wheel': cd.dof.focus_distance = (pos - aim).length; cd.dof.aperture_fstop = 2.2
    o = add(bpy.data.objects.new(f'Cam_{k}', cd)); o.location = pos
    o.rotation_euler = (aim - pos).to_track_quat('-Z', 'Y').to_euler(); cams[k] = o
scene.camera = cams['front34']
# a touch of steering on the front wheels for the hero angle
for tag in ('FL', 'FR'): wheels[tag][0].rotation_euler = (0, 0, math.radians(-9))

scene.render.engine = 'CYCLES'; scene.cycles.samples = SAMPLES; scene.cycles.use_adaptive_sampling = True
scene.cycles.use_denoising = True; scene.cycles.max_bounces = 10; scene.cycles.transmission_bounces = 10; scene.cycles.glossy_bounces = 6
scene.render.resolution_x, scene.render.resolution_y = RES
vt = [v.identifier for v in scene.view_settings.bl_rna.properties['view_transform'].enum_items]
scene.view_settings.view_transform = 'AgX' if 'AgX' in vt else 'Filmic'
try: scene.view_settings.look = 'AgX - Medium High Contrast' if LOOK == 'studio' else 'AgX - Punchy'
except TypeError: pass
scene.view_settings.exposure = -.2 if LOOK == 'studio' else 0.

tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in car.objects if o.type == 'MESH')
print('hero objects', len(car.objects), 'tris', tris)
bpy.ops.wm.save_as_mainfile(filepath=BLEND)
print('saved', BLEND)
if RENDER:
    for v in VIEWS:
        scene.camera = cams[v]; scene.render.filepath = f'{RENDER}_{v}.png'
        bpy.ops.render.render(write_still=True); print('rendered', v)
