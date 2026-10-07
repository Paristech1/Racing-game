"""AFTERHOURS — KAGE R, built in Blender on carlib.py from a four-view reference sheet (docs: tools/blender/README.md).
An original electric hypercar: pearl-white body over a black teardrop canopy, front fenders standing proud of a low
hood valley with vertical LED blades set into their noses, a deep sculpted scallop through each door that feeds a dark
intake ahead of the rear haunch, and two venturi tunnels through the tail outlined in red light. Low integrated blade
wing between the haunches, black louvered engine cover, full-width finned diffuser.
Wheels (BODIES.kage): x +-.98, z +-1.4, r .35.
Live (MCP) or headless (pip bpy): exec carlib.py, then this file in the same namespace."""
car = Car('Kage R', paint=(.86, .87, .88), accent=(1, .05, .06))
Z0, Z1, WB, WR = -1.96, 2.52, 1.4, .35
HW = [[-1.96, .94], [-1.86, 1.0], [-1.6, 1.02], [-1.3, 1.02], [-.95, .98], [-.55, .92], [-.1, .88], [.5, .88], [1.0, .95], [1.4, .985],
      [1.85, .97], [2.15, .92], [2.38, .82], [2.52, .66]]
YB = [[-1.96, .2], [-1.84, .12], [-1.6, .1], [2.0, .1], [2.3, .14], [2.52, .18]]
YS = [[-1.96, .6], [-1.4, .58], [-.9, .62], [-.55, .7], [0, .72], [.6, .72], [.95, .66], [1.4, .5], [2.0, .44], [2.35, .4], [2.52, .37]]
YT = [[-1.96, .84], [-1.8, .87], [-1.5, .9], [-1.0, .935], [-.5, .92], [-.2, .88], [.1, .81], [.4, .755], [.8, .745], [1.2, .77],
      [1.45, .8], [1.7, .76], [1.95, .64], [2.2, .53], [2.4, .45], [2.52, .41]]
def valley(x, z):  # the hood sits in a deep valley between pod fenders; the engine cover dips a little between the haunches
    d = .23 * smooth(1.1, 1.75, z) * (1 - .55 * smooth(2.15, 2.5, z)) + .06 * smooth(-.85, -1.1, z)
    pod = .03 * smooth(1.2, 1.5, z) * (1 - smooth(2.1, 2.45, z)) * math.exp(-((abs(x) - .74) / .09) ** 2)
    return -d * (1 - smooth(.44, .66, abs(x))) + pod
def scallop(y, z, yb, yc):
    """door concavity: deepest just under the character line, a wall behind the front arch and an S-curved haunch wall"""
    y1 = yb + .13
    if y <= y1 or y >= yc: return 0.
    u = (y - y1) / (yc - y1); g = math.sin(math.pi * u ** 1.5) ** .75
    zw = lerp(-.46, -.7, 1 - u)                                                    # haunch wall leans back toward the sill
    c = .21 * smooth(1.06, .9, z) * smooth(zw - .16, zw, z) + .05 * smooth(.3, -.4, z) * smooth(zw - .16, zw, z)
    return c * g
def section(z):
    hs = kf(HW, z); yb = kf(YB, z); ys = kf(YS, z); yt = max(kf(YT, z), ys + .02)
    yc = min(ys, yt - .015)                        # the character line sits at the widest point
    tuck = .1; hl = hs - tuck; Rx = .16 if z > 1.05 or z < -.7 else lerp(.16, .06, smooth(1.05, .8, z) * smooth(-.7, -.45, z))
    half = [(0, yb), (hl - .14, yb), (hl - .03, yb + .01), (hl, yb + .05)]
    for k in range(1, 15):                        # sill tuck -> widest point, less the door scallop
        t = k / 14; y = lerp(yb + .05, ys, t); x0 = hs - tuck * (1 - t) ** 2.4
        half.append((x0 - scallop(y, z, yb, yc), y))
    Ry = yt - ys
    for k in range(1, 8):
        a = k / 7 * math.pi / 2; half.append((hs - Rx * (1 - math.cos(a)), ys + Ry * math.sin(a)))
    xe = hs - Rx
    for k in range(1, 9):
        t = k / 8; x = lerp(xe, 0, t); half.append((x, yt + valley(x, z)))
    half[-1] = (0, half[-1][1])
    tn = clamp((z - (Z1 - .2)) / .2, 0, 1); tr = clamp(((Z0 + .06) - z) / .06, 0, 1)
    en = 1 - math.sqrt(max(0., 1 - tn * tn)); er = 1 - math.sqrt(max(0., 1 - tr * tr)); ym = (yb + yt) * .5
    return [(x * (1 - .2 * en - .12 * er), ym + (y - ym) * (1 - .28 * en - .18 * er)) for x, y in half]
car.P = {'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT}
stations = []
for i in range(300):
    t = i / 299; t = .82 * t + .18 * (.5 - .5 * math.cos(math.pi * t)); z = Z0 + (Z1 - Z0) * t
    sec = section(z); yb, yt = kf(YB, z), kf(YT, z)
    stations.append([G(x, y, z - .08 * smooth(2.1, 2.52, z) * (clamp((y - yb) / max(yt - yb, .01), 0, 1) - .3)) for x, y in Car.mirror_ring(sec)])
car.body = car.loft('Body', stations, 'PAINT'); car.bvh = car.BV()
ARCH_R = .4
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .62, sd * 1.4)

# ---- black air-curtain slot behind the front wheel, dark intake set into the haunch wall at the back of the scallop
for sd in (1, -1):
    car.side_prism(f'curtain{sd}', [(1.0, .26), (.93, .26), (.9, .7), (.97, .72)], sd * .66, sd * 1.4, 'GLOSSBLACK')
    car.side_prism(f'intake{sd}', [(-.4, .68), (-.62, .7), (-.7, .42), (-.6, .36), (-.5, .42)], sd * .56, sd * 1.4, 'GLOSSBLACK')

# ---- front: full-width black intake under the nose, vertical headlight blades cut into the fender noses
car.front_prism('grille', [(-.72, .12), (.72, .12), (.64, .29), (-.64, .29)], 2.32, 3.0)
def slot_front(name, pts, hw, depth, m='GLOSSBLACK'):
    verts = []; faces = []
    for (x, y, z) in pts: verts += [G(x - hw, y, z - depth), G(x + hw, y, z - depth), G(x + hw, y, z + .3), G(x - hw, y, z + .3)]
    n = len(pts)
    for i in range(n - 1):
        for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
    L = 4 * (n - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
    ob = car.new_obj(name, verts, faces, m, False); car.fixn(ob); return car.cutter(ob, m)
HEADL = {}
for sd in (1, -1):
    pts = []
    for k in range(10):
        y = lerp(.76, .38, k / 9); x = sd * lerp(.84, .74, k / 9); z = car.surf_front(x, y)
        if z is not None: pts.append((x, y, z))
    HEADL[sd] = pts; slot_front(f'headslot{sd}', pts, .048, .06)

# ---- rear: two venturi tunnels through the tail, a finned diffuser, the slot under the wing
TUN, RING = {}, {}
for sd in (1, -1):
    poly = [(sd * x, y) for x, y in [(.83, .7), (.81, .758), (.75, .775), (.35, .775), (.3, .745), (.32, .705), (.68, .39), (.74, .37), (.8, .39), (.83, .44)]]
    if sd < 0: poly = poly[::-1]
    ring = TUN[sd] = poly; ring = ring + [ring[0]]; pts = []   # ring stations sampled on the uncut tail face
    for (x0, y0), (x1, y1) in zip(ring, ring[1:]):
        for k in range(6): x = lerp(x0, x1, k / 6); y = lerp(y0, y1, k / 6); pts.append((x, y, (car.surf_back(x, y) or -1.96) + .006))
    pts.append(pts[0]); RING[sd] = pts
    car.front_prism(f'tunnel{sd}', poly, -3.0, -1.56, 'GLOSSBLACK')
diff = [(-.9, .05), (.9, .05), (.9, .3), (.6, .38), (.3, .42), (0, .43), (-.3, .42), (-.6, .38), (-.9, .3)]
car.front_prism('diffuser', diff, -3.0, -1.62, 'GLOSSBLACK')
car.front_prism('wingslot', Car.rounded(0, .8, .5, .06, .025), -3.0, -1.9, 'GLOSSBLACK')
for c in list(car.cut_objs):   # one boolean per cutter: the pocket, curtain slot and arch overlap, and one EXACT pass over them tears
    car.cut_objs = [c]; car.apply_cuts()
car.recolor('CARBON', lambda gx, gy, gz, n: gy < kf(YB, gz) + .07 and -1.0 < gz < 1.0)                         # black sill blades
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: gz < -.85 and gx < .4 and n[1] > .5 and gy > .7)             # engine cover
car.sharpen(car.body, 30); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.6)

# ---- canopy: black teardrop, windscreen far forward in the hood valley, roof tapering to a point over the engine cover
CH = [[-1.0, .95], [-.7, .99], [-.3, 1.03], [.1, 1.07], [.45, 1.05], [.8, .98], [1.1, .9], [1.4, .83]]
car.build_cabin({'CZ0': -1.0, 'CZ1': 1.4, 'CH': CH, 'dlo': (1.34, .8, -.55, -.25), 'rear_glass': -.65, 'dlo_trim': None,
    'cw': lambda z: kf([[-1.0, .32], [-.6, .54], [-.1, .64], [.6, .64], [1.1, .6], [1.4, .56]], z),
    'rw': lambda z: kf([[-1.0, .14], [-.6, .32], [-.1, .46], [.5, .48], [1.0, .42], [1.4, .38]], z)})
for p in car.cabin.data.polygons:   # the whole greenhouse is black: roof panel in gloss black, glass stays glass
    if p.material_index == 0: p.material_index = 2

# ---- lamps: LED blade inside each headlight slot, red rings around the tunnels, a red bar in the diffuser
for sd in (1, -1):
    car.tube(f'head{sd}', [(x, y, z - .02) for x, y, z in HEADL[sd][1:-1]], .014, 'HEAD')
    car.tube(f'tailring{sd}', RING[sd], .011, 'TAIL', res=2)
car.tube('diffbar', [(0, .12, -1.9), (0, .36, -1.86)], .008, 'TAIL')

# ---- aero: splitter, diffuser strakes, integrated blade wing between the haunches
lip = [(-.8, 2.12)] + [(math.sin(a) * .8, 2.3 + math.cos(a) * .27) for a in [(-math.pi / 2) + math.pi * k / 24 for k in range(25)]] + [(.8, 2.12)]
car.extrude_y('Lip', lip, .07, .085, 'CARBON')
for x in (-.66, -.4, -.14, .14, .4, .66):
    car.extrude_x(f'fin{x}', [(-1.62, .08), (-2.04, .06), (-2.04, .3), (-1.7, .36)], x - .008, x + .008, 'CARBON')
foil = [(-1.6, .935), (-1.68, .952), (-1.8, .956), (-1.92, .944), (-1.96, .93), (-1.82, .928), (-1.68, .926)]
car.extrude_x('Wing', foil, -.8, .8, 'PAINT', smooth_=True)
car.extrude_x('WingUnder', [(z, y - .012) for z, y in foil], -.78, .78, 'GLOSSBLACK', smooth_=True)
for x in (-.3, .3):
    dy = car.surf_y(x, -1.75) or .86
    car.box(f'wpost{x}', (.02, max(.02, .93 - dy), .12), (x, (.93 + dy) / 2, -1.75), 'GLOSSBLACK')
for k in range(7):  # engine cover louvers
    z = -1.05 - k * .1; y = (car.surf_y(0, z) or .86) + .006
    car.box(f'louver{k}', (.6, .008, .03), (0, y, z), 'CARBON', rot=(.15, 0, 0))
# ---- details: camera pods, badge, charge-port marks
for sd in (1, -1):
    mz = 1.08; my = car.belt(mz) + .03; mx = car.C['cw'](mz)
    car.tube(f'pstalk{sd}', [(sd * (mx - .02), my - .02, mz), (sd * (mx + .08), my + .01, mz - .02)], .009, 'GLOSSBLACK', res=4)
    car.sphere(f'pod{sd}', (sd * (mx + .12), my + .02, mz - .04), 1., 'GLOSSBLACK', scale=(.05, .03, .07), seg=16)
car.sphere('badge', (0, .44, (car.surf_front(0, .44) or 2.5) - .005), 1., 'CHROME', scale=(.035, .022, .01), seg=16)
for k in range(3):
    car.box(f'port{k}', (.05, .006, .012), (.3, .56 - k * .018, (car.surf_back(.3, .56) or -1.96) - .004), 'GLOSSBLACK')
car.extrude_y('Floor', [(-.84, -1.6), (.84, -1.6), (.84, 2.0), (-.84, 2.0)], .09, .1, 'GLOSSBLACK')
objs = car.objs(); result = car.stats(); print(result)
