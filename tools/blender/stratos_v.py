"""AFTERHOURS — STRATOS V (hero build), on carlib.py + hero_helpers.py, from Paris's locked Midjourney set
(~/Projects/afterhours_refs/stratos: front34 anchor 9f28f113 #1, side, rear34, headon; seed 505). A low mid-engine wind-tunnel
hypercar: tall front fender pods over a deep hood valley with twin scallop vents, a pointed nose over a central intake and
big bladed side intakes, slim angled LED eyes with a round projector, a black teardrop canopy that runs into a long engine
cover, a big side scoop behind the door, carbon sills, splitter and diffuser, a huge swan-neck wing, a thin red tail blade.
Vivid orange with a yellow accent line.
Wheels (BODIES.stratos, built in the game): x +-.96, z +-1.5, r .37.
Headless: python3 build_car.py stratos_v ../../models/stratos_v.glb [--shots DIR]."""
import os
car = Car('Stratos V', paint=(1., .2, .01), accent=(1., .78, .1))
pb = car.M['PAINT'].node_tree.nodes['Principled BSDF']; pb.inputs['Metallic'].default_value = .55; pb.inputs['Roughness'].default_value = .16
Z0, Z1, WB, WR = -2.64, 2.42, 1.5, .37; TRACK = .96
HW = [[-2.64, .95], [-2.5, 1.0], [-2.0, 1.04], [-1.5, 1.05], [-1.0, 1.0], [-.5, .93], [0, .89], [.5, .9], [1.0, .98], [1.5, 1.04],
      [2.0, .98], [2.3, .8], [2.42, .58]]
YB = [[-2.64, .3], [-2.5, .17], [-2.2, .13], [2.0, .12], [2.3, .14], [2.42, .2]]
YT = [[-2.64, .7], [-2.55, .75], [-2.3, .78], [-1.9, .8], [-1.5, .8], [-1.0, .77], [-.3, .73], [.5, .71], [1.1, .71], [1.5, .7],
      [1.9, .63], [2.2, .51], [2.42, .37]]
YS = [[-2.64, .64], [-2.55, .69], [-2.3, .72], [-1.9, .74], [-1.5, .74], [-1.0, .71], [-.3, .67], [.5, .65], [1.1, .65], [1.5, .64],
      [1.9, .58], [2.2, .46], [2.42, .32]]
def dome(x, z):
    """the hood valley between the front fender pods; a gentle crown on the rear haunches"""
    hz = smooth(1.05, 1.35, z) * (1 - smooth(2.25, 2.42, z))
    return -.14 * hz * (1 - smooth(.28, .58, abs(x))) + .06 * smooth(-.6, -1.2, z) * (1 - smooth(-2.2, -2.5, z)) * smooth(.5, .85, abs(x))
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .1, 'NS': 230, 'res': 2,
    'Rx': lambda z: .07 + .03 * smooth(1.6, 2.2, z), 'tumble': lambda z: .07 + .05 * smooth(.4, -.6, z) * smooth(-2.0, -1.2, z),
    'bulge_at': .45, 'round_nose': .1, 'round_tail': .05, 'dome': dome,
    'feature': lambda z: .012 * smooth(-2.5, -2.2, z) * (1 - smooth(2.0, 2.3, z)),
    'lean': lambda y, z: .14 * smooth(2.05, 2.42, z) * (car.h_of(y, z) - .65) - .03 * smooth(-2.4, -2.64, z) * (car.h_of(y, z) - .5)})
exec(open(os.path.join(HERE, 'hero_helpers.py')).read(), globals())
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)
car.M['GRILLE'] = mk('GRILLE', (.012, .013, .015), .3, .5)
car.M['ACCENT'] = mk('ACCENT', (1., .78, .1), .2, .3)                 # the yellow accent line (plain paint, not a lamp)
car.M['LENS'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.06, .004, .006, 1)

# ---- arches; nose: central intake, side intakes, eye slots, hood scallops; side scoop + fender vent; tail blade, plate
ARCH_R = .42
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .62, sd * 1.4)
pocket('cintake', [(-.32, .2), (.32, .2), (.24, .38), (0, .42), (-.24, .38)], .14, per=6)
for sd in (1, -1):
    pocket(f'sintake{sd}', [(sd * .42, .16), (sd * .9, .17), (sd * .94, .44), (sd * .7, .5), (sd * .46, .36)], .16, per=6)
    pocket(f'eye{sd}', [(sd * .5, .5), (sd * .74, .545), (sd * .9, .6), (sd * .88, .625), (sd * .7, .585), (sd * .52, .53)], .05, per=8)
    top_pocket(f'scallop{sd}', [(sd * .14, 1.62), (sd * .42, 1.7), (sd * .38, 2.08), (sd * .2, 2.12)], .035)
    side_pocket(f'scoop{sd}', [(-.32, .34), (-.98, .3), (-1.02, .62), (-.55, .68)], .22, sd, 'GAP')
    side_pocket(f'fvent{sd}', [(1.0, .32), (1.12, .3), (1.04, .6), (.96, .58)], .05, sd)
pocket('tailbar', Car.rounded(0, .64, 1.7, .04, .015, 3), .025, back=True, per=10)
pocket('plate', Car.rounded(0, .46, .5, .13, .015), .035, back=True, per=3)
for sd in (1, -1):
    shut(f'door{sd}', sd, 1.0, -.25, .2, .7)
    shut(f'doorR{sd}', sd, -.3, .1, .2, .67)
car.apply_cuts()
car.recolor('CARBON', lambda gx, gy, gz, n: -1.05 < gz < 1.05 and gy < .31 and abs(n[0]) > .25)          # carbon sill blade
car.recolor('CARBON', lambda gx, gy, gz, n: gz > 2.15 and gy < .2)                                       # carbon chin
car.sharpen(car.body, 50); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.6, x1=1.0)

# ---------------------------------------------------------------- cabin: teardrop canopy into a long engine cover
CH = [[-2.1, .8], [-1.8, .86], [-1.4, .93], [-1.0, .99], [-.6, 1.04], [-.3, 1.07], [0, 1.085], [.25, 1.08], [.5, 1.03],
      [.75, .95], [.95, .86], [1.12, .77]]
car.build_cabin({'CZ0': -2.1, 'CZ1': 1.12, 'NC': 260, 'CH': CH, 'dlo': (1.1, .55, -.6, -.6), 'rear_glass': -9., 'dlo_trim': None,
    'pillars': [], 'apillar_r': .013,
    'cw': lambda z: .76 - .12 * smooth(-.4, -2.1, z) - .2 * smooth(.6, 1.12, z),
    'rw': lambda z: .5 - .16 * smooth(-.4, -2.1, z) - .14 * smooth(.3, 1.12, z)})
for p_ in car.cabin.data.polygons:   # the canopy reads black (as on the reference): every paint ring forward of the engine cover goes gloss black
    if p_.material_index == 0 and -p_.center.y > -.62: p_.material_index = 2

# ---------------------------------------------------------------- nose details
for sd in (1, -1):
    car.tube(f'eyeLED{sd}', [(sd * x, y + .012, FZ(sd * x, y + .012) - .012) for x, y in [(.52, .525), (.66, .55), (.78, .575), (.89, .607)]], .0055, 'HEAD', res=6)
    x, y = sd * .6, .538; zf = FZ(x, y) - .03
    car.cyl(f'proj{sd}', (x, y, zf - .01), (x, y, zf + .012), .02, 'HEAD', seg=28)
    car.cyl(f'projR{sd}', (x, y, zf + .005), (x, y, zf + .014), .026, 'CHROME', r1=.024, seg=28, cap=False)
    grid(f'smesh{sd}', lambda u, v, sd=sd: (sd * lerp(.48, .9, u), lerp(.19, .45, v), FZ(sd * lerp(.48, .9, u), .3) - .1), 16, 8, 'GRILLE', flip=sd < 0)
    for k in range(5):   # slats in the hood scallops
        z = lerp(1.7, 2.04, k / 4); x = sd * .28; y = TY(x, z) or .55
        car.box(f'hslat{sd}{k}', (.22, .006, .03), (x, y - .008, z), 'GLOSSBLACK', rot=(-.35, 0, 0))
grid('cmesh', lambda u, v: (lerp(-.3, .3, u), lerp(.21, .4, v), FZ(0, .3) - .12), 24, 6, 'GRILLE')
SPL = [(-1.0, 2.0)] + [(math.sin(a) * 1.0, 2.3 + math.cos(a) * .2) for a in [(-math.pi / 2) + math.pi * k / 48 for k in range(49)]] + [(1.0, 2.0)]
bevel_obj(car.extrude_y('Splitter', SPL, .07, .088, 'CARBON'), .004)
for x in (-.5, .5): car.cyl(f'sstrut{x}', (x, .088, 2.3), (x, .2, 2.25), .007, 'GLOSSBLACK', seg=8)
for sd in (1, -1): car.extrude_x(f'canard{sd}', [(2.12, .3), (2.3, .26), (2.24, .32), (2.1, .34)], sd * .9, sd * 1.0, 'CARBON')

# ---------------------------------------------------------------- flanks: yellow accent line, scoop blades, mirrors, sills
for sd in (1, -1):
    pts = []
    for k in range(30):
        z = lerp(2.25, -.95, k / 29); y = lerp(.5, .62, smooth(2.2, 1.6, z)) - .05 * smooth(.2, -.95, z)
        x = SX(y, z, sd)
        if x: pts.append((sd * (x + .002), y, z))
    car.tube(f'accent{sd}', pts, .006, 'ACCENT', res=4)
    for k in range(3):
        z = lerp(-.45, -.85, k / 2); y = .5; x = SX(y, z, sd) or .9
        car.box(f'scblade{sd}{k}', (.1, .28, .012), (sd * (x - .1), y, z), 'CARBON')
    sill = []
    for i in range(41):
        zz = lerp(-1.02, 1.02, i / 40); x = car.surf_side(.2, zz, sd) or .9
        sill.append([G(sd * (x - .06), .1, zz), G(sd * (x + .06), .1, zz), G(sd * (x + .065), .13, zz), G(sd * (x - .06), .17, zz)])
    car.loft(f'Skirt{sd}', sill, 'CARBON', smooth_=False)
    mz = .78; my = car.belt(mz) + .05; mx = car.C['cw'](mz)
    car.tube(f'mstalk{sd}', [(sd * (mx - .02), my - .03, mz), (sd * (mx + .08), my + .02, mz - .04), (sd * (mx + .12), my + .05, mz - .06)], .009, 'CARBON', res=4)
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=28, v_segments=14, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .09, v.co.z * .035, v.co.y * .07
        if gz < 0: gz *= .25
        v.co = G(sd * (mx + .17) + gx, my + .065 + gy, mz - .07 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(car.M['PAINT']); me.shade_smooth(); car.link(bpy.data.objects.new(f'mcap{sd}', me))
# engine cover louvers behind the canopy
BOTH = car.BV([car.body, car.cabin])
for k in range(9):
    z = lerp(-1.0, -1.85, k / 8); pts = []
    for j in range(9):
        x = lerp(-.28, .28, j / 8) * (1 - .3 * k / 8); y = car.surf_y(x, z, BOTH)
        if y: pts.append((x, y + .008, z))
    if len(pts) > 3: car.tube(f'elouv{k}', pts, .008, 'GLOSSBLACK', res=3)

# ---------------------------------------------------------------- tail: red blade, diffuser, twin centre exits, swan-neck wing
car.tube('tailLED', [(x, .64, BZ(x, .64) - .01) for x in [lerp(-.84, .84, k / 34) for k in range(35)]], .012, 'TAIL', res=6)
for sd in (1, -1):
    car.tube(f'tailV{sd}', [(sd * .86, y, BZ(sd * .86, y) - .01) for y in [lerp(.48, .66, k / 6) for k in range(7)]], .01, 'TAIL', res=4)
grid('rmesh', lambda u, v: (lambda x, y: (x, y, BZ(x, y) - .005))(lerp(-.84, .84, u), lerp(.3, .58, v)), 60, 8, 'GRILLE', flip=True)
for k in range(7):
    x = -.6 + k * .2; zt = BZ(x, .25)
    car.extrude_x(f'dfin{k}', [(-2.15, .1), (zt - .12, .1), (zt - .1, .32), (-2.4, .32)], x - .007, x + .007, 'CARBON')
for x in (-.09, .09):
    y = .4; zt = BZ(x, y); zo = zt - .04
    car.cyl(f'exh{x}', (x, y, zt + .1), (x, y, zo), .05, 'CHROME', seg=40, cap=False)
    car.cyl(f'exhC{x}', (x, y, zo + .04), (x, y, zo + .035), .044, 'GAP', seg=24)
def foil(chord, thick, n=24):
    up, lo = [], []
    for k in range(n + 1):
        t = k / n; xc = (1 - math.cos(math.pi * t)) / 2
        yt = 5 * thick * (.2969 * math.sqrt(xc) - .126 * xc - .3516 * xc ** 2 + .2843 * xc ** 3 - .1036 * xc ** 4)
        yc = .07 * (2 * .4 * xc - xc * xc) / .16 if xc < .4 else .07 * (1 - 2 * .4 + 2 * .4 * xc - xc * xc) / .36
        up.append((-xc * chord, (yc + yt) * chord)); lo.append((-xc * chord, (yc - yt) * chord))
    return up + list(reversed(lo[1:-1]))
WZ = -2.2; WX = .98; WY = 1.16; SEC = foil(.42, .11, 28); WS = []
for i in range(61):
    x = lerp(-WX, WX, i / 60); tilt = -.2 - .04 * (abs(x) / WX) ** 2; ring_ = []
    for z, yy in SEC:
        zz = z * math.cos(tilt) - yy * math.sin(tilt); y2 = z * math.sin(tilt) + yy * math.cos(tilt); ring_.append(G(x, WY + y2, WZ + zz))
    WS.append(ring_)
car.loft('Wing', WS, 'CARBON')
car.box('gurney', (2 * WX, .03, .006), (0, WY + .02, WZ - .41), 'ACCENT', rot=(.4, 0, 0))
for sd in (1, -1):
    car.extrude_x(f'endplate{sd}', [(WZ + .06, WY - .14), (WZ - .46, WY - .16), (WZ - .5, WY + .1), (WZ - .02, WY + .06)], sd * (WX - .002), sd * (WX + .012), 'CARBON')
    # swan neck: rises from the engine cover behind the wing, arcs over and hangs the blade from its top surface
    x = sd * .32; y0 = car.surf_y(x, -1.85, BOTH) or .85
    car.tube(f'swan{sd}', [(x, y0 - .01, -1.85), (x, y0 + .18, -1.92), (x, WY + .16, -2.06), (x, WY + .12, -2.22), (x, WY + .05, -2.28)], .016, 'CARBON', res=6)
interior(seat_z=-.2, dash_z=.62, floor=(-.88, .88, -1.2, 1.9), y_center=.85, dy=-.2)
skin_normals()
objs = car.objs(); result = car.stats(); print(result)
print('stations: eye z %.3f  tail z %.3f  plate z %.3f' % (FZ(.6, .538), BZ(.5, .64), BZ(0, .46)))
