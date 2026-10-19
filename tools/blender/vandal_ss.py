"""AFTERHOURS — VANDAL SS (hero build), on carlib.py + hero_helpers.py, from Paris's locked Midjourney set
(~/Projects/afterhours_refs/vandal: front34 anchor c56ec622 #3, rear34, headon; seed 1966). A modern widebody supercharged
muscle coupe: a tall blunt nose with a full-width dark grille and LED-ringed lamps at its ends, a big lower intake with LED
bars, a raised centre hood scoop between twin heat extractors, a crisp shoulder line, smooth bolt-on widebody flares, a
vertical vent behind each front wheel, a notchback roof, a ducktail, a black tail panel with two LED racetrack rings,
quad exits in a carbon diffuser, black-violet metallic with white slash shards (VINYL shell, canvas in js/afterhours.js).
Wheels (BODIES.muscle, built in the game): x +-1.04, z +-1.52, r .39.
Headless: python3 build_car.py vandal_ss ../../models/vandal_ss.glb [--shots DIR]."""
import os
car = Car('Vandal SS', paint=(.03, .008, .06), accent=(.75, .35, 1.))
pb = car.M['PAINT'].node_tree.nodes['Principled BSDF']; pb.inputs['Metallic'].default_value = .8; pb.inputs['Roughness'].default_value = .14
Z0, Z1, WB, WR = -2.46, 2.5, 1.52, .39; TRACK = 1.04
FL = lambda z: math.exp(-((z - WB) / .6) ** 4) + math.exp(-((z + WB) / .62) ** 4)
HW = [[-2.46, .92], [-2.38, 1.0], [-2.15, 1.08], [-1.52, 1.13], [-.95, 1.03], [-.6, .97], [0, .96], [.6, .97], [.95, 1.03], [1.52, 1.12],
      [2.05, 1.07], [2.35, 1.0], [2.5, .93]]
YB = [[-2.46, .42], [-2.38, .26], [-2.15, .18], [2.15, .17], [2.4, .2], [2.5, .3]]
YT = [[-2.46, .98], [-2.42, 1.03], [-2.25, 1.045], [-1.6, 1.025], [-1.0, .995], [-.3, .975], [.6, .955], [1.2, .935], [1.8, .905],
      [2.25, .87], [2.42, .835], [2.5, .79]]
YS = [[-2.46, .92], [-2.42, .97], [-2.25, .985], [-1.6, .965], [-1.0, .935], [-.3, .915], [.6, .9], [1.2, .885], [1.8, .86],
      [2.25, .825], [2.42, .79], [2.5, .74]]
def dome(x, z):
    """hood: a broad raised centre panel (the scoop sits on it), flat deck"""
    hz = smooth(.75, 1.1, z) * (1 - smooth(2.15, 2.4, z)); return .025 * hz * (1 - smooth(.32, .46, abs(x)))
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .085, 'NS': 230, 'res': 2,
    'Rx': .055, 'tumble': lambda z: .05 + .12 * FL(z), 'bulge_at': .48, 'round_nose': .07, 'round_tail': .08, 'dome': dome,
    'feature': lambda z: .016 * smooth(-2.42, -2.25, z) * (1 - smooth(2.32, 2.46, z)),      # the long crisp shoulder crease
    'swage': (lambda z: .5, lambda z: smooth(-1.0, -.7, z) * (1 - smooth(.7, 1.0, z)), .025, .05),
    'lean': lambda y, z: .03 * smooth(2.3, 2.5, z) * (car.h_of(y, z) - .5) - .03 * smooth(-2.3, -2.46, z) * (car.h_of(y, z) - .5)})
exec(open(os.path.join(HERE, 'hero_helpers.py')).read(), globals())
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)
car.M['GRILLE'] = mk('GRILLE', (.012, .013, .015), .3, .5)
car.M['VINYL'] = mk('VINYL', (.9, .9, .95), .1, .3)
car.M['LENS'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.03, .01, .015, 1)

# ---- arches, nose: grille band with the lamp ends, lower intake, brake ducts; tail: lamp panel, plate box
ARCH_R = .465
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .7, sd * 1.5)
GRILLE = Car.rounded(0, .715, 1.72, .16, .05, 6)
pocket('grille', GRILLE, .08, per=6)
LOW = Car.rounded(0, .38, 1.5, .24, .06, 6)
pocket('intake', LOW, .12, per=6)
pocket('tailpanel', Car.rounded(0, .86, 1.66, .17, .04, 6), .035, back=True, per=8)
pocket('plate', Car.rounded(0, .6, .5, .13, .015), .04, back=True, per=3)
for sd in (1, -1): side_pocket(f'fvent{sd}', [(.92, .48), (1.0, .48), (.98, .8), (.9, .78)], .04, sd)     # vertical vent behind the front wheel
for sd in (1, -1):   # twin hood heat extractors either side of the centre panel
    top_pocket(f'extract{sd}', [(sd * .5, 1.45), (sd * .72, 1.5), (sd * .7, 1.95), (sd * .5, 1.92)], .03)
for sd in (1, -1):
    shut(f'door{sd}', sd, .64, -.06, .22, .93)
    pts = []
    for k in range(18):
        z = lerp(.7, 2.38, k / 17); x = sd * lerp(.84, .8, (k / 17) ** 1.4); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0032, .012, axis='top')
    for zw in (WB, -WB): flare_seam(f'flareseam{sd}{zw}', sd, zw, WR, ARCH_R + .13)
pts = [(x, (car.surf_y(x, -1.7) or 1.0), -1.7) for x in [lerp(-.8, .8, k / 16) for k in range(17)]]
car.strip_cut('deckF', pts, .003, .012, axis='across')
car.apply_cuts()
car.recolor('CARBON', lambda gx, gy, gz, n: -1.0 < gz < 1.0 and gy < .23 and abs(n[0]) > .25)
car.sharpen(car.body, 50); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.68, x1=1.15)

# ---------------------------------------------------------------- cabin: raked screen, flat roof, notchback, quarter glass
CH = [[-1.62, 1.03], [-1.5, 1.1], [-1.3, 1.21], [-1.08, 1.31], [-.85, 1.37], [-.5, 1.395], [-.15, 1.4], [.1, 1.385], [.25, 1.35],
      [.4, 1.25], [.55, 1.12], [.66, 1.01]]
car.build_cabin({'CZ0': -1.62, 'CZ1': .66, 'NC': 150, 'CH': CH, 'dlo': (.62, .48, -1.25, -.95), 'rear_glass': -.98, 'dlo_trim': None,
    'pillars': [(-.72, -.66)], 'apillar_r': .014,
    'cw': lambda z: .84 - .1 * smooth(-1.1, -1.62, z) - .06 * smooth(.35, .66, z),
    'rw': lambda z: .66 - .08 * smooth(-1.0, -1.62, z) - .07 * smooth(.1, .66, z)})

# ---------------------------------------------------------------- nose details
GZ = FZ(0, .715) - .06
grid('gmesh', lambda u, v: (lerp(-.84, .84, u), lerp(.65, .78, v), GZ - .01), 40, 4, 'GRILLE')
for k in range(5): car.box(f'gbar{k}', (1.6, .006, .03), (0, .66 + k * .028, GZ + .005), 'GRILLE')
def ring(name, cx, cy, w, h, r, zf, m, rad=.007, back=False):   # an LED ring laid on the nose / tail
    pts = Car.rounded(cx, cy, w, h, r, 5); pts = pts + [pts[0]]
    S = BZ if back else FZ; sg = 1 if back else -1
    car.tube(name, [(x, y, S(x, y) + sg * .012) for x, y in pts], rad, m, res=4)
for sd in (1, -1):
    ring(f'halo{sd}', sd * .66, .715, .3, .085, .03, 0, 'HEAD')            # LED rectangles at the grille ends
    car.tube(f'drl{sd}', [(sd * x, .5, FZ(sd * x, .5) - .012) for x in [lerp(.5, .78, k / 8) for k in range(9)]], .007, 'HEAD', res=4)
    grid(f'hlens{sd}', lambda u, v, sd=sd: (sd * lerp(.5, .82, u), lerp(.67, .76, v), FZ(sd * lerp(.5, .82, u), lerp(.67, .76, v)) - .02), 10, 3, 'LENS', flip=sd < 0)
MZ = FZ(0, .38) - .1
grid('imesh', lambda u, v: (lerp(-.72, .72, u), lerp(.28, .48, v), MZ), 40, 6, 'GRILLE')
for k in range(6): car.box(f'ibar{k}', (1.42, .005, .03), (0, .29 + k * .035, MZ + .02), 'GRILLE')
SPL = [(-1.04, 2.2)] + [(math.sin(a) * 1.04, 2.38 + math.cos(a) * .2) for a in [(-math.pi / 2) + math.pi * k / 48 for k in range(49)]] + [(1.04, 2.2)]
bevel_obj(car.extrude_y('Splitter', SPL, .11, .128, 'CARBON'), .004)
for sd in (1, -1): car.extrude_x(f'splitEnd{sd}', [(2.2, .11), (2.5, .11), (2.47, .2), (2.25, .24)], sd * 1.02, sd * 1.04, 'CARBON')
# hood: the raised centre scoop (open to the front), extractor slats
hy = (TY(0, 1.75) or .95)
SC = []
for i in range(25):
    t = i / 24; z = lerp(1.35, 2.0, t); h = .07 * math.sin(math.pi * min(1, t * 1.25)) ** .6 * (1 - .2 * t); w = .3 - .04 * t
    y0 = (TY(0, z) or .95) - .01
    SC.append([G(-w, y0, z), G(-w * .92, y0 + h, z), G(w * .92, y0 + h, z), G(w, y0, z)])
car.loft('Scoop', SC, 'PAINT')
car.box('scoopmouth', (.5, .05, .01), (0, (TY(0, 1.6) or .95) + .035, 1.62), 'GAP')
for sd in (1, -1):
    for k in range(6):
        z = lerp(1.52, 1.88, k / 5); x = sd * .61; y = (TY(x, z) or .95)
        car.box(f'slat{sd}{k}', (.2, .008, .035), (x, y - .006, z), 'GLOSSBLACK', rot=(-.4, 0, 0))

# ---------------------------------------------------------------- flanks
for sd in (1, -1):
    for k in range(4):   # fins in the fender vent
        y = .52 + k * .07; x = SX(y, .95, sd) or 1.05; car.box(f'fvfin{sd}{k}', (.03, .008, .07), (sd * (x - .01), y, .95), 'GLOSSBLACK')
    sill = []
    for i in range(41):
        zz = lerp(-.98, .98, i / 40); x = car.surf_side(.24, zz, sd) or .96
        sill.append([G(sd * (x - .06), .12, zz), G(sd * (x + .05), .12, zz), G(sd * (x + .055), .155, zz), G(sd * (x - .06), .2, zz)])
    car.loft(f'Skirt{sd}', sill, 'CARBON', smooth_=False)
    car.tube(f'skirtLED{sd}', [(sd * ((car.surf_side(.24, zz, sd) or .96) + .05), .128, zz) for zz in [lerp(-.92, .92, k / 20) for k in range(21)]], .005, 'ACCENT', res=4)
    z = -.25; y = kf(YS, z) - .08; x = car.surf_side(y, z, sd)
    if x: rbox(f'handle{sd}', (.012, .024, .15), (sd * (x + .003), y, z), 'GLOSSBLACK', r=.004)
    mz = .5; my = car.belt(mz) + .035; mx = car.C['cw'](mz)
    car.extrude_x(f'msail{sd}', [(mz + .09, my - .05), (mz - .07, my - .05), (mz - .02, my + .015), (mz + .06, my + .015)], sd * (mx - .01), sd * (mx + .05), 'GLOSSBLACK')
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=28, v_segments=14, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .1, v.co.z * .05, v.co.y * .07
        if gz < 0: gz *= .3
        v.co = G(sd * (mx + .12) + gx, my + .035 + gy, mz - .04 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(car.M['PAINT']); me.shade_smooth(); car.link(bpy.data.objects.new(f'mcap{sd}', me))

# ---------------------------------------------------------------- tail: racetrack rings, ducktail, diffuser, quads
for sd in (1, -1):
    ring(f'tring{sd}', sd * .42, .86, .66, .1, .045, 0, 'TAIL', .011, back=True)
    grid(f'tlens{sd}', lambda u, v, sd=sd: (sd * lerp(.08, .78, u), lerp(.8, .92, v), BZ(sd * lerp(.08, .78, u), lerp(.8, .92, v)) - .006), 28, 4, 'LENS', flip=sd > 0)
grid('valance', lambda u, v: (lambda x, y: (x, y, BZ(x, y) - .006))(lerp(-.86, .86, u), lerp(.2, .38, v)), 60, 6, 'CARBON', flip=True)
for k in range(6):
    x = -.25 + k * .1; zt = BZ(x, .3)
    car.extrude_x(f'dfin{k}', [(-2.2, .16), (zt - .07, .16), (zt - .05, .34), (-2.36, .34)], x - .006, x + .006, 'CARBON')
for sd in (1, -1):
    for x in (.48, .6):
        y = .27; zt = BZ(sd * x, y); zo = zt - .04
        car.cyl(f'exh{sd}{x}', (sd * x, y, zt + .1), (sd * x, y, zo), .045, 'CHROME', seg=40, cap=False)
        car.cyl(f'exhR{sd}{x}', (sd * x, y, zo + .01), (sd * x, y, zo), .049, 'CHROME', r1=.046, seg=40, cap=False)
        car.cyl(f'exhC{sd}{x}', (sd * x, y, zo + .04), (sd * x, y, zo + .035), .04, 'GAP', seg=24)
DT = []
for i in range(41):
    x = lerp(-.9, .9, i / 40); y0 = car.surf_y(x * .99, -2.4) or 1.03; up = .07 * (1 - .4 * (abs(x) / .9) ** 3)
    DT.append([G(x, y0 - .005, -2.28), G(x, y0 + up * .4, -2.36), G(x, y0 + up, -2.48), G(x, y0 + up - .016, -2.485), G(x, y0 - .02, -2.42)])
car.loft('Ducktail', DT, 'PAINT')
interior(seat_z=-.5, dash_z=.42, floor=(-.94, .94, -2.2, 2.2))
skin_normals()
vinyl_shell(-2.3, .7, .22, 1.0)
objs = car.objs(); result = car.stats(); print(result)
print('stations: halo z %.3f  intake z %.3f  tail z %.3f  plate z %.3f' % (FZ(.66, .715), FZ(.6, .5), BZ(.42, .86), BZ(0, .6)))
