"""AFTERHOURS — AUTOBAHN 63 (v3), built in Blender on carlib.py from Paris's three references: a four-door fastback GT
three-view sheet (body, nose, flanks), a chrome split-spoke wheel close-up (wheels, built in js/afterhours.js) and a
wide-body rear view (tail). Deep sapphire-blue gloss paint, no underglow.
Front: a big dark oval intake, slim LED blade headlamps above it, tall vertical air curtains in the corners, a thin
carbon splitter blade. Flanks: long hood, cowl behind the front axle, a vertical fender vent, flush handles, carbon sills
with a chrome strip, frameless four-door glasshouse. Rear: clean body-color
flanks into the tail (no wide-body fenders), a carbon rear wing on short struts with its ends rolled into the shoulders, a full-width light bar ending in corner clusters of white-hot LED slashes over a row of red ones, a recessed plate box,
red reflector strips, twin triple rectangular exhaust clusters either side of a finned carbon diffuser.
Wheels (BODIES.autobahn): x +-.8, z +-1.475, r .36.
Live (MCP) or headless (pip bpy): exec carlib.py, then this file in the same namespace."""
car = Car('Autobahn 63', paint=(.012, .045, .30), accent=(1, .05, .06))
DETAIL = globals().get('DETAIL', 1)

def mk(name, col, metal=0., rough=.5, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)
car.M['LENS'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.018, .004, .005, 1)   # smoked lens
car.M['TAILW'] = mk('TAILW', (1., .86, .86), 0., .3, emit=(1., .8, .8), strength=9.)          # white-hot LED slashes in the tail clusters
car.M['GRILLE'] = mk('GRILLE', (.012, .013, .015), .2, .55)                                    # dark satin grille mesh
car.M['REFLECT'] = mk('REFLECT', (.5, .02, .02), 0., .3)                                   # red bumper reflectors (unlit)
pb = car.M['PAINT'].node_tree.nodes['Principled BSDF']; pb.inputs['Metallic'].default_value = .8; pb.inputs['Roughness'].default_value = .14

# ---------------------------------------------------------------- body
# Proportions: Mercedes-AMG GT 63 4-Door (5.05 m long, 2.95 m wheelbase, 1.44 m tall, 1.95 m wide). Every height key
# below is TRACED off Paris's blue AMG side photo (silhouette extracted from the image, scaled by the wheels; see the
# trace notes in the commit): fender crowns ~1.03 at the cowl, a high belt that climbs from 1.0 to 1.14 toward the tail,
# a thin glasshouse whose roof peaks behind the B-pillar and falls in one long arc to a deck at ~1.1, then a short tail
# that rolls over and down to the bumper. Coke-bottle plan, hood domes, a door scallop, round haunches.
Z0, Z1, WB, WR = -2.6, 2.455, 1.475, .36
HW = [[-2.6, .7], [-2.55, .78], [-2.45, .86], [-2.3, .92], [-2.0, .962], [-1.5, .977], [-1.0, .955], [-.4, .925], [.3, .92], [.9, .94],
      [1.475, .962], [1.9, .945], [2.1, .92], [2.25, .87], [2.36, .8], [2.425, .7], [2.455, .58]]   # nose rounds off hard in plan
YB = [[-2.6, .4], [-2.55, .27], [-2.4, .17], [2.2, .18], [2.39, .21], [2.455, .28]]
YT = [[-2.6, .76], [-2.57, .84], [-2.5, .92], [-2.42, 1.0], [-2.33, 1.05], [-2.2, 1.1], [-1.6, 1.11], [-1.0, 1.08], [-.3, 1.055],
      [.5, 1.04], [.95, 1.03], [1.3, 1.005], [1.65, .965], [1.95, .915], [2.15, .865], [2.3, .805], [2.4, .745], [2.455, .67]]   # hood falls evenly cowl -> nose
YS = [[-2.6, .6], [-2.55, .69], [-2.47, .79], [-2.38, .89], [-2.2, .96], [-1.9, 1.02], [-1.6, 1.04], [-1.0, 1.02], [-.3, .995], [.5, .985],
      [.95, .975], [1.475, .945], [1.95, .885], [2.2, .825], [2.38, .755], [2.455, .64]]
def dome(x, z):
    """hood: two low power domes either side of a shallow centre, fading out before the grille"""
    a = abs(x); hz = smooth(.95, 1.3, z) * (1 - smooth(2.0, 2.3, z))
    return .022 * hz * math.exp(-((a - .3) / .14) ** 2) - .01 * hz * (1 - smooth(.1, .25, a))
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .06, 'NS': 460 if DETAIL else 170, 'res': 2 if DETAIL else 1,
    'Rx': lambda z: lerp(.13, .2, smooth(-1.0, -1.8, z)),
    'tumble': lambda z: .085 + .04 * smooth(-.9, -1.6, z) + .025 * smooth(.9, 1.4, z) * (1 - smooth(1.8, 2.2, z)),
    'round_nose': .26, 'round_tail': .16, 'bulge_at': .5, 'dome': dome,
    'feature': lambda z: .013 * smooth(-2.4, -2.1, z) * (1 - smooth(1.95, 2.25, z)),   # crisp flank line, faded out before the tail and nose
    'swage': (lambda z: lerp(.52, .44, smooth(-1.3, 1.0, z)), lambda z: smooth(-1.35, -1.0, z) * (1 - smooth(.8, 1.0, z)), .06, .1),
    'lean': lambda y, z: .07 * smooth(2.15, 2.455, z) * (car.h_of(y, z) - .45) - .05 * smooth(-2.35, -2.6, z) * (car.h_of(y, z) - .5)})
SKIN0 = bpy.data.objects.new('Skin0', car.body.data.copy()); car.scene.collection.objects.link(SKIN0)   # uncut skin, for normals
def skin_normals():
    """exact booleans leave sliver triangles round every cut; copy each paint loop's normal from the uncut skin so the
    panels shade as one surface in gloss paint (same pass as wisp_07.py)"""
    me = car.body.data; vg = car.body.vertex_groups.get('skin') or car.body.vertex_groups.new(name='skin')
    keep = set()
    for p_ in me.polygons:
        if me.materials[p_.material_index].name.split('.')[0] == 'PAINT': keep.update(p_.vertices)
    vg.add(list(keep), 1., 'REPLACE')
    mod = car.body.modifiers.new('skinN', 'DATA_TRANSFER'); mod.object = SKIN0; mod.use_loop_data = True
    mod.data_types_loops = {'CUSTOM_NORMAL'}; mod.loop_mapping = 'POLYINTERP_NEAREST'; mod.vertex_group = 'skin'
    nm = bpy.data.meshes.new_from_object(car.body.evaluated_get(car.DG())); car.body.modifiers.clear(); om = car.body.data; car.body.data = nm; bpy.data.meshes.remove(om)
    car.body.vertex_groups.clear()
ARCH_R = .415
for sd in (1, -1):
    car.cyl_x(f'archF{sd}', WR, WB, ARCH_R, sd * .6, sd * 1.4)
    car.cyl_x(f'archR{sd}', WR, -WB, ARCH_R, sd * .6, sd * 1.4)
car.apply_cuts()
car.sharpen(car.body, 55); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.52, x1=.9)   # stays inside the skin

# ---------------------------------------------------------------- helpers for this build
BV0 = car.BV()   # the uncut skin: lamps and trims are placed against this, not the floors of their own pockets
def FZ(x, y):
    h = BV0.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else 2.3
def BZ(x, y):
    h = BV0.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else -2.5
def resample(poly, per=10):
    out = []
    for i in range(len(poly)):
        (ax, ay), (bx, by) = poly[i], poly[(i + 1) % len(poly)]
        for k in range(per): out.append((lerp(ax, bx, k / per), lerp(ay, by, k / per)))
    return out
def ellipse(cx, cy, rx, ry, n=64, sq=2.6):   # superellipse: sq > 2 squares it off toward the oval-mouth look
    return [(cx + rx * math.copysign(abs(math.cos(a)) ** (2 / sq), math.cos(a)), cy + ry * math.copysign(abs(math.sin(a)) ** (2 / sq), math.sin(a)))
            for a in [2 * math.pi * k / n for k in range(n)]]
def pocket(name, poly, depth, m='GLOSSBLACK', back=False, per=10):
    """a recess that follows the curved nose/tail: every rim point is pushed `depth` into the skin under it"""
    pts = resample(poly, per) if per > 1 else list(poly); n = len(pts); S = BZ if back else FZ; sg = -1 if back else 1
    fr = [G(x, y, S(x, y) + sg * .25) for x, y in pts]; bk = [G(x, y, S(x, y) - sg * depth) for x, y in pts]
    cx = sum(p[0] for p in pts) / n; cy = sum(p[1] for p in pts) / n
    verts = fr + bk + [G(cx, cy, S(cx, cy) + sg * .25), G(cx, cy, S(cx, cy) - sg * depth)]
    faces = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [(2 * n, (i + 1) % n, i) for i in range(n)] + [(2 * n + 1, n + i, n + (i + 1) % n) for i in range(n)]
    ob = car.new_obj(name, verts, faces, m, False); car.fixn(ob); return car.cutter(ob, m)
def grid(name, P, nu, nv, m, flip=False):   # P(u, v) -> (x, y, z) in game space
    verts = [G(*P(i / nu, j / nv)) for i in range(nu + 1) for j in range(nv + 1)]; faces = []
    for i in range(nu):
        for j in range(nv):
            a = i * (nv + 1) + j; f = (a, a + nv + 1, a + nv + 2, a + 1); faces.append(tuple(reversed(f)) if flip else f)
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob); return ob
def bevel_obj(ob, off, seg=2, ang=.6):
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.bevel(bm, geom=[e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > ang], offset=off, segments=seg, affect='EDGES', profile=.5)
    bm.to_mesh(ob.data); bm.free(); return ob
def rr_tube(name, cx, cy, w, h, r, z0, z1, m, wall=.008, n=6):
    """a rounded-rectangle tailpipe: open shell from z0 to z1 with a rolled rim, dark core set inside"""
    o = Car.rounded(cx, cy, w, h, r, n); i_ = Car.rounded(cx, cy, w - 2 * wall, h - 2 * wall, max(r - wall, .002), n); k = len(o)
    verts = [G(x, y, z0) for x, y in o] + [G(x, y, z1) for x, y in o] + [G(x, y, z1) for x, y in i_] + [G(x, y, z0 + .02) for x, y in i_]
    faces = []
    for j in range(k):
        a, b = j, (j + 1) % k
        faces += [(a, b, k + b, k + a), (k + a, k + b, 2 * k + b, 2 * k + a), (2 * k + a, 2 * k + b, 3 * k + b, 3 * k + a)]
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob)
    car.new_obj(name + 'core', [G(x, y, z0 + .03) for x, y in i_], [tuple(range(k))], 'GAP', False)
    return ob

# ---------------------------------------------------------------- nose: oval mouth, slim lamp blades, corner air curtains
MOUTH = ellipse(0, .41, .47, .2, 72, 2.25)
pocket('mouth', MOUTH, .14, per=2)
HEAD_L = [(.42, .685), (.6, .698), (.78, .718), (.86, .738), (.855, .718), (.77, .692), (.6, .673), (.43, .668)]
for sd in (1, -1):
    pocket(f'head{sd}', [(sd * x, y) for x, y in HEAD_L], .035, per=6)
    pocket(f'curtain{sd}', [(sd * x, y) for x, y in [(.6, .24), (.77, .26), (.79, .56), (.75, .61), (.64, .59), (.58, .44)]], .12)
# ---- tail (from the rear reference): slim lamp blades where the turtleback rolls over into the tail, wrapping round the
# corners; a plate recess; vertical vents in the bumper corners behind the rear wheels
# lamps from Paris's taillight reference: a full-width bar across the tail, ending in corner clusters of LED slashes
CLUSTER = [(.48, .952), (.76, .972), (.8, .95), (.795, .885), (.55, .878), (.48, .925)]   # wedge: pointed inboard, wraps the corner
pocket('tailbar', [(-.5, .945), (.5, .945), (.5, .927), (-.5, .927)], .02, back=True, per=10)
for sd in (1, -1):
    pass   # (no pocket: the cluster lens sits on the skin, so the wrap-round corner stays clean)
pocket('plate', Car.rounded(0, .79, .52, .13, .015), .045, back=True, per=3)
# ---- shut lines: hood, four doors, deck lid, fuel door
for sd in (1, -1):
    for z0, ln in ((.74, -.05), (-.37, .0), (-1.33, .06)):
        pts = []
        for k in range(14):
            y = lerp(.24, kf(YT, z0) - .04, k / 13); z = z0 + ln * (y - .24)
            if z0 < -1: z -= .05 * math.sin(k / 13 * math.pi)                      # rear door kinks round the haunch
            x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        car.strip_cut(f'door{sd}{z0}', pts, .0032, .012)
    pts = []
    for k in range(18):
        z = lerp(.8, 2.28, k / 17); x = sd * lerp(.66, .54, (k / 17) ** 1.4); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0032, .012, axis='top')
    pts = []
    for k in range(10):
        z = lerp(-2.0, -2.5, k / 9); x = sd * .7; y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'deck{sd}', pts, .003, .012, axis='top')
pts = [(x, (car.surf_y(x, -2.0) or 1.0), -2.0) for x in [lerp(-.7, .7, k / 16) for k in range(17)]]
car.strip_cut('deckF', pts, .003, .012, axis='across')
car.apply_cuts()
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: gz > 2.2 and gy < .2)
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: -1.05 < gz < 1.08 and gy < .27 and abs(n[0]) > .3)   # dark rocker panel between the arches                          # chin under the mouth
car.sharpen(car.body, 55); car.bvh = car.BV()


# ---------------------------------------------------------------- cabin: low fastback glasshouse, frameless doors
# roof: one continuous arc, no flat section - the crown sits over the B-pillar and the line falls away at a steadily
# increasing rate into the tail (|dz|^1.55), so the fastback reads as a single aerodynamic curve
CH = [[-2.16, 1.08], [-2.035, 1.115], [-1.856, 1.178], [-1.587, 1.261], [-1.355, 1.329], [-1.149, 1.381], [-.943, 1.415],
      [-.738, 1.436], [-.5, 1.444], [-.257, 1.436], [-.05, 1.41], [.12, 1.37], [.3, 1.31], [.47, 1.24], [.64, 1.165], [.8, 1.095], [.92, 1.04]]   # traced roofline
def roof_y(z): return kf(CH, z)
car.build_cabin({'CZ0': -2.16, 'CZ1': .92, 'NC': 260 if DETAIL else 120, 'CH': CH, 'dlo': (.67, .58, -1.62, -1.39), 'rear_glass': -1.45, 'dlo_trim': 'CHROME',
    'pillars': [(-.44, -.37), (-1.08, -1.02)], 'apillar_r': .015,
    'cw': lambda z: kf(HW, z) - .2 - .1 * smooth(-1.6, -2.16, z) - .07 * smooth(.55, .92, z),
    'rw': lambda z: kf(HW, z) - .4 - .1 * smooth(-1.5, -2.16, z) - .09 * smooth(.3, .92, z)})

# ---------------------------------------------------------------- front details
for sd in (1, -1):
    # lamp blade: a bright LED line along the top of the slot, a dimmer main-beam strip below, smoked lens over both
    up = [(sd * x, y + .009, FZ(sd * x, y + .009) - .012) for x, y in [(.43, .679), (.6, .691), (.76, .71), (.85, .73)]]
    car.tube(f'drl{sd}', up, .0055, 'HEAD', res=8)
    for j, (x, y) in enumerate([(.5, .676), (.6, .683), (.7, .693)]):          # three projector cells in the lamp slot
        zf = FZ(sd * x, y) - .028
        car.cyl(f'pbez{sd}{j}', (sd * x, y, zf - .012), (sd * x, y, zf + .006), .019, 'CHROME', seg=32)
        car.cyl(f'proj{sd}{j}', (sd * x, y, zf + .004), (sd * x, y, zf + .01), .014, 'HEAD', seg=32)
    car.tube(f'beam{sd}', [(sd * x, y - .006, FZ(sd * x, y - .006) - .022) for x, y in [(.47, .674), (.6, .683), (.74, .698)]], .004, 'HEAD', res=6)
    grid(f'hlens{sd}', lambda u, v, sd=sd: (sd * lerp(.43, .855, u), lerp(.668, .69, v) + .045 * u ** 1.6 * (1 - .3 * v), FZ(sd * lerp(.43, .855, u), lerp(.668, .69, v) + .045 * u ** 1.6) - .003), 24, 3, 'LENS', flip=sd < 0)
    # air curtains: vertical vanes down the corner slots
    for k in range(3):
        x = sd * lerp(.63, .73, k / 2); y = .42
        car.box(f'cvane{sd}{k}', (.008, .28, .08), (x, y, FZ(x, y) - .07), 'GLOSSBLACK', rot=(0, sd * .2, 0))
# the oval mouth: a dark mesh deep inside, and three thin horizontal blades across it
for k in range(3):
    y = .34 + k * .075; car.box(f'mblade{k}', (lerp(.92, .84, abs(k - 1)), .008, .035), (0, y, FZ(0, y) - .11), 'GLOSSBLACK', rot=(-.2, 0, 0))
grid('mmesh', lambda u, v: (lerp(-.5, .5, u), lerp(.25, .58, v), FZ(0, .41) - .13), 40, 12, 'GAP')
# diamond mesh across the mouth: a lattice of small diamond cells, set back in the opening
def inside(poly, x, y):
    c = False
    for i in range(len(poly)):
        (ax, ay), (bx, by) = poly[i], poly[(i + 1) % len(poly)]
        if (ay > y) != (by > y) and x < ax + (y - ay) * (bx - ax) / (by - ay): c = not c
    return c
MZ = FZ(0, .41) - .085; cell = .05 if DETAIL else .08; k = 0; mv = []; mf = []
y = .23
while y < .6:
    x = -.5 + (cell / 2 if round((y - .23) / (cell * .6)) % 2 else 0)
    while x < .5:
        if all(inside(MOUTH, x + dx, y + dy) for dx, dy in ((cell * .55, 0), (-cell * .55, 0), (0, cell * .35), (0, -cell * .35))):
            zc = MZ - .02 * (x / .5) ** 2
            o = [(x + cell * .5, y), (x, y + cell * .3), (x - cell * .5, y), (x, y - cell * .3)]
            i_ = [(x + cell * .36, y), (x, y + cell * .2), (x - cell * .36, y), (x, y - cell * .2)]
            b = len(mv); mv += [G(px, py, zc) for px, py in o] + [G(px, py, zc) for px, py in i_] + [G(px, py, zc - .02) for px, py in o]
            mf += [(b + j, b + (j + 1) % 4, b + 4 + (j + 1) % 4, b + 4 + j) for j in range(4)] + [(b + 8 + j, b + 8 + (j + 1) % 4, b + (j + 1) % 4, b + j) for j in range(4)]
        x += cell
    y += cell * .3
car.new_obj('mdiamond', mv, mf, 'GRILLE', False)
# splitter: a thin carbon blade standing proud of the chin, swept up at the ends
SPL = [(-.9, 2.0)] + [(math.sin(a) * .9, 2.24 + math.cos(a) * .12) for a in [(-math.pi / 2) + math.pi * k / 40 for k in range(41)]] + [(.9, 2.0)]
bevel_obj(car.extrude_y('Splitter', SPL, .12, .14, 'CARBON'), .004)
for sd in (1, -1):
    car.extrude_x(f'splitEnd{sd}', [(2.02, .13), (2.3, .13), (2.26, .19), (2.06, .22)], sd * .885, sd * .9, 'CARBON')

# ---------------------------------------------------------------- flanks
for sd in (1, -1):
    # vertical fender vent behind the front wheel, chrome blade down its middle
    z = .98; pts = []
    for k in range(9):
        y = lerp(.5, .82, k / 8); x = car.surf_side(y, z + .02 * (k / 8), sd)
        if x: pts.append((sd * (x + .001), y, z + .02 * (k / 8)))
    if len(pts) > 2:
        car.tube(f'ventbk{sd}', pts, .016, 'GLOSSBLACK', res=4)
        car.tube(f'ventbl{sd}', [(p[0] + sd * .006, p[1], p[2]) for p in pts[1:-1]], .004, 'CHROME', res=4)
    # flush handles
    for z in (-.15, -1.06):
        y = kf(YS, z) - .09; x = car.surf_side(y, z, sd)
        if x: car.box(f'handle{sd}{z}', (.008, .016, .2), (sd * (x + .002), y, z), 'SATIN')
    # carbon sill blade with a chrome strip along its lower edge
    sill = []
    for i in range(41):
        zz = lerp(-1.05, 1.08, i / 40); x = car.surf_side(.26, zz, sd) or .9
        sill.append([G(sd * (x - .06), .165, zz), G(sd * (x + .02), .165, zz), G(sd * (x + .025), .2, zz), G(sd * (x - .06), .23, zz)])
    car.loft(f'Sill{sd}', sill, 'CARBON', smooth_=False)
    car.tube(f'sillChrome{sd}', [(sd * ((car.surf_side(.26, zz, sd) or .9) + .028), .172, zz) for zz in [lerp(-1.0, 1.03, k / 20) for k in range(21)]], .0045, 'CHROME', res=4)
    # mirrors: blade stalk off the door, paint cap
    mz = .4; my = car.belt(mz) + .02; mx = car.C['cw'](mz)
    car.tube(f'mstalk{sd}', [(sd * (mx - .02), my - .015, mz), (sd * (mx + .06), my + .01, mz - .03), (sd * (mx + .1), my + .03, mz - .05)], .011, 'GLOSSBLACK', res=4)
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=32, v_segments=16, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .1, v.co.z * .045, v.co.y * .07
        if gz < 0: gz *= .3
        v.co = G(sd * (mx + .16) + gx, my + .045 + gy, mz - .07 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(car.M['PAINT']); me.shade_smooth(); car.link(bpy.data.objects.new(f'mcap{sd}', me))
    car.box(f'mglass{sd}', (.17, .065, .006), (sd * (mx + .16), my + .045, mz - .093), 'GLOSSBLACK')

# ---------------------------------------------------------------- tail
def tailpt(x, y, off=.012):   # a point on the rounded tail, standing `off` proud of it
    return (x, y, BZ(x, y) - off)
for sd in (1, -1):
    # corner cluster (taillight reference): a row of white-hot slashes that grow taller toward the corner and lean outward,
    # a row of small red slashes beneath them, a red outline round the wedge, a smoked lens behind it all. Every piece is
    # a panel laid on the tail surface (not a box), so the cluster follows the body as it wraps round the corner.
    def panel(name, poly, m, off):
        n = len(poly); cx = sum(p[0] for p in poly) / n; cy = sum(p[1] for p in poly) / n
        ring = [(sd * x, y, BZ(sd * x, y) - off) for x, y in poly]; ctr = (sd * cx, cy, BZ(sd * cx, cy) - off)
        verts = [G(*q) for q in ring] + [G(*ctr)] + [G(q[0], q[1], q[2] + .003) for q in ring]
        faces = [(n, i, (i + 1) % n) if sd > 0 else (n, (i + 1) % n, i) for i in range(n)]
        faces += [(i, n + 1 + i, n + 1 + (i + 1) % n, (i + 1) % n) if sd > 0 else (i, (i + 1) % n, n + 1 + (i + 1) % n, n + 1 + i) for i in range(n)]
        ob = car.new_obj(name, verts, faces, m, False); return ob
    def slash(name, x0, y0, w, h, lean, m, off):
        panel(name, [(x0, y0), (x0 + w, y0), (x0 + w + lean * h, y0 + h), (x0 + lean * h, y0 + h)], m, off)
    for k in range(7):                                          # white slashes: short inboard, tall at the corner
        t = k / 6; x = lerp(.53, .735, t); h = lerp(.018, .05, t ** 1.3); w = lerp(.016, .024, t)
        slash(f'tslash{sd}{k}', x, .924 + .008 * t, w, h, .45, 'TAILW', .014)
    for k in range(11):                                         # red slashes in a band underneath
        t = k / 10; slash(f'tred{sd}{k}', lerp(.565, .77, t), .889, .007, .015, .55, 'TAIL', .013)
    out = CLUSTER + [CLUSTER[0]]
    car.tube(f'tframe{sd}', [tailpt(sd * x, y, .011) for x, y in out], .0028, 'TAIL', res=3)
    panel(f'tlens{sd}', CLUSTER, 'LENS', .006)
    # red reflectors either side of the plate, low on the bumper
    x, y = .6, .5; car.box(f'refl{sd}', (.2, .02, .012), (sd * x, y, BZ(sd * x, y) - .002), 'REFLECT')
    # twin round tailpipes per side in the carbon diffuser
    for x in (.46, .59):
        y = .33; zt = BZ(sd * x, y)
        zo = zt - .025                                     # tips stand 2.5 cm proud of the valance (rear is -z)
        car.cyl(f'exh{sd}{x}', (sd * x, y, zt + .06), (sd * x, y, zo), .05, 'CHROME', seg=48, cap=False)
        car.cyl(f'exhR{sd}{x}', (sd * x, y, zo + .01), (sd * x, y, zo), .055, 'CHROME', r1=.051, seg=48, cap=False)   # rolled rim
        car.cyl(f'exhI{sd}{x}', (sd * x, y, zo + .045), (sd * x, y, zo), .043, 'SATIN', seg=48, cap=False)          # inner liner
        car.cyl(f'exhC{sd}{x}', (sd * x, y, zo + .05), (sd * x, y, zo + .045), .044, 'GAP', seg=24)                  # dark core
car.tube('tailbar', [tailpt(x, .936, .012) for x in [lerp(-.5, .5, k / 32) for k in range(33)]], .0072, 'TAIL', res=8)       # the full-width bar
car.tube('tailbarW', [tailpt(x, .936, .018) for x in [lerp(-.48, .48, k / 30) for k in range(31)]], .003, 'TAILW', res=6)   # its white-hot core
VAL = lambda u, v: (lambda x, y: (x, y, BZ(x, y) - .006))(lerp(-.8, .8, u), lerp(.24 + .06 * abs(2 * u - 1) ** 3, .42 - .04 * abs(2 * u - 1) ** 4, v))
grid('valance', VAL, 72, 10, 'CARBON', flip=True)                                     # carbon lower tail, laid on the skin
car.tube('diffTrim', [VAL(k / 40, 1)[:2] + (VAL(k / 40, 1)[2] - .004,) for k in range(41)], .004, 'CHROME', res=4)   # bright line along its top
for x in (-.12, .12): car.box(f'plight{x}', (.05, .008, .012), (x, .868, BZ(x, .868) - .004), 'HEAD')
# diffuser: carbon strakes in the middle of the lower tail
for k in range(5):
    x = -.3 + k * .15; zt = BZ(x, .3)
    car.extrude_x(f'dfin{k}', [(-2.15, .2), (zt + .02, .2), (zt + .005, .38), (-2.3, .38)], x - .006, x + .006, 'CARBON')
# rear wing (from the rear reference): a carbon blade held close over the deck on two struts, its ends sweeping down
# into the tail shoulders, a short kick-up gurney along the trailing edge
def foil(chord, thick, n=24):   # cambered section (z, y) from the leading edge, z running rearward
    up, lo = [], []
    for k in range(n + 1):
        t = k / n; xc = (1 - math.cos(math.pi * t)) / 2
        yt = 5 * thick * (.2969 * math.sqrt(xc) - .126 * xc - .3516 * xc ** 2 + .2843 * xc ** 3 - .1036 * xc ** 4)
        yc = .05 * (2 * .4 * xc - xc * xc) / .16 if xc < .4 else .05 * (1 - 2 * .4 + 2 * .4 * xc - xc * xc) / .36
        up.append((-xc * chord, (yc + yt) * chord)); lo.append((-xc * chord, (yc - yt) * chord))
    return up + list(reversed(lo[1:-1]))
WZ = -2.22; WX = .78; SEC = foil(.27, .1, 32); WS = []; YW = (car.surf_y(0, -2.32) or 1.06) + .075
for i in range(81):
    t = i / 80; x = lerp(-WX, WX, t); a = abs(x)
    drop = smooth(.5, WX, a)                                      # the tips sweep down to meet the shoulders
    ys = car.surf_y(x * .98, WZ - .14) or 1.0
    y = lerp(YW, ys + .03, drop ** 1.6); tilt = -.12 - .1 * drop
    ring = []
    for z, yy in SEC:
        zz = z * math.cos(tilt) - yy * math.sin(tilt); y2 = z * math.sin(tilt) + yy * math.cos(tilt)
        ring.append(G(x, y + y2, WZ + zz))
    WS.append(ring)
car.loft('Wing', WS, 'CARBON')
for sd in (1, -1):   # short swan-free struts: slim blades from the deck lid up under the blade
    x = sd * .36; y0 = car.surf_y(x, WZ - .14) or 1.05
    car.extrude_x(f'strut{sd}', [(WZ - .05, y0 - .01), (WZ - .2, y0 - .01), (WZ - .17, YW - .005), (WZ - .07, YW - .005)], x - .007, x + .007, 'CARBON')

# ---------------------------------------------------------------- inside: liner, buckets, dash (seen through the glass)
cab = car.cabin; me = cab.data
bm = bmesh.new(); bm.from_mesh(me)
gl = [f for f in bm.faces if f.material_index == 1]; bmesh.ops.delete(bm, geom=gl, context='FACES')
for v in bm.verts:
    c = Vector((0, v.co.y, 1.0)); v.co = c + (v.co - c) * .965
bmesh.ops.reverse_faces(bm, faces=bm.faces)
for f in bm.faces: f.material_index = 0
lin = bpy.data.meshes.new('Liner'); bm.to_mesh(lin); bm.free(); lin.materials.append(car.M['INTERIOR'])
car.link(bpy.data.objects.new('Liner', lin))
for sd in (1, -1):
    for zs in (.0, -.95):
        x = sd * .38
        car.box(f'seatback{sd}{zs}', (.46, .62, .08), (x, .95, zs - .3), 'INTERIOR', rot=(-.25, 0, 0))
        car.box(f'headrest{sd}{zs}', (.26, .16, .08), (x, 1.22 if zs == 0 else 1.08, zs - .36), 'INTERIOR', rot=(-.25, 0, 0))
        car.box(f'cushion{sd}{zs}', (.42, .08, .44), (x, .66, zs - .05), 'INTERIOR')
car.box('dash', (1.6, .12, .36), (0, .86, .55), 'INTERIOR', rot=(.25, 0, 0))
car.box('console', (.22, .14, 1.5), (0, .6, -.2), 'INTERIOR')
car.box('screen', (.5, .14, .015), (0, .98, .42), 'GLOSSBLACK', rot=(-.3, 0, 0))
sw = [(.38 + .17 * math.cos(2 * math.pi * k / 32), .92 + .17 * math.sin(2 * math.pi * k / 32) * .92, .3 + .17 * math.sin(2 * math.pi * k / 32) * .38) for k in range(33)]
car.tube('steer', sw, .016, 'INTERIOR', res=4)
car.cyl('column', (.38, .88, .32), (.38, .82, .55), .025, 'INTERIOR', seg=16)
for sd in (1, -1):   # seat bolsters
    for zs in (.0, -.95):
        for e in (1, -1): car.box(f'bol{sd}{zs}{e}', (.07, .5, .12), (sd * .38 + e * .2, .92, zs - .28), 'INTERIOR', rot=(-.25, 0, 0))
# roof antenna fin, on the arc
fz = -1.75; fy = roof_y(fz) - .004
car.extrude_x('sharkfin', [(fz + .1, fy), (fz - .12, fy), (fz - .07, fy + .055)], -.022, .022, 'GLOSSBLACK', smooth_=True)
# small aero fins on the sills ahead of the rear wheels
for sd in (1, -1):
    for k in range(3):
        z = -.92 + k * .07; x = car.surf_side(.26, z, sd) or .9
        car.box(f'sfin{sd}{k}', (.05, .05, .006), (sd * (x + .03), .215, z), 'CARBON')
car.box('rdeck', (1.4, .02, .4), (0, .99, -1.75), 'INTERIOR', rot=(.15, 0, 0))

skin_normals(); bpy.data.objects.remove(SKIN0)
objs = car.objs(); result = car.stats(); print(result)
print('stations: plate z %.3f, head z %.3f, tail z %.3f' % (BZ(0, .6), FZ(.64, .62), BZ(.85, .88)))
