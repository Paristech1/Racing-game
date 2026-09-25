"""AFTERHOURS — HELLBOUND 717 (v2), built in Blender on carlib.py from a ChatGPT concept sheet (docs: tools/blender/README.md).
A widebody supercharged muscle coupe: long hood with a centre power bulge and a blower with six velocity stacks through it,
a shark nose with slim slot headlamps over a big black grille and a strutted splitter, bolt-on riveted flares, quad side
exits ahead of the rear wheels, a short fastback cabin, ducktail, recessed full-width tail bar, twin black stripes.
Wheels (BODIES.muscle): x +-1.04, z +-1.52, r .39. Live (MCP): exec carlib.py, then this file in the same namespace."""
car = Car('Hellbound 717', paint=(.32, .01, .02), accent=(1, .25, .1))
Z0, Z1, WB, WR = -2.46, 2.5, 1.52, .39
HW = [[-2.46, .9], [-2.32, 1.0], [-2.08, 1.1], [-1.52, 1.17], [-1.02, 1.1], [-.7, 1.0], [.2, .99], [.62, 1.02], [1.0, 1.12], [1.52, 1.16], [2.02, 1.08], [2.3, .98], [2.5, .86]]
HWB = [[-2.46, .9], [-2.0, .98], [-1.0, .98], [0, .97], [1.0, .98], [2.0, .96], [2.5, .86]]      # the body under the flares
YB = [[-2.46, .4], [-2.3, .24], [-2.0, .17], [2.1, .16], [2.36, .19], [2.5, .26]]
YS = [[-2.46, .8], [-2.2, .84], [-1.52, .87], [-.8, .8], [.4, .79], [1.52, .85], [2.1, .8], [2.4, .72], [2.5, .62]]
YT = [[-2.46, .86], [-2.38, .97], [-2.2, .975], [-1.7, .96], [-1.0, .95], [0, .94], [.6, .93], [1.2, .92], [1.8, .9], [2.2, .86], [2.42, .8], [2.5, .72]]
BLOWER_Z = 1.32
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .1, 'Rx': .12, 'bulge_at': .56, 'round_nose': .12, 'round_tail': .14,
    'dome': lambda x, z: .055 * smooth(.55, .9, z) * (1 - smooth(2.0, 2.3, z)) * math.exp(-(x / .3) ** 2),
    'lean': lambda y, z: .11 * smooth(2.1, 2.5, z) * (car.h_of(y, z) - .5) - .05 * smooth(-2.2, -2.46, z) * (car.h_of(y, z) - .4)})
ARCH_R = .45
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .66, sd * 1.5)
# front: a big black grille under the shark nose, slot headlamps either side, brake ducts in the bumper corners
car.front_prism('grille', [(-.74, .26), (.74, .26), (.7, .5), (-.7, .5)], 2.2, 2.9)
for sd in (1, -1): car.front_prism(f'duct{sd}', [(sd * .8, .2), (sd * .96, .22), (sd * .95, .38), (sd * .82, .36)], 2.1, 2.9)
car.front_prism('diff', Car.rounded(0, .3, 1.5, .22, .04), -3.0, -2.3, 'GLOSSBLACK')
car.front_prism('plate', Car.rounded(0, .52, .52, .13, .02), -3.0, -2.44, 'GLOSSBLACK')
def lamp_pts(sd):
    pts = []
    for k in range(10):
        t = k / 9; x = sd * lerp(.52, .92, t); y = lerp(.625, .6, t)
        z = car.surf_front(x, y); pts.append((x, y, (z or 2.4) - .004))
    return pts
LAMPS = {sd: lamp_pts(sd) for sd in (1, -1)}
for sd in (1, -1): car.lamp_recess(f'lamp{sd}', LAMPS[sd], .022, .018, .06, .2)
# recessed tail panel, full width
TP = []
for k in range(19):
    x = lerp(-.84, .84, k / 18); z = car.surf_back(x, .76); TP.append((x, .76, (z or -2.4) + .004))
verts = []; faces = []
for (x, y, z) in TP: verts += [G(x, y - .075, z - .2), G(x, y + .075, z - .2), G(x, y + .075, z + .04), G(x, y - .075, z + .04)]
for i in range(len(TP) - 1):
    for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
L = 4 * (len(TP) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
ob = car.new_obj('tailcut', verts, faces, 'GLOSSBLACK', False); car.fixn(ob); car.cutter(ob, 'GLOSSBLACK')
for sd in (1, -1):   # long coupe door, hood shut lines
    for z0, ln, kink in ((.46, -.12, 0), (-.98, -.05, .04)):
        pts = []
        for k in range(12):
            y = lerp(.26, kf(YT, z0) - .03, k / 11); z = z0 + ln * (y - .26) + kink * math.sin(k / 11 * math.pi); x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        car.strip_cut(f'door{sd}{z0}', pts, .0035, .012)
    pts = []
    for k in range(14):
        z = lerp(.5, 2.3, k / 13); x = sd * lerp(.74, .66, (k / 13) ** 1.5); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0035, .012, axis='top')
    # bolt-on flare seams: the join where each flare meets the body, a thin gap arc just outside the arch
    for zw in (WB, -WB):
        pts = []
        for k in range(15):
            a = math.radians(-8 + 196 * k / 14); y = WR + (ARCH_R + .085) * math.sin(a); z = zw + (ARCH_R + .085) * math.cos(a)
            if y < .2: continue
            x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        if len(pts) > 2: car.strip_cut(f'flare{sd}{zw}', pts, .004, .01)
car.apply_cuts()
car.recolor('CARBON', lambda gx, gy, gz, n: gy < kf(YB, gz) + .08 and -1.05 < gz < 1.05)
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: (gz > 2.3 and gy < kf(YB, gz) + .06) or (gz < -2.3 and gy < .4 and gx < .84))
car.sharpen(car.body, 28); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, .62, 1.12)

# cabin: short and set back, fastback C-pillars, a quarter window behind the door
CH = [[-2.0, .97], [-1.6, 1.07], [-1.15, 1.2], [-.7, 1.27], [-.35, 1.29], [-.05, 1.27], [.15, 1.17], [.33, 1.03], [.5, .9]]
car.build_cabin({'CZ0': -2.0, 'CZ1': .5, 'CH': CH, 'dlo': (.44, .5, -1.55, -1.05), 'rear_glass': -1.5, 'pillars': [(-.98, -.92)],
    'cw': lambda z: kf(HWB, z) - .2 - .12 * smooth(-1.5, -2.0, z) - .06 * smooth(.25, .5, z),
    'rw': lambda z: kf(HWB, z) - .44 - .12 * smooth(-1.5, -2.0, z) - .06 * smooth(.25, .5, z)})

# ---- twin gloss-black stripes nose to tail, over the body and the cabin
BOTH = car.BV([car.body, car.cabin])
for i, (xa, xb) in enumerate(((-.36, -.23), (.23, .36))):
    def fn(u, z, xa=xa, xb=xb):
        x = lerp(xa, xb, u); y = car.surf_y(x, z, BOTH); return x, (y if y is not None else .9) + .0035
    car.band(f'stripe{i}', fn, -2.43, 2.44, 240, 3, 'STRIPE')
# ---- blower: case, drive snout, six velocity stacks, a butterfly plate; a black surround where it breaks the hood
hy = car.surf_y(0, BLOWER_Z) or .98
car.box('blower_base', (.5, .05, .62), (0, hy + .02, BLOWER_Z), 'GLOSSBLACK')
car.box('blower', (.42, .17, .52), (0, hy + .12, BLOWER_Z), 'SATIN')
for k in range(7): car.box(f'rib{k}', (.44, .012, .025), (0, hy + .12, BLOWER_Z - .21 + k * .07), 'CHROME')
car.cyl('snout', (0, hy + .1, BLOWER_Z + .26), (0, hy + .1, BLOWER_Z + .36), .06, 'CHROME')
car.box('plate_top', (.4, .02, .46), (0, hy + .215, BLOWER_Z), 'CHROME')
for ix in (-1, 1):
    for iz in (-1, 0, 1):
        x = ix * .1; z = BLOWER_Z + iz * .14
        car.cyl(f'stack{ix}{iz}', (x, hy + .22, z), (x, hy + .36, z), .046, 'CHROME', r1=.056, cap=False)
        car.cyl(f'stackin{ix}{iz}', (x, hy + .34, z), (x, hy + .35, z), .04, 'GAP')
# ---- slot headlamps, grille bars, splitter with struts, brake-duct mesh
for sd in (1, -1):
    car.tube(f'head{sd}', [(x, y + .004, z - .014) for x, y, z in LAMPS[sd]], .008, 'HEAD')
    car.tube(f'head2{sd}', [(x, y - .01, z - .02) for x, y, z in LAMPS[sd][:6]], .005, 'HEAD')
for k in range(4):
    y = .3 + k * .055; zc = car.surf_front(0, y) or 2.4; car.box(f'gbar{k}', (1.34, .012, .03), (0, y, zc - .08), 'SATIN')
lip = [(-1.0, 2.1)] + [(math.sin(a) * 1.0, 2.34 + math.cos(a) * .2) for a in [(-math.pi / 2) + math.pi * k / 24 for k in range(25)]] + [(1.0, 2.1)]
car.extrude_y('Splitter', lip, .12, .14, 'CARBON')
for sd in (1, -1):
    for x in (.35, .7): car.cyl(f'strut{sd}{x}', (sd * x, .14, 2.46), (sd * x, .3, 2.32), .008, 'CHROME', seg=8)
# ---- rivets round every flare, side skirts, quad side exits ahead of the rear wheels
for sd in (1, -1):
    for zw in (WB, -WB):
        for k in range(15):
            a = math.radians(-6 + 192 * k / 14); y = WR + (ARCH_R + .045) * math.sin(a); z = zw + (ARCH_R + .045) * math.cos(a)
            if y < .22: continue
            x = car.surf_side(y, z, sd)
            if x: car.sphere(f'rivet{sd}{zw}{k}', (sd * (x + .002), y, z), .012, 'CHROME', seg=8)
    for i in range(4):
        z = -.8 - i * .075; x = car.surf_side(.24, z, sd) or 1.0
        car.cyl(f'side_exh{sd}{i}', (sd * (x - .12), .24, z), (sd * (x + .025), .24, z), .03, 'CHROME', cap=False, seg=14)
        car.cyl(f'side_exhi{sd}{i}', (sd * (x + .01), .24, z), (sd * (x + .012), .24, z), .025, 'GAP', seg=14)
# ---- tail: the light bar in its recessed panel, quad exhausts in the diffuser, a ducktail lip
car.tube('tailbar', [(x, y, z + .03) for x, y, z in TP], .02, 'TAIL', res=4)
for sd in (1, -1):
    for ex in (.34, .5):
        zt = (car.surf_back(sd * ex, .34) or -2.3) - .01
        car.cyl(f'exh{sd}{ex}', (sd * ex, .28, zt + .16), (sd * ex, .28, zt), .05, 'CHROME', cap=False)
        car.cyl(f'exhi{sd}{ex}', (sd * ex, .28, zt + .04), (sd * ex, .28, zt + .03), .043, 'GAP')
for k in range(5):
    x = -.4 + k * .2; car.extrude_x(f'fin{k}', [(-2.0, .16), (-2.36, .16), (-2.36, .3), (-2.2, .29)], x - .007, x + .007, 'CARBON')
for sd in (1, -1):   # mirrors
    mz = .38; my = car.belt(mz) + .02; mx = car.C['cw'](mz)
    car.tube(f'mstalk{sd}', [(sd * (mx - .02), my - .015, mz), (sd * (mx + .06), my + .01, mz - .03), (sd * (mx + .1), my + .03, mz - .05)], .011, 'GLOSSBLACK', res=4)
    car.sphere(f'mcap{sd}', (sd * (mx + .15), my + .045, mz - .07), 1., 'PAINT', scale=(.09, .042, .065), seg=20)
car.extrude_y('Floor', [(-.9, -2.2), (.9, -2.2), (.9, 2.1), (-.9, 2.1)], .14, .16, 'GLOSSBLACK')
objs = car.objs(); result = car.stats(); print(result)
