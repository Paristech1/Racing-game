"""AFTERHOURS — HELLBOUND 717 (v3 hero build), on carlib.py, from Paris's locked Midjourney set
(~/Projects/afterhours_refs/hellbound: side, front34, rear34; anchor job 234319bb, seed 717). A late-60s widebody muscle
coupe: long flat hood with a blower and three red velocity stacks punched through it, a full-width black grille holding
round headlamps, fog lamps low in the bumper, a crisp beltline crease that kicks up over the rear hips, bolt-on riveted
flares, a notchback roof with sail C-pillars, a ducktail spoiler, twin black stripes nose to tail, deep candy red.
Wheels (BODIES.muscle, built in the game): x +-1.04, z +-1.52, r .39.
Headless: python3 build_car.py hellbound_717 ../../models/hellbound_717.glb [--shots DIR]."""
car = Car('Hellbound 717', paint=(.2, .008, .015), accent=(1, .25, .1))
pb = car.M['PAINT'].node_tree.nodes['Principled BSDF']; pb.inputs['Metallic'].default_value = .7; pb.inputs['Roughness'].default_value = .16

def mk(name, col, metal=0., rough=.5, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)
car.M['GRILLE'] = mk('GRILLE', (.012, .013, .015), .3, .5)
car.M['STACK'] = mk('STACK', (.5, .02, .02), .8, .25)          # the red-anodised velocity stacks
car.M['LENS'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.06, .004, .006, 1)

# ---------------------------------------------------------------- body
# Traced off the locked side view, wheels scaled to the game's .39 m: long hood flat at ~.83, a beltline crease that runs
# dead level down the doors then kicks up over the rear wheel into the hips, a short deck at ~.86 ending in a ducktail.
# Plan: a 1.9 m body with bolt-on flares that bulge out to 1.13 over each axle; the shoulder tumbles in over them.
Z0, Z1, WB, WR = -2.46, 2.5, 1.52, .39; TRACK = 1.04
FL = lambda z: math.exp(-((z - WB) / .58) ** 4) + math.exp(-((z + WB) / .6) ** 4)
HW = [[-2.46, .9], [-2.38, .98], [-2.15, 1.06], [-1.52, 1.12], [-.95, 1.02], [-.6, .95], [0, .94], [.6, .95], [.95, 1.01], [1.52, 1.11],
      [2.05, 1.06], [2.35, .99], [2.5, .9]]
YB = [[-2.46, .4], [-2.38, .26], [-2.15, .18], [2.15, .17], [2.4, .2], [2.5, .3]]
YT = [[-2.46, .86], [-2.42, .93], [-2.3, .94], [-1.9, .93], [-1.4, .92], [-.8, .89], [0, .875], [.6, .87], [1.0, .86], [1.6, .845],
      [2.1, .825], [2.38, .8], [2.5, .74]]
YS = [[-2.46, .8], [-2.4, .87], [-2.25, .88], [-1.9, .875], [-1.5, .86], [-1.0, .82], [-.6, .8], [0, .8], [.6, .8], [1.0, .8], [1.6, .79],
      [2.1, .775], [2.38, .75], [2.5, .69]]
def dome(x, z):
    """hood: a broad low power bulge down the middle that the blower breaks through; flat deck"""
    hz = smooth(.75, 1.05, z) * (1 - smooth(2.05, 2.35, z)); return .03 * hz * math.exp(-(x / .36) ** 4)
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .08, 'NS': 230, 'res': 2,
    'Rx': .07, 'tumble': lambda z: .06 + .11 * FL(z), 'bulge_at': .5, 'round_nose': .1, 'round_tail': .1, 'dome': dome,
    'feature': lambda z: .014 * smooth(-2.4, -2.2, z) * (1 - smooth(2.3, 2.45, z)),      # the crisp beltline crease
    'lean': lambda y, z: .07 * smooth(2.25, 2.5, z) * (car.h_of(y, z) - .5) - .04 * smooth(-2.3, -2.46, z) * (car.h_of(y, z) - .5)})
SKIN0 = bpy.data.objects.new('Skin0', car.body.data.copy()); car.scene.collection.objects.link(SKIN0)
def skin_normals():
    me = car.body.data; vg = car.body.vertex_groups.get('skin') or car.body.vertex_groups.new(name='skin'); keep = set()
    for p_ in me.polygons:
        if me.materials[p_.material_index].name.split('.')[0] == 'PAINT': keep.update(p_.vertices)
    vg.add(list(keep), 1., 'REPLACE')
    mod = car.body.modifiers.new('skinN', 'DATA_TRANSFER'); mod.object = SKIN0; mod.use_loop_data = True
    mod.data_types_loops = {'CUSTOM_NORMAL'}; mod.loop_mapping = 'POLYINTERP_NEAREST'; mod.vertex_group = 'skin'
    nm = bpy.data.meshes.new_from_object(car.body.evaluated_get(car.DG())); car.body.modifiers.clear(); om = car.body.data; car.body.data = nm; bpy.data.meshes.remove(om)
    car.body.vertex_groups.clear()
BV0 = car.BV()
def FZ(x, y):
    h = BV0.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else 2.4
def BZ(x, y):
    h = BV0.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else -2.4
def SX(y, z, sd=1):
    h = BV0.ray_cast(G(sd * 2.5, y, z), Vector((-sd, 0, 0))); return abs(h[0].x) if h[0] else None
def TY(x, z):
    h = BV0.ray_cast(G(x, 3, z), Vector((0, 0, -1))); return h[0].z if h[0] else None
def resample(poly, per=10):
    out = []
    for i in range(len(poly)):
        (ax, ay), (bx, by) = poly[i], poly[(i + 1) % len(poly)]
        for k in range(per): out.append((lerp(ax, bx, k / per), lerp(ay, by, k / per)))
    return out
def pocket(name, poly, depth, m='GLOSSBLACK', back=False, per=10):
    pts = resample(poly, per) if per > 1 else list(poly); n = len(pts); S = BZ if back else FZ; sg = -1 if back else 1
    fr = [G(x, y, S(x, y) + sg * .25) for x, y in pts]; bk = [G(x, y, S(x, y) - sg * depth) for x, y in pts]
    cx = sum(p[0] for p in pts) / n; cy = sum(p[1] for p in pts) / n
    verts = fr + bk + [G(cx, cy, S(cx, cy) + sg * .25), G(cx, cy, S(cx, cy) - sg * depth)]
    faces = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [(2 * n, (i + 1) % n, i) for i in range(n)] + [(2 * n + 1, n + i, n + (i + 1) % n) for i in range(n)]
    ob = car.new_obj(name, verts, faces, m, False); car.fixn(ob); return car.cutter(ob, m)
def grid(name, P, nu, nv, m, flip=False):
    verts = [G(*P(i / nu, j / nv)) for i in range(nu + 1) for j in range(nv + 1)]; faces = []
    for i in range(nu):
        for j in range(nv):
            a = i * (nv + 1) + j; f = (a, a + nv + 1, a + nv + 2, a + 1); faces.append(tuple(reversed(f)) if flip else f)
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob); return ob
def bevel_obj(ob, off, seg=2, ang=.6):
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.bevel(bm, geom=[e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > ang], offset=off, segments=seg, affect='EDGES', profile=.5)
    bm.to_mesh(ob.data); bm.free(); ob.data.shade_smooth(); car.sharpen(ob, 40); return ob
def rbox(name, size, pos, m, rot=(0, 0, 0), r=.006): return bevel_obj(car.box(name, size, pos, m, rot), r, 2)
def ring_disc(name, c, r_out, r_in, axis_z, m, seg=40, depth=.01):   # a flat annulus facing +z (front) or -z (back)
    x0, y0, z0 = c; verts = []; faces = []; sg = 1 if axis_z > 0 else -1
    for k in range(seg):
        a = 2 * math.pi * k / seg; ca, sa = math.cos(a), math.sin(a)
        verts += [G(x0 + r_out * ca, y0 + r_out * sa, z0), G(x0 + r_in * ca, y0 + r_in * sa, z0), G(x0 + r_out * ca, y0 + r_out * sa, z0 - sg * depth)]
    for k in range(seg):
        a, b = 3 * k, 3 * ((k + 1) % seg)
        faces += [(a, b, b + 1, a + 1) if sg > 0 else (a, a + 1, b + 1, b), (a + 2, b + 2, b, a) if sg > 0 else (a, b, b + 2, a + 2)]
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob); return ob

# ---- arches, front: the full-width grille pocket with the lamps in it, bumper fog lamps; tail: lamp panel, plate box
ARCH_R = .46
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .7, sd * 1.5)
GRILLE = Car.rounded(0, .6, 1.62, .2, .03, 5)
pocket('grille', GRILLE, .1, per=6)
for sd in (1, -1): pocket(f'fog{sd}', Car.rounded(sd * .62, .36, .14, .1, .045, 5), .04, per=3)
pocket('lowmouth', Car.rounded(0, .32, .8, .08, .03, 4), .07, per=4)
pocket('tailpanel', Car.rounded(0, .72, 1.6, .13, .02, 4), .03, back=True, per=8)
pocket('plate', Car.rounded(0, .5, .5, .13, .015), .04, back=True, per=3)
# ---- shut lines: long door, hood edges, deck lid, flare seams, a bumper line front and rear
for sd in (1, -1):
    for z0, ln, top in ((.62, -.08, .82), (-.82, .02, .86)):
        pts = []
        for k in range(14):
            y = lerp(.22, top, k / 13); z = z0 + ln * (y - .22); x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        car.strip_cut(f'door{sd}{z0}', pts, .0032, .012)
    pts = []
    for k in range(18):
        z = lerp(.72, 2.4, k / 17); x = sd * lerp(.82, .78, (k / 17) ** 1.4); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0032, .012, axis='top')
    pts = []
    for k in range(9):
        z = lerp(-1.62, -2.36, k / 8); x = sd * .78; y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'deck{sd}', pts, .003, .012, axis='top')
    for zw in (WB, -WB):
        pts = []
        for k in range(17):
            a = math.radians(-6 + 192 * k / 16); y = WR + (ARCH_R + .12) * math.sin(a); z = zw + (ARCH_R + .12) * math.cos(a)
            if y < .2: continue
            x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        if len(pts) > 2: car.strip_cut(f'flareseam{sd}{zw}', pts, .0035, .011)
pts = [(x, (car.surf_y(x, -1.62) or .9), -1.62) for x in [lerp(-.78, .78, k / 16) for k in range(17)]]
car.strip_cut('deckF', pts, .003, .012, axis='across')
car.apply_cuts()
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: -1.0 < gz < 1.0 and gy < .24 and abs(n[0]) > .25)        # black rocker
car.sharpen(car.body, 50); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.68, x1=1.14)

# ---------------------------------------------------------------- cabin: upright screen, notchback roof, sail C-pillars
CH = [[-1.62, .9], [-1.5, .99], [-1.32, 1.1], [-1.1, 1.19], [-.88, 1.235], [-.6, 1.255], [-.25, 1.26], [.05, 1.25], [.2, 1.23],
      [.36, 1.15], [.52, 1.03], [.66, .92]]
car.build_cabin({'CZ0': -1.62, 'CZ1': .66, 'NC': 150, 'CH': CH, 'dlo': (.62, .46, -1.22, -.92), 'rear_glass': -.95, 'dlo_trim': 'CHROME',
    'pillars': [(-.84, -.8)], 'apillar_r': .013,
    'cw': lambda z: .8 - .1 * smooth(-1.1, -1.62, z) - .06 * smooth(.35, .66, z),
    'rw': lambda z: .62 - .08 * smooth(-1.0, -1.62, z) - .07 * smooth(.1, .66, z)})

# ---------------------------------------------------------------- nose: grille mesh, round lamps, bezels, bumper, fogs, splitter
GZ = FZ(0, .6) - .07
grid('gfloor', lambda u, v: (lerp(-.8, .8, u), lerp(.5, .7, v), FZ(0, .6) - .095), 32, 4, 'GAP')   # black void behind the crate
for k in range(7):   # egg-crate: deep horizontal vanes and verticals, a heavier centre divider
    y = .515 + k * .028; car.box(f'gbar{k}', (1.54, .007 if k != 3 else .016, .06), (0, y, GZ - .01), 'GRILLE')
for k in range(27):
    x = -.75 + k * (1.5 / 26)
    if abs(abs(x) - .66) < .09: continue                      # leave the lamp bowls clear
    car.box(f'gvert{k}', (.007, .18, .06), (x, .6, GZ - .005), 'GRILLE')
car.tube('gsurround', [(x, y, FZ(x, y) - .006) for x, y in resample(GRILLE, 4)] + [((lambda x, y: (x, y, FZ(x, y) - .006))(*GRILLE[0]))], .007, 'CHROME', res=3)
for sd in (1, -1):
    x, y = sd * .66, .6; zf = FZ(x, y) - .05
    ring_disc(f'hbez{sd}', (x, y, zf + .015), .085, .068, 1, 'CHROME', 48, .02)
    car.cyl(f'hbowl{sd}', (x, y, zf - .02), (x, y, zf + .012), .07, 'CHROME', r1=.068, seg=48, cap=False)
    car.sphere(f'hlamp{sd}', (x, y, zf + .004), .066, 'HEAD', scale=(1, 1, .25), seg=32)
    car.sphere(f'hlens{sd}', (x, y, zf + .012), .069, 'GLASS', scale=(1, 1, .35), seg=32)
    x, y = sd * .62, .36; zf = FZ(x, y) - .02
    car.cyl(f'fog{sd}', (x, y, zf - .02), (x, y, zf + .004), .038, 'HEAD', seg=32)
    ring_disc(f'fogbz{sd}', (x, y, zf + .008), .046, .036, 1, 'CHROME', 32, .01)
for k in range(3):
    y = .3 + k * .02; car.box(f'mbar{k}', (.76, .005, .02), (0, y, FZ(0, y) - .05), 'GRILLE')
# chrome bumper blade across the nose under the grille, wrapping the corners
car.tube('fbumper', [(x, .465, FZ(x, .465) + .012) for x in [lerp(-.92, .92, k / 30) for k in range(31)]], .022, 'CHROME', res=6)
SPL = [(-1.0, 2.15)] + [(math.sin(a) * 1.0, 2.36 + math.cos(a) * .18) for a in [(-math.pi / 2) + math.pi * k / 48 for k in range(49)]] + [(1.0, 2.15)]
bevel_obj(car.extrude_y('Splitter', SPL, .11, .128, 'CARBON'), .004)
for x in (-.5, .5): car.cyl(f'sstrut{x}', (x, .128, 2.42), (x, .26, 2.36), .008, 'GLOSSBLACK', seg=8)

# ---------------------------------------------------------------- blower: case, pulley snout, three red stacks, scoop surround
BZc = 1.4; hy = (TY(0, BZc) or .86)
car.box('blowercut', (.5, .04, .66), (0, hy + .005, BZc), 'GLOSSBLACK')
rbox('manifold', (.44, .07, .58), (0, hy + .05, BZc), 'SATIN', r=.012)
rbox('blower', (.38, .17, .5), (0, hy + .17, BZc), 'SATIN', r=.03)
for k in range(9): rbox(f'rib{k}', (.4, .16, .012), (0, hy + .17, BZc - .2 + k * .05), 'CHROME', r=.004)
car.cyl('pulley', (0, hy + .14, BZc + .25), (0, hy + .14, BZc + .33), .075, 'CHROME', seg=40)
car.cyl('pulley2', (0, hy + .05, BZc + .3), (0, hy + .05, BZc + .36), .05, 'GLOSSBLACK', seg=32)
car.tube('belt', [(0, hy + .215, BZc + .29), (0, hy + .11, BZc + .37), (0, hy + .02, BZc + .33), (0, hy + .06, BZc + .27), (0, hy + .215, BZc + .29)], .012, 'GLOSSBLACK', res=6)
rbox('hat', (.36, .05, .42), (0, hy + .28, BZc), 'CHROME', r=.015)
for i, x in enumerate((-.12, 0, .12)):
    z = BZc + .06
    car.cyl(f'stack{i}', (x, hy + .3, z), (x, hy + .38, z), .042, 'STACK', r1=.05, seg=40, cap=False)
    car.cyl(f'stackLip{i}', (x, hy + .38, z), (x, hy + .395, z), .05, 'STACK', r1=.062, seg=40, cap=False)   # bell mouth
    car.cyl(f'stackIn{i}', (x, hy + .37, z), (x, hy + .375, z), .04, 'GAP', seg=24)
for k in range(2): car.cyl(f'filter{k}', (-.15 + k * .3, hy + .3, BZc - .15), (-.15 + k * .3, hy + .38, BZc - .15), .06, 'GRILLE', seg=24)

# ---------------------------------------------------------------- flanks: rivets, skirts, side pipes, mirrors, handles, badge
for sd in (1, -1):
    for zw in (WB, -WB):
        for k in range(17):
            a = math.radians(-4 + 188 * k / 16); y = WR + (ARCH_R + .075) * math.sin(a); z = zw + (ARCH_R + .075) * math.cos(a)
            if y < .2: continue
            x = SX(y, z, sd)
            if x: car.sphere(f'rivet{sd}{zw}{k}', (sd * (x + .001), y, z), .012, 'CHROME', scale=(.5, 1, 1), seg=10)
    sill = []
    for i in range(41):
        zz = lerp(-.95, .95, i / 40); x = car.surf_side(.24, zz, sd) or .94
        sill.append([G(sd * (x - .06), .13, zz), G(sd * (x + .04), .13, zz), G(sd * (x + .045), .16, zz), G(sd * (x - .06), .2, zz)])
    car.loft(f'Skirt{sd}', sill, 'CARBON', smooth_=False)
    # side exhaust: a chrome pipe running under the door, exiting ahead of the rear wheel
    x = (car.surf_side(.2, 0, sd) or .94) + .05
    car.cyl(f'sidepipe{sd}', (sd * x, .16, .6), (sd * x, .16, -.92), .04, 'CHROME', seg=32, cap=False)
    car.cyl(f'sidepipeC{sd}', (sd * x, .16, -.9), (sd * x, .16, -.905), .034, 'GAP', seg=24)
    z = -.3; y = kf(YS, z) - .07; x = car.surf_side(y, z, sd)
    if x: rbox(f'handle{sd}', (.012, .022, .14), (sd * (x + .003), y, z), 'CHROME', r=.004)
    mz = .5; my = car.belt(mz) + .03; mx = car.C['cw'](mz)
    car.cyl(f'mstalk{sd}', (sd * (mx - .01), my - .02, mz), (sd * (mx + .07), my + .02, mz - .02), .012, 'CHROME', seg=12)
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=28, v_segments=14, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .09, v.co.z * .045, v.co.y * .06
        if gz < 0: gz *= .25
        v.co = G(sd * (mx + .1) + gx, my + .04 + gy, mz - .04 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(car.M['CHROME']); me.shade_smooth(); car.link(bpy.data.objects.new(f'mcap{sd}', me))

# ---------------------------------------------------------------- twin black stripes nose to tail over body + cabin
BOTH = car.BV([car.body, car.cabin])
for i, (xa, xb) in enumerate(((-.3, -.17), (.17, .3))):
    def fn(u, z, xa=xa, xb=xb):
        x = lerp(xa, xb, u); y = car.surf_y(x, z, BOTH); return x, (y if y is not None else .9) + .006
    for j, (z0, z1, nz) in enumerate(((-2.42, -1.64, 50), (-.93, .2, 70), (.68, 2.46, 110))):   # deck, roof, hood: not over the glass
        sob = car.band(f'stripe{i}{j}', fn, z0, z1, nz, 3, 'STRIPE')
        if sob.data.polygons[len(sob.data.polygons) // 2].normal.z < 0:   # face up, or the game culls it
            for p_ in sob.data.polygons: p_.flip()

# ---------------------------------------------------------------- tail: lamp panel, ducktail, bumper, quad pipes, valance
for sd in (1, -1):
    def tp(x, y, off=.008): return (x, y, BZ(x, y) - off)
    grid(f'tlens{sd}', lambda u, v, sd=sd: tp(sd * lerp(.06, .78, u), lerp(.665, .775, v), .004), 30, 4, 'LENS', flip=sd > 0)
    for x0, x1 in ((.12, .42), (.46, .76)):   # two lamp blocks per side split by a black bar
        for j, y in enumerate((.7, .74)):
            car.tube(f'tl{sd}{x0}{j}', [tp(sd * x, y, .012) for x in [lerp(x0, x1, k / 10) for k in range(11)]], .012, 'TAIL', res=4)
    car.box(f'tlbar{sd}', (.025, .12, .01), (sd * .44, .72, BZ(sd * .44, .72) - .012), 'GLOSSBLACK')
    car.box(f'rev{sd}', (.06, .03, .008), (sd * .09, .72, BZ(sd * .09, .72) - .013), 'HEAD')
car.tube('rbumper', [(x, .58, BZ(x, .58) - .012) for x in [lerp(-.92, .92, k / 30) for k in range(31)]], .02, 'CHROME', res=6)
grid('valance', lambda u, v: (lambda x, y: (x, y, BZ(x, y) - .005))(lerp(-.8, .8, u), lerp(.2, .36, v)), 60, 6, 'GLOSSBLACK', flip=True)
for sd in (1, -1):
    for x in (.36, .5):
        y = .27; zt = BZ(sd * x, y); zo = zt - .04
        car.cyl(f'exh{sd}{x}', (sd * x, y, zt + .1), (sd * x, y, zo), .046, 'CHROME', seg=40, cap=False)
        car.cyl(f'exhR{sd}{x}', (sd * x, y, zo + .01), (sd * x, y, zo), .05, 'CHROME', r1=.047, seg=40, cap=False)
        car.cyl(f'exhC{sd}{x}', (sd * x, y, zo + .04), (sd * x, y, zo + .035), .041, 'GAP', seg=24)
# ducktail: a kicked-up lip along the deck's trailing edge, rolled into the corners
DT = []
for i in range(41):
    x = lerp(-.88, .88, i / 40); y0 = car.surf_y(x * .99, -2.4) or .92; up = .06 * (1 - .4 * (abs(x) / .88) ** 3)
    DT.append([G(x, y0 - .005, -2.28), G(x, y0 + up * .4, -2.36), G(x, y0 + up, -2.47), G(x, y0 + up - .015, -2.475), G(x, y0 - .02, -2.42)])
car.loft('Ducktail', DT, 'PAINT')

# ---------------------------------------------------------------- inside
cab = car.cabin; me = cab.data
bm = bmesh.new(); bm.from_mesh(me)
gl = [f for f in bm.faces if f.material_index == 1]; bmesh.ops.delete(bm, geom=gl, context='FACES')
for v in bm.verts:
    c = Vector((0, v.co.y, .95)); v.co = c + (v.co - c) * .965
bmesh.ops.reverse_faces(bm, faces=bm.faces)
for f in bm.faces: f.material_index = 0
lin = bpy.data.meshes.new('Liner'); bm.to_mesh(lin); bm.free(); lin.materials.append(car.M['INTERIOR'])
car.link(bpy.data.objects.new('Liner', lin))
for sd in (1, -1):
    x = sd * .38
    rbox(f'seatback{sd}', (.44, .58, .1), (x, .82, -.5), 'INTERIOR', rot=(-.2, 0, 0), r=.025)
    rbox(f'cushion{sd}', (.42, .09, .44), (x, .5, -.22), 'INTERIOR', r=.025)
rbox('dash', (1.56, .14, .34), (0, .76, .42), 'INTERIOR', rot=(.15, 0, 0), r=.025)
sw = [(.38 + .17 * math.cos(2 * math.pi * k / 32), .82 + .17 * math.sin(2 * math.pi * k / 32) * .9, .2 + .17 * math.sin(2 * math.pi * k / 32) * .42) for k in range(33)]
car.tube('steer', sw, .015, 'INTERIOR', res=4)
car.extrude_y('Floor', [(-.92, -2.2), (.92, -2.2), (.92, 2.2), (-.92, 2.2)], .14, .16, 'GLOSSBLACK')

skin_normals(); bpy.data.objects.remove(SKIN0)
objs = car.objs(); result = car.stats(); print(result)
print('stations: head z %.3f  grille z %.3f  tail z %.3f  plate z %.3f  blower y %.3f' % (FZ(.66, .6), FZ(0, .6), BZ(.4, .72), BZ(0, .5), hy))
