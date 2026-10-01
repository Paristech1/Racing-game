"""AFTERHOURS — WISP 07 (v3), built in Blender on carlib.py from Paris's three reference renders (side profile, three-view
sheet, clay rear three-quarter). A gloss-black five-door time-attack hatch: flat-faced bolt-on over-fenders with rivets
(no rounded humps), a hawk-eye nose with a hex grille and a wide lower mouth, a top-mount hood scoop, carbon splitter
and canards, a lime-green roll cage behind tinted glass, lime trim on the splitter, skirts and shoulder, a vented rear
quarter, and a time-attack wing on swan necks over the hatch. Still the triple e-motor EV, so no exhaust.
Wheels (BODIES.wisp): x +-.92, z +-1.42, r .38.
Live (MCP) or headless (pip bpy): exec carlib.py, then this file in the same namespace."""
car = Car('Wisp 07', paint=(.006, .006, .007), accent=(.62, 1., .05))
DETAIL = globals().get('DETAIL', 1)

def mk(name, col, metal=0., rough=.5, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
car.M['LIME'] = mk('LIME', (.5, 1., .02), 0., .25, emit=(.5, 1., .02), strength=.6)   # lime paint: cage, trim, pinstripes
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)                         # cabin tub, headliner, seats' cloth
car.M['RED'] = mk('RED', (.8, .02, .02), 0., .4)                                         # tow straps
car.M['PAINT'].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .12

# ---------------------------------------------------------------- stock body (the five-door shell under the kit)
# measured off the side reference: ground to roof 1.46 m, wheelbase ~2.84 m, short overhangs, belt ~1.0 m, raked screen
Z0, Z1, WB, WR = -2.18, 2.24, 1.42, .38
HW = [[-2.18, .74], [-2.1, .84], [-1.9, .88], [-1.42, .895], [-.6, .895], [0, .89], [.6, .895], [1.42, .895], [1.85, .885], [2.0, .91], [2.12, .9], [2.19, .875], [2.24, .8]]
YB = [[-2.18, .36], [-2.06, .22], [-1.8, .17], [1.8, .17], [2.06, .2], [2.24, .26]]
YS = [[-2.18, .9], [-2.0, .93], [-1.4, .93], [-.6, .91], [.4, .89], [.9, .87], [1.5, .82], [1.95, .74], [2.14, .66], [2.24, .56]]
YT = [[-2.18, 1.0], [-2.12, 1.04], [-2.0, 1.05], [-1.4, 1.04], [-.6, 1.01], [.3, .99], [.85, .96], [1.3, .92], [1.75, .86], [2.0, .8], [2.14, .74], [2.24, .64]]
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .06, 'Rx': .06, 'NS': 320 if DETAIL else 160,
    'round_nose': .065, 'round_tail': .06, 'bulge_at': .55,
    'swage': (lambda z: .62, lambda z: smooth(.98, .8, z) * smooth(-1.0, -.82, z), .012),
    'dome': lambda x, z: .022 * smooth(.95, 1.3, z) * (1 - smooth(1.9, 2.1, z)) * math.exp(-((abs(x) - .3) / .12) ** 2),
    'lean': lambda y, z: -.03 * smooth(2.1, 2.24, z) * (car.h_of(y, z) - .5) - .03 * smooth(-2.0, -2.18, z) * (car.h_of(y, z) - .5)})
SKIN0 = bpy.data.objects.new('Skin0', car.body.data.copy()); car.scene.collection.objects.link(SKIN0)   # uncut skin, for normals
def skin_normals():
    """The exact booleans leave long sliver triangles around every cut; smooth normals interpolated across them show up as
    folds in gloss paint. Copy each paint loop's normal from the uncut skin instead, so the panels shade as one surface."""
    me = car.body.data; vg = car.body.vertex_groups.get('skin') or car.body.vertex_groups.new(name='skin')
    keep = set()
    for p_ in me.polygons:
        if me.materials[p_.material_index].name.split('.')[0] in ('PAINT', 'INTERIOR'): keep.update(p_.vertices)
    vg.add(list(keep), 1., 'REPLACE')
    mod = car.body.modifiers.new('skinN', 'DATA_TRANSFER'); mod.object = SKIN0; mod.use_loop_data = True
    mod.data_types_loops = {'CUSTOM_NORMAL'}; mod.loop_mapping = 'POLYINTERP_NEAREST'; mod.vertex_group = 'skin'
    nm = bpy.data.meshes.new_from_object(car.body.evaluated_get(car.DG())); car.body.modifiers.clear(); om = car.body.data; car.body.data = nm; bpy.data.meshes.remove(om)
    car.body.vertex_groups.clear()
ARCH_R = .43
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R - .005, sd * .62, sd * 1.4)
car.apply_cuts()
car.sharpen(car.body, 28); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R - .005, x0=.5, x1=1.1)

# ---------------------------------------------------------------- bolt-on over-fenders: flat slab faces, chamfered edges, rivets
XF = 1.065                                     # outer face of the flares (tires sit flush under it)
def ray_poly(c, d, poly):
    best = None
    for i in range(len(poly)):
        (az, ay), (bz, by) = poly[i], poly[(i + 1) % len(poly)]
        ez, ey = bz - az, by - ay; den = d[0] * ey - d[1] * ez
        if abs(den) < 1e-9: continue
        t = ((az - c[0]) * ey - (ay - c[1]) * ez) / den; u = ((az - c[0]) * d[1] - (ay - c[1]) * d[0]) / den
        if t > 0 and -1e-6 <= u <= 1 + 1e-6 and (best is None or t < best): best = t
    return best
def flare(name, zc, outline, ycut=.17, nth=150, rivets=True):
    """outline: (z, y) polygon of the slab seen from the side. The face sits at XF, rolls into an arch lip and runs back
    into the wheel well; the outer edge has a crisp chamfer that tucks under the body skin."""
    r = ARCH_R; th0 = math.asin(clamp((ycut - WR) / r, -1, 1)); th1 = math.pi - th0
    xb = lambda y, z: (car.surf_side(y, z, 1) or .9)
    xf = lambda y: XF - .03 * smooth(.62, .9, y) + .006 * smooth(.5, .2, y)
    for sd in (1, -1):
        rows = []
        for k in range(nth + 1):
            th = lerp(th0, th1, k / nth); d = (math.cos(th), math.sin(th)); I = (zc + r * d[0], WR + r * d[1])
            L = ray_poly(I, d, outline) or .08; O = (I[0] + d[0] * L, I[1] + d[1] * L)
            P = lambda s: (I[0] + d[0] * s, I[1] + d[1] * s)
            row = []
            for s, dx in ((0, -.36), (0, -.12), (0, -.03), (.006, -.008), (.02, 0)):
                z, y = P(s); row.append((xf(y) + dx, y, z))
            for t in [j / 6 for j in range(1, 6)]:
                z, y = P(lerp(.03, L - .03, t)); row.append((xf(y) + .004 * math.sin(math.pi * t), y, z))
            for s, dx in ((L - .014, -.002), (L - .004, -.014), (L, -.03)):
                z, y = P(s); row.append((xf(y) + dx, y, z))
            z, y = P(L + .012); row.append((min(xf(y) - .06, xb(y, z) - .015), y, z))
            rows.append([(sd * x, y, z) for x, y, z in row])
        n = len(rows[0]); verts = [G(*p) for r_ in rows for p in r_]; faces = []
        for i in range(len(rows) - 1):
            for j in range(n - 1):
                a = i * n + j; f = (a, a + 1, a + n + 1, a + n); faces.append(f if sd > 0 else tuple(reversed(f)))
        ob = car.new_obj(f'{name}{sd}', verts, faces, 'PAINT'); car.sharpen(ob, 30)
        if rivets:     # a rivet line just inside the outer edge, and one around the lip
            acc = 0.; last = None
            for k in range(0, nth + 1):
                th = lerp(th0, th1, k / nth); d = (math.cos(th), math.sin(th)); I = (zc + r * d[0], WR + r * d[1])
                L = ray_poly(I, d, outline) or .08
                for s, tag in ((L - .03, 'o'),):
                    if s < .05: continue
                    z, y = I[0] + d[0] * s, I[1] + d[1] * s
                    if y < ycut + .05: continue
                    if last and math.hypot(z - last[0], y - last[1]) < .1: continue
                    last = (z, y); car.sphere(f'rivet{name}{sd}{k}{tag}', (sd * (xf(y) + .002), y, z), 1., 'SATIN', scale=(.006, .011, .011), seg=10)
FRONT_FL = [(.86, .12), (.85, .5), (.9, .72), (1.08, .88), (1.72, .9), (1.89, .82), (1.98, .62), (2.02, .32), (2.01, .12)]
REAR_FL = [(-.86, .12), (-.86, .5), (-.93, .74), (-1.12, .9), (-1.74, .9), (-1.9, .8), (-1.94, .62), (-1.9, .12)]
flare('flareF', WB, FRONT_FL); flare('flareR', -WB, REAR_FL)

# ---------------------------------------------------------------- cabin: tall hatch glasshouse, near-vertical tailgate
CH = [[-2.12, 1.05], [-2.08, 1.2], [-2.01, 1.35], [-1.92, 1.43], [-1.72, 1.462], [-1.0, 1.47], [-.2, 1.47], [.2, 1.45], [.5, 1.32], [.75, 1.17], [.92, 1.03]]
car.build_cabin({'CZ0': -2.12, 'CZ1': .92, 'CH': CH, 'dlo': (.88, .62, -1.72, -1.52), 'rear_glass': -1.84, 'dlo_trim': 'GLOSSBLACK',
    'pillars': [(-.1, .04), (-1.26, -1.2)], 'apillar_r': .02,
    'cw': lambda z: kf(HW, z) - .1 - .05 * smooth(-1.8, -2.12, z) - .05 * smooth(.55, .92, z),
    'rw': lambda z: kf(HW, z) - .29 - .07 * smooth(-1.7, -2.1, z) - .09 * smooth(.2, .92, z)})

# ---------------------------------------------------------------- helpers for this build
def prism_z(name, poly_xy, z0, z1, m, smooth_=False):
    n = len(poly_xy); verts = [G(x, y, z0) for x, y in poly_xy] + [G(x, y, z1) for x, y in poly_xy]
    faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    ob = car.new_obj(name, verts, faces, m, smooth_); car.fixn(ob); return ob
def grid(name, P, nu, nv, m, flip=False):   # P(u, v) -> (x, y, z) in game space
    verts = [G(*P(i / nu, j / nv)) for i in range(nu + 1) for j in range(nv + 1)]; faces = []
    for i in range(nu):
        for j in range(nv):
            a = i * (nv + 1) + j; f = (a, a + nv + 1, a + nv + 2, a + 1); faces.append(tuple(reversed(f)) if flip else f)
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob); return ob
def side_band(name, sd, y0f, y1f, z0f, z1f, m, off=.003, nz=60, nv=3):
    """a decal-thin band laid on the flank: y0f/y1f(t) bottom/top heights, z0f/z1f(v) slanted ends (v=0 bottom .. 1 top)"""
    def P(t, v):
        z = lerp(z0f(v), z1f(v), t); y = lerp(y0f(t), y1f(t), v); x = (car.surf_side(y, z, sd) or .9) + off
        return (sd * x, y, z)
    return grid(name, P, nz, nv, m, flip=sd < 0)
def wing_foil(chord, thick, n=24):   # cambered airfoil (z, y) from the leading edge, z running rearward
    up, lo = [], []
    for k in range(n + 1):
        t = k / n; xc = (1 - math.cos(math.pi * t)) / 2
        yt = 5 * thick * (.2969 * math.sqrt(xc) - .126 * xc - .3516 * xc ** 2 + .2843 * xc ** 3 - .1036 * xc ** 4)
        yc = .06 * (2 * .4 * xc - xc * xc) / .16 if xc < .4 else .06 * (1 - 2 * .4 + 2 * .4 * xc - xc * xc) / .36
        up.append((-xc * chord, (yc + yt) * chord)); lo.append((-xc * chord, (yc - yt) * chord))
    return up + list(reversed(lo[1:-1]))

# ---------------------------------------------------------------- nose: hawk-eye lamps, hex grille, wide lower mouth, corner intakes
BV0 = car.BV()   # the uncut skin: lamps and trims are placed against this, not against the floors of their own pockets
def FZ(x, y):
    h = BV0.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else 2.1
def BZ(x, y):
    h = BV0.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else -2.1
HEAD_L = [(.4, .715), (.6, .745), (.8, .775), (.83, .73), (.76, .66), (.47, .625)]
HEX = [(-.33, .695), (.33, .695), (.42, .6), (.34, .5), (-.34, .5), (-.42, .6)]
LOWER = [(-.58, .44), (.58, .44), (.64, .34), (.58, .27), (-.58, .27), (-.64, .34)]
def resample(poly, per=10):
    out = []
    for i in range(len(poly)):
        (ax, ay), (bx, by) = poly[i], poly[(i + 1) % len(poly)]
        for k in range(per): out.append((lerp(ax, bx, k / per), lerp(ay, by, k / per)))
    return out
def pocket(name, poly, depth, m='GLOSSBLACK', back=False, per=10):
    """a recess that follows the curved nose/tail: every rim point is pushed `depth` into the skin under it"""
    pts = resample(poly, per); n = len(pts); S = (lambda x, y: BZ(x, y)) if back else (lambda x, y: FZ(x, y)); sg = -1 if back else 1
    fr = [G(x, y, S(x, y) + sg * .25) for x, y in pts]; bk = [G(x, y, S(x, y) - sg * depth) for x, y in pts]
    cx = sum(p[0] for p in pts) / n; cy = sum(p[1] for p in pts) / n
    verts = fr + bk + [G(cx, cy, S(cx, cy) + sg * .25), G(cx, cy, S(cx, cy) - sg * depth)]
    faces = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [(2 * n, (i + 1) % n, i) for i in range(n)] + [(2 * n + 1, n + i, n + (i + 1) % n) for i in range(n)]
    ob = car.new_obj(name, verts, faces, m, False); car.fixn(ob); return car.cutter(ob, m)
for sd in (1, -1):
    pocket(f'head{sd}', [(sd * x, y) for x, y in HEAD_L], .06)
    pocket(f'corner{sd}', [(sd * x, y) for x, y in [(.66, .52), (.8, .54), (.81, .33), (.69, .31)]], .07)
pocket('hexgrille', HEX, .08)
pocket('lowermouth', LOWER, .09)
# ---- tail: lamp pockets wrapping the corners, hatch pocket for the plate, vented rear quarters behind the flares
TAIL_L = [(.4, .93), (.8, .935), (.86, .9), (.85, .8), (.6, .79), (.4, .84)]
for sd in (1, -1):
    pocket(f'tail{sd}', [(sd * x, y) for x, y in TAIL_L], .035, back=True)
    car.side_prism(f'qvent{sd}', [(-1.93, .3), (-2.25, .3), (-2.25, .66), (-1.95, .64)], sd * .66, sd * 1.4, 'GLOSSBLACK')
pocket('plate', Car.rounded(0, .63, .56, .16, .02), .03, back=True, per=3)
pocket('rearmouth', [(-.62, .2), (.62, .2), (.6, .34), (-.6, .34)], .09, back=True)
# ---- shut lines: hood, four doors, tailgate, fuel door
for sd in (1, -1):
    for z0, ln in ((.84, -.03), (-.02, .0), (-.83, .03)):
        pts = []
        for k in range(14):
            y = lerp(.2, kf(YT, z0) - .05, k / 13)
            z = z0 + ln * (y - .2); x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        car.strip_cut(f'door{sd}{z0}', pts, .0035, .012)
    pts = []
    for k in range(16):
        z = lerp(.98, 2.0, k / 15); x = sd * lerp(.74, .7, k / 15); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0035, .012, axis='top')
car.apply_cuts()
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: gz < -1.95 and gy < .2)                  # rear valance
car.sharpen(car.body, 30); car.bvh = car.BV()

# ---- lamps: projector pairs, a C-shaped LED blade, lens covers; fog lamps in the corner intakes
for sd in (1, -1):
    for x, r in ((.56, .042), (.7, .046)):
        y = .69 + (x - .56) * .12; z = FZ(sd * x, y) - .055
        car.cyl(f'bez{sd}{x}', (sd * x, y, z - .02), (sd * x, y, z + .015), r + .012, 'CHROME', seg=32)
        car.cyl(f'proj{sd}{x}', (sd * x, y, z + .01), (sd * x, y, z + .022), r, 'HEAD', seg=32)
    c = [(.47, .645), (.62, .65), (.8, .675), (.85, .73)]
    car.tube(f'drl{sd}', [(sd * x, y, FZ(sd * x, y) - .03) for x, y in c], .007, 'HEAD')
    car.tube(f'drl_up{sd}', [(sd * .43, .705, FZ(sd * .43, .705) - .03), (sd * .6, .735, FZ(sd * .6, .735) - .03), (sd * .82, .77, FZ(sd * .82, .77) - .03)], .005, 'HEAD')
    y, x = .38, .75; z = FZ(sd * x, y) - .05
    car.cyl(f'fog{sd}', (sd * x, y, z), (sd * x, y, z + .02), .038, 'HEAD', seg=24)
    car.cyl(f'fogb{sd}', (sd * x, y, z - .01), (sd * x, y, z + .012), .05, 'CHROME', seg=24)
    car.box(f'cslat{sd}', (.012, .25, .05), (sd * .68, .39, FZ(sd * .7, .39) - .035), 'LIME', rot=(0, 0, -sd * .1))
    # tail lamps: twin C blades, a lit lower bar, smoked lens
    tc = [(.44, .905), (.78, .91), (.83, .88), (.8, .83), (.6, .825)]
    car.tube(f'tailC{sd}', [(sd * x, y, BZ(sd * x, y) + .025) for x, y in tc], .011, 'TAIL')
    car.tube(f'tailI{sd}', [(sd * x, y, BZ(sd * x, y) + .03) for x, y in ((.5, .86), (.72, .865), (.76, .85))], .006, 'TAIL')
    grid(f'tlens{sd}', lambda u, v, sd=sd: (sd * lerp(.42, .84, u), lerp(.8, .925, v), BZ(sd * lerp(.42, .84, u), lerp(.8, .925, v)) - .003), 16, 4, 'LENS', flip=sd < 0)
for sd in (1, -1):   # tailgate shut line: up the tail face beside the plate and across under the lamps
    car.tube(f'gateS{sd}', [(sd * .38, y, BZ(sd * .38, y) - .001) for y in [lerp(.47, .99, k / 8) for k in range(9)]], .0035, 'GAP', res=2)
car.tube('gateB', [(x, .47, BZ(x, .47) - .001) for x in [lerp(-.38, .38, k / 10) for k in range(11)]], .0035, 'GAP', res=2)
car.tube('bumperL', [(x, .44, BZ(x, .44) - .001) for x in [lerp(-.86, .86, k / 20) for k in range(21)]], .003, 'GAP', res=2)
# honeycomb in the hex grille and the lower mouth
def honey(name, poly, zf, cell=.042, depth=.025):
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]; k = 0
    def inside(x, y):
        c = False
        for i in range(len(poly)):
            (ax, ay), (bx, by) = poly[i], poly[(i + 1) % len(poly)]
            if (ay > y) != (by > y) and x < ax + (y - ay) * (bx - ax) / (by - ay): c = not c
        return c
    row = 0; y = min(ys) + cell * .5
    while y < max(ys):
        x = min(xs) + (cell * .5 if row % 2 else 0)
        while x < max(xs):
            if inside(x, y) and inside(x + cell * .45, y) and inside(x - cell * .45, y):
                z = zf(x, y); hexo = [(x + cell * .5 * math.cos(math.pi / 6 + a * math.pi / 3), y + cell * .5 * math.sin(math.pi / 6 + a * math.pi / 3)) for a in range(6)]
                hexi = [(x + cell * .36 * math.cos(math.pi / 6 + a * math.pi / 3), y + cell * .36 * math.sin(math.pi / 6 + a * math.pi / 3)) for a in range(6)]
                verts = [G(px, py, z) for px, py in hexo] + [G(px, py, z) for px, py in hexi] + [G(px, py, z - depth) for px, py in hexo] + [G(px, py, z - depth) for px, py in hexi]
                faces = [(a, (a + 1) % 6, 6 + (a + 1) % 6, 6 + a) for a in range(6)] + [(6 + a, 6 + (a + 1) % 6, 18 + (a + 1) % 6, 18 + a) for a in range(6)]
                car.new_obj(f'{name}{k}', verts, faces, 'SATIN', False); k += 1
            x += cell * math.sqrt(3) * .58
        y += cell * .75; row += 1
honey('hc', [(x * .97, (y - .6) * .94 + .6) for x, y in HEX], lambda x, y: FZ(0, .6) - .06)
honey('hl', [(x * .97, (y - .33) * .9 + .33) for x, y in LOWER], lambda x, y: FZ(0, .33) - .07, cell=.05)
car.box('mouthbar', (1.2, .022, .03), (0, .335, FZ(0, .335) - .03), 'LIME')                   # lime slat across the lower mouth
for sd in (1, -1):
    for k in range(4):
        y = .5 - k * .06; z = FZ(sd * .75, y) - .045
        car.box(f'cfin{sd}{k}', (.1, .006, .05), (sd * .75, y, z), 'SATIN', rot=(.3, 0, -sd * .1))

# ---- aero: carbon splitter with a lime edge, end fences, canards, tow strap
SPL = [(-.98, 1.92)] + [(math.sin(a) * .98, 2.2 + math.cos(a) * .14) for a in [(-math.pi / 2) + math.pi * k / 30 for k in range(31)]] + [(.98, 1.92)]
car.extrude_y('Splitter', SPL, .115, .14, 'CARBON')
car.tube('splitEdge', [(x, .128, z + .004 * (1 if z > 2.1 else 0)) for x, z in SPL[1:-1]], .012, 'LIME', res=4)
for sd in (1, -1):
    car.extrude_x(f'fence{sd}', [(1.94, .14), (2.3, .14), (2.24, .26), (2.0, .3)], sd * .955, sd * .97, 'CARBON')
    for k, (y, z0, z1) in enumerate(((.3, 2.02, 2.2), (.44, 1.98, 2.14))):
        x0 = (car.surf_side(y, z0 - .02, sd) or .95) - .03
        car.extrude_x(f'canard{sd}{k}', [(z0, y + .03), (z1, y - .015), (z1, y - .03), (z0, y + .015)], sd * x0, sd * (x0 + .17), 'CARBON')
car.extrude_x('towF', [(2.16, .26), (2.3, .26), (2.3, .3), (2.16, .3)], -.48, -.44, 'RED')

# ---- hood: top-mount scoop and two louvered vents
SC = []
for k in range(40):
    z = lerp(1.88, 1.18, k / 39); h = .085 * smooth(1.18, 1.75, z) * (1 - .25 * smooth(1.8, 1.88, z))
    w = lerp(.3, .24, smooth(1.88, 1.2, z)); ring = []
    for j in range(25):
        a = math.pi * j / 24; x = -math.cos(a) * w; yb_ = car.surf_y(x, z) or .9
        ring.append(G(x * (1 - .12 * math.sin(a) ** 4), yb_ - .02 + (h + .02) * math.sin(a) ** .6, z))
    SC.append(ring)
car.loft('Scoop', SC, 'PAINT')
zf = 1.875
grid('scoopmouth', lambda u, v: ((u - .5) * .52, (car.surf_y((u - .5) * .52, zf) or .86) + .004 + .072 * v * (1 - (2 * u - 1) ** 4) ** .5, zf + .006), 20, 4, 'GAP')
for sd in (1, -1):
    for k in range(7):
        z = 1.62 + k * .045; x0, x1 = sd * .44, sd * .66; y = car.surf_y(sd * .55, z) or .85
        car.box(f'louv{sd}{k}', (.22, .006, .03), (sd * .55, y + .004, z), 'CARBON', rot=(-.5, 0, 0))
    grid(f'louvbed{sd}', lambda u, v, sd=sd: (sd * lerp(.43, .67, u), (car.surf_y(sd * lerp(.43, .67, u), lerp(1.59, 1.93, v)) or .85) - .004, lerp(1.59, 1.93, v)), 6, 8, 'GAP', flip=sd < 0)
# lime pinstripe along the fender shoulder, headlamp to A-pillar
for sd in (1, -1):
    pts = []
    for k in range(40):
        z = lerp(2.02, .9, k / 39); x = sd * lerp(.8, .82, k / 39); y = car.surf_y(x, z)
        if y: pts.append((x, y + .003, z))
    car.tube(f'pin{sd}', pts, .0055, 'LIME', res=3)

# ---- flanks: carbon skirts with a lime lower edge, lime slash graphic, mirrors, handles
for sd in (1, -1):
    car.extrude_y(f'skirt{sd}', [(sd * .84, -.88), (sd * 1.0, -.88), (sd * 1.0, .88), (sd * .84, .88)], .1, .205, 'CARBON')
    car.extrude_y(f'skirtLip{sd}', [(sd * .96, -.88), (sd * 1.02, -.88), (sd * 1.02, .88), (sd * .96, .88)], .1, .114, 'LIME')
    side_band(f'slashA{sd}', sd, lambda t: .3, lambda t: .335, lambda v: .72 - .08 * v, lambda v: -.62 - .08 * v, 'LIME')
    side_band(f'slashB{sd}', sd, lambda t: .355, lambda t: .37, lambda v: .5 - .05 * v, lambda v: -.2 - .05 * v, 'LIME')
    for z in (.32, -.6):
        y = .84; x = car.surf_side(y, z, sd)
        if x: car.box(f'handle{sd}{z}', (.016, .022, .15), (sd * (x + .004), y, z), 'GLOSSBLACK')
    mz = .76; my = car.belt(mz) + .05; mx = car.C['cw'](mz)
    car.tube(f'mstalk{sd}', [(sd * (mx - .03), my - .04, mz + .02), (sd * (mx + .05), my - .01, mz - .01), (sd * (mx + .09), my + .02, mz - .04)], .012, 'GLOSSBLACK', res=4)
    car.sphere(f'mcap{sd}', (sd * (mx + .15), my + .05, mz - .07), 1., 'GLOSSBLACK', scale=(.1, .055, .07), seg=24)
    # quarter vent cage behind the rear flare: three bars and a post, exposed like a time-attack car
    for y in (.38, .47, .56):
        car.cyl(f'qbar{sd}{y}', (sd * .78, y, -1.94), (sd * .78, y, -2.2), .014, 'SATIN', seg=10)
    car.cyl(f'qpost{sd}', (sd * .78, .31, -2.06), (sd * .78, .64, -2.06), .014, 'SATIN', seg=10)
    car.extrude_x(f'qback{sd}', [(-1.9, .28), (-2.25, .28), (-2.25, .68), (-1.9, .68)], sd * .66, sd * .68, 'GAP')

# ---- tail: diffuser (no exhaust: the Wisp is a triple e-motor EV), tow strap, roof spoiler and the swan-neck wing
for k in range(7):
    x = -.6 + k * .2; car.extrude_x(f'dfin{k}', [(-1.7, .12), (-2.24, .12), (-2.24, .34), (-2.0, .3)], x - .008, x + .008, 'CARBON')
car.extrude_y('diffuser', [(-.72, -1.7), (.72, -1.7), (.72, -2.24), (-.72, -2.24)], .115, .13, 'CARBON')
car.tube('diffEdge', [(-.72, .122, -2.245), (.72, .122, -2.245)], .009, 'LIME', res=3)
car.box('rainlight', (.16, .05, .02), (0, .245, BZ(0, .245) + .06), 'TAIL')
car.extrude_x('towR', [(-2.14, .3), (-2.3, .3), (-2.3, .34), (-2.14, .34)], -.42, -.38, 'RED')
# roof spoiler lip over the hatch
RS = [(-1.86, 1.468), (-1.98, 1.46), (-2.08, 1.43), (-2.1, 1.41), (-2.0, 1.42), (-1.86, 1.44)]
car.extrude_x('roofspoiler', RS, -.6, .6, 'PAINT', smooth_=True)
# wing: cambered foil on swan necks that hook over its top, cut endplates, gurney
FOIL = [(z - 1.9, y + 1.62) for z, y in wing_foil(.38, .12, 30)]
car.extrude_x('Wing', [(z, y) for z, y in FOIL], -.84, .84, 'CARBON', smooth_=True)
car.extrude_x('gurney', [(-2.272, 1.6), (-2.282, 1.6), (-2.282, 1.64), (-2.272, 1.64)], -.84, .84, 'CARBON')
EP = [(-1.84, 1.55), (-2.3, 1.53), (-2.32, 1.71), (-2.18, 1.73), (-1.9, 1.67)]
for sd in (1, -1):
    car.extrude_x(f'endplate{sd}', EP, sd * .84, sd * .855, 'CARBON')
    path = [(-2.02, 1.38), (-2.07, 1.52), (-2.1, 1.64), (-2.06, 1.7), (-1.98, 1.71), (-1.94, 1.68)]
    pts = []
    for i, (z, y) in enumerate(path):
        a = path[max(0, i - 1)]; b = path[min(len(path) - 1, i + 1)]; tz, ty = b[0] - a[0], b[1] - a[1]; L = math.hypot(tz, ty); nz, ny = -ty / L, tz / L
        pts.append((z + nz * .02, y + ny * .02))
    back = []
    for i, (z, y) in reversed(list(enumerate(path))):
        a = path[max(0, i - 1)]; b = path[min(len(path) - 1, i + 1)]; tz, ty = b[0] - a[0], b[1] - a[1]; L = math.hypot(tz, ty); nz, ny = -ty / L, tz / L
        back.append((z - nz * .02, y - ny * .02))
    car.extrude_x(f'neck{sd}', pts + back, sd * .34, sd * .36, 'CARBON')
    car.extrude_x(f'neckfoot{sd}', [(-1.96, 1.36), (-2.1, 1.36), (-2.1, 1.42), (-1.96, 1.44)], sd * .32, sd * .38, 'CARBON')
car.extrude_x('sharkfin', [(-1.5, 1.468), (-1.72, 1.468), (-1.66, 1.53)], -.03, .03, 'GLOSSBLACK', smooth_=True)

# ---------------------------------------------------------------- inside: headliner, floor, buckets, wheel, dash and the lime cage
cab = car.cabin; me = cab.data
import bmesh as _bm
bm = _bm.new(); bm.from_mesh(me)
gl = [f for f in bm.faces if f.material_index == 1]; _bm.ops.delete(bm, geom=gl, context='FACES')
for v in bm.verts:   # pull every vertex in toward the cabin axis, then flip so the faces look inward
    c = Vector((0, v.co.y, 1.12)); v.co = c + (v.co - c) * .965
_bm.ops.reverse_faces(bm, faces=bm.faces)
for f in bm.faces: f.material_index = 0
lin = bpy.data.meshes.new('Liner'); bm.to_mesh(lin); bm.free(); lin.materials.append(car.M['INTERIOR'])
car.link(bpy.data.objects.new('Liner', lin))
car.recolor('INTERIOR', lambda gx, gy, gz, n: n[1] > .5 and gx < car.C['cw'](gz) - .01 and -2.05 < gz < .88 and gy > .85)
for sd in (1, -1):   # bucket seats: shell, bolsters, harness slots
    x = sd * .36
    car.box(f'seatback{sd}', (.46, .78, .07), (x, 1.02, -.36), 'CARBON', rot=(-.22, 0, 0))
    for e in (1, -1): car.box(f'bolster{sd}{e}', (.07, .62, .16), (x + e * .21, .98, -.31), 'CARBON', rot=(-.22, 0, 0))
    car.box(f'headrest{sd}', (.3, .2, .08), (x, 1.36, -.43), 'CARBON', rot=(-.22, 0, 0))
    car.box(f'cushion{sd}', (.4, .07, .46), (x, .78, -.08), 'INTERIOR')
    for e in (1, -1): car.box(f'belt{sd}{e}', (.05, .5, .012), (x + e * .07, 1.1, -.31), 'RED', rot=(-.22, 0, 0))
car.box('dash', (1.62, .12, .32), (0, 1.0, .66), 'INTERIOR', rot=(.25, 0, 0))
sw = [(.36 + .17 * math.cos(2 * math.pi * k / 24), 1.06 + .17 * math.sin(2 * math.pi * k / 24) * .92, .42 + .17 * math.sin(2 * math.pi * k / 24) * .38) for k in range(25)]
car.tube('steer', sw, .016, 'GLOSSBLACK', res=4)
car.cyl('column', (.36, 1.02, .44), (.36, .94, .66), .025, 'GLOSSBLACK', seg=12)
# cage: main hoop behind the seats, A-pillar bars, roof rails, rear stays, a harness bar, door bars and a rear X
def cp(z, u, inset=.06):
    x, y = car.ring_pt(z, u, -inset); return x, y
def hoop(z, inset=.06, n=24):
    half = [cp(z, .02 + .98 * k / n, inset) for k in range(n + 1)]
    return [(x, y - .0, z) for x, y in half] + [(-x, y, z) for x, y in reversed(half[:-1])]
R_ = .021
MZ, BZ_ = -.12, -1.62
car.tube('mainhoop', [(x, y, z) for x, y, z in hoop(MZ)], R_, 'LIME', res=8)
car.tube('rearhoop', [(x, y, z) for x, y, z in hoop(BZ_, .08)], R_, 'LIME', res=8)
for sd in (1, -1):
    ap = [(sd * cp(car.a_line(u), u, .07)[0], cp(car.a_line(u), u, .07)[1], car.a_line(u) - .05) for u in [.02 + .58 * k / 12 for k in range(13)]]
    rail = [(sd * cp(z, .6, .07)[0], cp(z, .6, .07)[1], z) for z in [lerp(ap[-1][2], MZ, k / 8) for k in range(9)]]
    car.tube(f'apbar{sd}', ap + rail[1:], R_, 'LIME', res=8)
    car.tube(f'rrail{sd}', [(sd * cp(z, .6, .08)[0], cp(z, .6, .08)[1], z) for z in [lerp(MZ, BZ_, k / 10) for k in range(11)]], R_, 'LIME', res=8)
    x0, y0 = cp(MZ, .04); x1, y1 = cp(car.a_line(.04), .04, .07)
    car.tube(f'doorbar{sd}', [(sd * x0, y0 + .02, MZ), (sd * (x0 + .02), lerp(y0, y1, .5) - .08, lerp(MZ, car.a_line(.04), .5)), (sd * x1, y1, car.a_line(.04) - .05)], R_, 'LIME', res=8)
    xa, ya = cp(MZ, .58); xb, yb = cp(-1.98, .04, .1)
    car.tube(f'stay{sd}', [(sd * xa, ya, MZ - .03), (sd * xb, yb + .02, -1.98)], R_, 'LIME', res=8)
    # rear X in the quarter window
    xa, ya = cp(-.75, .05, .07); xb, yb = cp(BZ_, .5, .08)
    car.tube(f'rx{sd}', [(sd * xa, ya, -.75), (sd * xb, yb, BZ_)], R_ * .9, 'LIME', res=8)
xa, ya = cp(MZ, .56); xb, yb = cp(MZ, .06)
car.tube('diag', [(xa, ya, MZ), (-xb, yb, MZ)], R_, 'LIME', res=8)
xa, ya = cp(MZ, .2)
car.tube('harness', [(xa, ya, MZ), (-xa, ya, MZ)], R_, 'LIME', res=8)
xa, ya = cp(.62, .1, .1)
car.tube('dashbar', [(xa, ya, .62), (-xa, ya, .62)], R_, 'LIME', res=8)

skin_normals(); bpy.data.objects.remove(SKIN0)
objs = car.objs(); result = car.stats(); print(result)
print('stations: plate z %.3f, head z %.3f, tail z %.3f, rain z %.3f' % (BZ(0, .63) + .03, FZ(.63, .69), BZ(.64, .87), BZ(0, .245)))
