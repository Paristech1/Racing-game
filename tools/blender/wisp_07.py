"""AFTERHOURS — WISP 07 (v2), built in Blender on carlib.py from a Gemini concept sheet (docs: tools/blender/README.md).
A featherweight triple-motor electric hot hatch: short overhangs, wide track, a cab-forward teardrop glasshouse outlined
in cyan, a full-width cyan light blade across the nose and tail, a vertical air-curtain blade behind each front wheel,
carbon tub sills, and a floating carbon wing on swan-neck struts. Wheels (BODIES.hatch): x +-.94, z +-1.26, r .35.
Live (MCP): exec carlib.py, then this file in the same namespace."""
car = Car('Wisp 07', paint=(.82, .86, .88), accent=(.35, 1, .95))
Z0, Z1, WB, WR = -2.04, 2.02, 1.26, .35
HW = [[-2.04, .86], [-1.94, .95], [-1.7, 1.01], [-1.26, 1.04], [-.8, .98], [-.3, .95], [.3, .95], [.8, .98], [1.26, 1.03], [1.6, 1.0], [1.85, .93], [2.02, .78]]
YB = [[-2.04, .34], [-1.88, .21], [-1.6, .15], [1.6, .15], [1.86, .18], [2.02, .25]]
YS = [[-2.04, .82], [-1.85, .86], [-1.26, .84], [-.6, .76], [.2, .72], [.9, .72], [1.26, .72], [1.7, .62], [2.02, .46]]
YT = [[-2.04, .88], [-1.97, .95], [-1.85, .96], [-1.4, .95], [-.9, .9], [-.3, .85], [.3, .82], [.8, .77], [1.3, .7], [1.7, .6], [1.92, .52], [2.02, .46]]
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .09, 'Rx': .13, 'round_nose': .14, 'round_tail': .14,
    'swage': (lambda z: lerp(.58, .4, smooth(-1.0, .9, z)), lambda z: smooth(-1.1, -.85, z) * (1 - smooth(.7, .95, z)), .02),
    'dome': lambda x, z: .018 * smooth(.7, 1.0, z) * (1 - smooth(1.6, 1.9, z)) * math.exp(-((abs(x) - .3) / .1) ** 2),
    'lean': lambda y, z: -.06 * smooth(1.6, 2.02, z) * (car.h_of(y, z) - .5) - .05 * smooth(-1.8, -2.04, z) * (car.h_of(y, z) - .45)})
ARCH_R = .39
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .6, sd * 1.4)
# front: wide black lower grille, vertical corner intakes; the upper light blade sits in a slim slot under the hood edge
car.front_prism('grille', [(-.62, .17), (.62, .17), (.56, .35), (-.56, .35)], 1.78, 2.6)
for sd in (1, -1):
    car.front_prism(f'corner{sd}', [(sd * .66, .19), (sd * .86, .21), (sd * .84, .47), (sd * .71, .45)], 1.72, 2.6)
    # air-curtain exit behind the front wheel: a tall curved slot in the flank
    car.side_prism(f'curtain{sd}', [(.8, .26), (.72, .26), (.64, .6), (.7, .62)], sd * .8, sd * 1.3, 'GLOSSBLACK')
car.front_prism('diff', Car.rounded(0, .27, 1.36, .2, .04), -2.6, -1.92, 'GLOSSBLACK')
def blade_pts(y, x0, x1, n=17, side='front'):
    pts = []
    for k in range(n):
        x = lerp(x0, x1, k / (n - 1)); z = car.surf_front(x, y) if side == 'front' else car.surf_back(x, y)
        if z is not None: pts.append((x, y, z - (.004 if side == 'front' else -.004)))
    return pts
UPPER = blade_pts(.5, -.84, .84)
car.lamp_recess('bladeslot', UPPER, .022, .022, .05, .2)
for sd in (1, -1):   # door shut lines, hood lines, hatch line
    for z0, ln, kink in ((.56, -.1, 0), (-.74, .0, .05)):
        pts = []
        for k in range(12):
            y = lerp(.24, kf(YT, z0) - .03, k / 11); z = z0 + ln * (y - .24) + kink * math.sin(k / 11 * math.pi); x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        car.strip_cut(f'door{sd}{z0}', pts, .0035, .012)
    pts = []
    for k in range(12):
        z = lerp(.62, 1.86, k / 11); x = sd * lerp(.68, .56, (k / 11) ** 1.5); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0035, .012, axis='top')
car.apply_cuts()
car.recolor('CARBON', lambda gx, gy, gz, n: gy < kf(YB, gz) + .09 and -1.0 < gz < .98)                                # carbon tub sills
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: (gz > 1.9 and gy < .2) or (gz < -1.9 and gy < .36 and gx < .72) or (gz < -1.95 and .74 < gy < .87 and gx < .78 and n[2] < -.5))
car.sharpen(car.body, 28); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R)

# cabin: cab-forward teardrop, windscreen far forward, roof falling to a short fastback; cyan DLO line
CH = [[-1.82, .975], [-1.5, 1.06], [-1.05, 1.18], [-.6, 1.28], [-.25, 1.32], [0, 1.31], [.2, 1.2], [.42, 1.03], [.64, .83]]
car.build_cabin({'CZ0': -1.82, 'CZ1': .64, 'CH': CH, 'dlo': (.52, .55, -1.42, -1.02), 'rear_glass': -1.25, 'dlo_trim': 'ACCENT',
    'cw': lambda z: kf(HW, z) - .22 - .07 * smooth(-1.3, -1.82, z) - .05 * smooth(.35, .64, z),
    'rw': lambda z: kf(HW, z) - .44 - .07 * smooth(-1.3, -1.82, z) - .05 * smooth(.35, .64, z)})

# ---- light blades: full width across the nose, a short lower bar, and a full-width bar across the tail
car.tube('blade_front', [(x, y + .004, z - .012) for x, y, z in UPPER], .011, 'ACCENT')
car.tube('blade_low', [(x, .345, (car.surf_front(x, .345) or 1.9) - .006) for x in [lerp(-.42, .42, k / 8) for k in range(9)]], .007, 'ACCENT')
TAILB = blade_pts(.8, -.82, .82, side='back')
car.tube('blade_tail', [(x, y, z + .006) for x, y, z in TAILB], .012, 'ACCENT')
for sd in (1, -1):
    car.tube(f'curtain_edge{sd}', [(sd * ((car.surf_side(y, z, sd) or .95) + .004), y, z) for y, z in ((.28, .79), (.44, .75), (.6, .705))], .006, 'ACCENT')
    car.tube(f'corner_edge{sd}', [(sd * .72, .455, (car.surf_front(sd * .72, .455) or 1.9) - .004), (sd * .84, .47, (car.surf_front(sd * .84, .47) or 1.8) - .004)], .006, 'ACCENT')
# ---- splitter, side blades, diffuser strakes
lip = [(-.8, 1.62)] + [(math.sin(a) * .8, 1.82 + math.cos(a) * .12) for a in [(-math.pi / 2) + math.pi * k / 20 for k in range(21)]] + [(.8, 1.62)]
car.extrude_y('Lip', lip, .14, .158, 'CARBON')
for k in range(5):
    x = -.44 + k * .22; car.extrude_x(f'fin{k}', [(-1.6, .15), (-1.9, .15), (-1.9, .28), (-1.76, .27)], x - .007, x + .007, 'CARBON')
# ---- swan-neck wing
foil = [(-1.62, 1.22), (-1.7, 1.245), (-1.84, 1.25), (-1.96, 1.235), (-1.99, 1.22), (-1.84, 1.215), (-1.7, 1.212)]
car.extrude_x('Wing', foil, -.72, .72, 'CARBON', smooth_=True)
for sd in (1, -1):
    car.box(f'plate{sd}', (.012, .1, .36), (sd * .725, 1.22, -1.8), 'CARBON')
    x = sd * .36; dy = car.surf_y(x, -1.74) or .95
    car.tube(f'strut{sd}', [(x, dy - .01, -1.7), (x, 1.2, -1.78), (x, 1.265, -1.74)], .018, 'CARBON', res=8)
# ---- mirrors, flush handles
for sd in (1, -1):
    mz = .46; my = car.belt(mz) + .02; mx = car.C['cw'](mz)
    car.tube(f'mstalk{sd}', [(sd * (mx - .02), my - .015, mz), (sd * (mx + .06), my + .01, mz - .03), (sd * (mx + .1), my + .03, mz - .05)], .01, 'GLOSSBLACK', res=4)
    car.sphere(f'mcap{sd}', (sd * (mx + .15), my + .045, mz - .07), 1., 'PAINT', scale=(.085, .04, .062), seg=20)
    y = kf(YS, -.4) - .06; x = car.surf_side(y, -.4, sd)
    if x: car.box(f'handle{sd}', (.01, .016, .16), (sd * (x + .002), y, -.4), 'SATIN')
car.extrude_y('Floor', [(-.8, -1.7), (.8, -1.7), (.8, 1.6), (-.8, 1.6)], .14, .16, 'GLOSSBLACK')
objs = car.objs(); result = car.stats(); print(result)
