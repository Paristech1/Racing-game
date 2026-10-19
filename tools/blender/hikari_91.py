"""AFTERHOURS — HIKARI 91 (v1 Blender build), on carlib.py, from Paris's locked Midjourney reference set
(~/Projects/afterhours_refs/hikari: side, front34, rear34, top). A late-80s fastback drift coupe on a slammed widebody:
long flat wedge hood with the pop-up headlamps flipped UP, a low nose with a wide intercooler mouth, inboard rectangular
lamps and amber corners, carbon splitter + canards, crisp 80s shoulder line, bolt-on riveted over-fenders front and rear,
a long fastback glasshouse with a louvered quarter window and louvered hatch glass, a GT wing on pedestal stands, a
full-width smoked tail band, quad exits low left, a finned diffuser. Satin violet with lime brush slashes (the slashes
are the VINYL shell; js/afterhours.js maps the canvas vinyl onto it).
Wheels (BODIES.hikari, built in the game): x +-.89, z +-1.36, r .375.
Headless: python3 build_car.py hikari_91 ../../models/hikari_91.glb [--shots DIR]."""
car = Car('Hikari 91', paint=(.11, .02, .32), accent=(.55, 1., .12))
pb = car.M['PAINT'].node_tree.nodes['Principled BSDF']; pb.inputs['Metallic'].default_value = .35; pb.inputs['Roughness'].default_value = .32

def mk(name, col, metal=0., rough=.5, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)
car.M['GRILLE'] = mk('GRILLE', (.012, .013, .015), .3, .5)
car.M['AMBER'] = mk('AMBER', (1., .45, .05), 0., .3, emit=(1., .4, .04), strength=5.)
car.M['VINYL'] = mk('VINYL', (.45, .95, .1), .1, .35)
car.M['LENS'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.05, .004, .006, 1)   # smoked red tail lens

# ---------------------------------------------------------------- body
# Traced off the locked side view (wheels scaled to the game's .375 m): a 4.6 m wedge. Nose tip low (.6) climbing in one
# straight line to the cowl (.9), a beltline that keeps rising gently to the tail (.99), a short tail with a little
# ducktail kick. Plan: a narrow 80s body (.86 half width at the doors) with bolt-on over-fenders bulging to 1.0 over
# each axle; the upper side tumbles in over the flares so the fenders read as added-on, not blown-out sheet metal.
Z0, Z1, WB, WR = -2.26, 2.32, 1.36, .375
FL = lambda z: math.exp(-((z - WB) / .52) ** 4) + math.exp(-((z + WB) / .55) ** 4)     # 1 over each axle, 0 between
HW = [[-2.26, .84], [-2.18, .9], [-2.0, .95], [-1.36, .99], [-.8, .93], [-.5, .875], [.0, .865], [.5, .875], [.85, .925], [1.36, .985],
      [1.85, .955], [2.1, .9], [2.25, .82], [2.32, .72]]
YB = [[-2.26, .36], [-2.2, .24], [-2.05, .17], [1.95, .165], [2.2, .2], [2.32, .27]]
YT = [[-2.26, .86], [-2.22, .93], [-2.1, .955], [-1.7, .945], [-1.0, .92], [-.3, .895], [.3, .875], [.62, .86], [1.0, .825], [1.5, .765],
      [2.0, .7], [2.22, .65], [2.32, .58]]
YS = [[-2.26, .8], [-2.15, .885], [-1.7, .89], [-1.0, .86], [-.3, .835], [.3, .82], [.62, .805], [1.0, .78], [1.5, .725], [2.0, .66],
      [2.22, .595], [2.32, .5]]
def dome(x, z):
    """hood: dead flat with a shallow centre crease line; deck: flat"""
    a = abs(x); hz = smooth(.7, 1.0, z) * (1 - smooth(2.05, 2.3, z))
    return .008 * hz * (1 - smooth(.0, .35, a))
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .07, 'NS': 220, 'res': 2,
    'Rx': lambda z: .06 + .03 * smooth(1.6, 2.3, z),                                  # crisp 80s shoulder, softer at the nose
    'tumble': lambda z: .05 + .1 * FL(z),                                             # flares bulge low, the shoulder stays narrow
    'round_nose': .14, 'round_tail': .1, 'bulge_at': .42, 'dome': dome,
    'feature': lambda z: .009 * smooth(-2.2, -1.9, z) * (1 - smooth(1.9, 2.2, z)),
    'swage': (lambda z: .4, lambda z: smooth(-.85, -.6, z) * (1 - smooth(.6, .85, z)), .03, .05),   # a low body crease along the doors
    'lean': lambda y, z: .1 * smooth(2.05, 2.32, z) * (car.h_of(y, z) - .55) - .05 * smooth(-2.1, -2.26, z) * (car.h_of(y, z) - .5)})
SKIN0 = bpy.data.objects.new('Skin0', car.body.data.copy()); car.scene.collection.objects.link(SKIN0)
def skin_normals():
    """exact booleans leave slivers round every cut; take each paint loop's normal from the uncut skin (autobahn_63.py)"""
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
    h = BV0.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else 2.2
def BZ(x, y):
    h = BV0.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else -2.2
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
def top_pocket(name, poly_xz, depth, m='GAP'):   # a recess pushed down into the hood, following its surface
    pts = resample(poly_xz, 6); n = len(pts)
    fr = [G(x, (TY(x, z) or .8) + .2, z) for x, z in pts]; bk = [G(x, (TY(x, z) or .8) - depth, z) for x, z in pts]
    cx = sum(p[0] for p in pts) / n; cz = sum(p[1] for p in pts) / n
    verts = fr + bk + [G(cx, (TY(cx, cz) or .8) + .2, cz), G(cx, (TY(cx, cz) or .8) - depth, cz)]
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
def rbox(name, size, pos, m, rot=(0, 0, 0), r=.006):   # a box with rolled edges, so it catches the highlights
    return bevel_obj(car.box(name, size, pos, m, rot), r, 2)

# ---- wheel arches
ARCH_R = .43
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * .62, sd * 1.4)
# ---- nose: the wide intercooler mouth, a slim centre slot, the inboard lamps and amber corners, brake ducts
MOUTH = Car.rounded(0, .33, 1.18, .17, .035, 6)
pocket('mouth', MOUTH, .12, per=4)
pocket('slot', Car.rounded(0, .505, .42, .045, .015, 4), .05, per=4)
for sd in (1, -1):
    pocket(f'lamp{sd}', Car.rounded(sd * .42, .515, .24, .075, .012, 4), .04, per=4)
    pocket(f'amber{sd}', Car.rounded(sd * .7, .5, .14, .045, .01, 3), .02, per=4)
    pocket(f'duct{sd}', [(sd * .64, .2), (sd * .8, .22), (sd * .8, .38), (sd * .66, .36)], .1)
# ---- pop-up lamp pockets in the hood (the pods stand up out of them)
POP = {sd: (sd * .58, 1.9) for sd in (1, -1)}
for sd in (1, -1): top_pocket(f'popwell{sd}', Car.rounded(POP[sd][0], POP[sd][1] - .03, .4, .34, .03, 3), .03)
# ---- tail: the full-width lamp band, plate box
TAILB = [(-.84, .8), (.84, .8), (.83, .69), (-.83, .69)]
pocket('tailband', TAILB, .03, back=True, per=12)
pocket('plate', Car.rounded(0, .5, .52, .14, .015), .04, back=True, per=3)
# ---- shut lines: long coupe door, hood, hatch, fuel door, bumper seams; bolt-on flare seams
for sd in (1, -1):
    for z0, ln, top in ((.6, -.1, .86), (-.7, .05, .9)):
        pts = []
        for k in range(14):
            y = lerp(.22, top, k / 13); z = z0 + ln * (y - .22); x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        car.strip_cut(f'door{sd}{z0}', pts, .0032, .012)
    pts = []
    for k in range(18):
        z = lerp(.68, 2.18, k / 17); x = sd * lerp(.7, .64, (k / 17) ** 1.4); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0032, .012, axis='top')
    pts = []   # front bumper to fender seam, a short diagonal behind the amber lamp
    for k in range(8):
        y = lerp(.25, .56, k / 7); z = 2.1 - .1 * (k / 7); x = car.surf_side(y, z, sd)
        if x: pts.append((sd * x, y, z))
    car.strip_cut(f'bseam{sd}', pts, .003, .01)
    for zw in (WB, -WB):   # where the over-fender meets the body: a gap arc just outside the arch
        pts = []
        for k in range(17):
            a = math.radians(-6 + 192 * k / 16); y = WR + (ARCH_R + .13) * math.sin(a); z = zw + (ARCH_R + .13) * math.cos(a)
            if y < .2: continue
            x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        if len(pts) > 2: car.strip_cut(f'flareseam{sd}{zw}', pts, .0035, .011)
    pts = []   # fuel door
    for k in range(13):
        a = 2 * math.pi * k / 12; y = .78 + .05 * math.sin(a); z = -1.72 + .06 * math.cos(a); x = car.surf_side(y, z, sd)
        if x: pts.append((sd * x, y, z))
    if sd < 0: car.strip_cut('fuel', pts, .0025, .008)
pts = [(x, (car.surf_y(x, -1.98) or 1.0), -1.98) for x in [lerp(-.72, .72, k / 16) for k in range(17)]]
car.strip_cut('hatchF', pts, .003, .012, axis='across')
car.apply_cuts()
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: gz > 2.15 and gy < .21)                                  # chin
car.recolor('CARBON', lambda gx, gy, gz, n: -.9 < gz < .9 and gy < .25 and abs(n[0]) > .25)               # carbon rocker between the arches
car.sharpen(car.body, 50); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.6, x1=1.0)

# ---------------------------------------------------------------- cabin: long raked screen, fastback hatch glass
CH = [[-1.98, 1.0], [-1.75, 1.06], [-1.45, 1.13], [-1.15, 1.2], [-.85, 1.255], [-.55, 1.285], [-.25, 1.295], [.0, 1.285],
      [.15, 1.265], [.3, 1.21], [.45, 1.12], [.58, 1.02], [.66, .945]]
def roof_y(z): return kf(CH, z)
car.build_cabin({'CZ0': -1.98, 'CZ1': .66, 'NC': 150, 'CH': CH, 'dlo': (.6, .5, -1.62, -1.05), 'rear_glass': -.62, 'dlo_trim': None,
    'pillars': [(-.72, -.64)], 'apillar_r': .014,
    'cw': lambda z: .74 - .14 * smooth(-1.3, -1.98, z) - .06 * smooth(.35, .66, z),
    'rw': lambda z: .56 - .12 * smooth(-1.2, -1.98, z) - .08 * smooth(.1, .66, z)})

# ---------------------------------------------------------------- pop-up headlamps, flipped up
for sd in (1, -1):
    x, z = POP[sd]; y0 = (TY(x, z) or .76) - .015
    # pod: a wedge standing on the hood - tall square front face, lid sloping back into the well
    prof = [(z + .13, y0), (z + .13, y0 + .165), (z + .09, y0 + .182), (z - .17, y0 + .04), (z - .17, y0)]
    pod = car.extrude_x(f'pod{sd}', prof, x - .18, x + .18, 'PAINT'); bevel_obj(pod, .01, 3, .4)
    # black bezel, chrome reflector bowl, one big clear lamp with a lens grid
    rbox(f'bezel{sd}', (.33, .135, .02), (x, y0 + .09, z + .138), 'GLOSSBLACK', r=.006)
    rbox(f'refl{sd}', (.28, .105, .012), (x, y0 + .09, z + .146), 'CHROME', r=.004)
    car.box(f'hlamp{sd}', (.23, .085, .008), (x, y0 + .09, z + .151), 'HEAD')
    for k in range(5): car.box(f'hgrid{sd}{k}', (.004, .085, .004), (x - .09 + k * .045, y0 + .09, z + .157), 'LENS')
    car.box(f'hlens{sd}', (.27, .1, .004), (x, y0 + .09, z + .16), 'GLASS')
    car.box(f'hinge{sd}', (.34, .02, .03), (x, y0 + .01, z - .16), 'GLOSSBLACK')

# ---------------------------------------------------------------- nose details
for sd in (1, -1):
    x, y = sd * .42, .515; zf = FZ(x, y)
    rbox(f'lampbz{sd}', (.22, .062, .01), (x, y, zf - .035), 'CHROME', r=.003)
    car.box(f'lampin{sd}', (.2, .05, .006), (x, y, zf - .028), 'HEAD')
    for k in range(4): car.box(f'lampg{sd}{k}', (.003, .05, .004), (x - .075 + k * .05, y, zf - .024), 'LENS')
    x = sd * .7; car.box(f'amberL{sd}', (.13, .038, .008), (x, .5, FZ(x, .5) - .012), 'AMBER')
    # brake-duct mesh
    for k in range(4):
        y = .23 + k * .035; car.box(f'dbar{sd}{k}', (.15, .006, .01), (sd * .72, y, FZ(sd * .72, y) - .05), 'GRILLE')
# the intercooler: a dense core of horizontal fins deep in the mouth, end tanks, a chrome badge strip
MZ = FZ(0, .33) - .09
for k in range(16):
    y = .26 + k * .009; car.box(f'icfin{k}', (1.04, .0035, .03), (0, y, MZ), 'SATIN')
for sd in (1, -1): rbox(f'ictank{sd}', (.06, .15, .05), (sd * .55, .33, MZ - .005), 'SATIN', r=.008)
for k in range(9):
    x = -.48 + k * .12; car.box(f'icv{k}', (.006, .15, .02), (x, .33, MZ + .02), 'GRILLE')
# splitter: a flat carbon blade proud of the chin, with endplates; canards on each corner
SPL = [(-.96, 1.98)] + [(math.sin(a) * .96, 2.2 + math.cos(a) * .15) for a in [(-math.pi / 2) + math.pi * k / 48 for k in range(49)]] + [(.98, 1.95)]
bevel_obj(car.extrude_y('Splitter', SPL, .11, .125, 'CARBON'), .004)
for sd in (1, -1):
    car.extrude_x(f'splitEnd{sd}', [(1.98, .11), (2.25, .11), (2.22, .17), (2.02, .2)], sd * .945, sd * .96, 'CARBON')
    for k, (y, z, w) in enumerate(((.26, 2.06, .2), (.36, 2.0, .15))):
        x = SX(y, z, sd) or .9
        car.extrude_y(f'canard{sd}{k}', [(sd * (x - .02), z + .06), (sd * (x + w * .55), z - .05), (sd * (x + w * .5), z - .1), (sd * (x - .02), z - .02)], y, y + .008, 'CARBON')
    for k in range(3):   # struts from the bumper down to the splitter
        pass
for x in (-.45, .45): car.cyl(f'strut{x}', (x, .125, 2.25), (x, .25, 2.18), .008, 'GLOSSBLACK', seg=8)
car.box('towstrap', (.05, .1, .012), (-.38, .23, FZ(-.38, .23) + .004), 'VINYL')

# ---------------------------------------------------------------- flanks: riveted over-fenders, skirts, mirrors, handles
for sd in (1, -1):
    for zw in (WB, -WB):
        for k in range(17):   # rivets just outside the flare seam
            a = math.radians(-4 + 188 * k / 16); y = WR + (ARCH_R + .085) * math.sin(a); z = zw + (ARCH_R + .085) * math.cos(a)
            if y < .2: continue
            x = SX(y, z, sd)
            if x: car.sphere(f'rivet{sd}{zw}{k}', (sd * (x + .001), y, z), .011, 'CHROME', scale=(.5, 1, 1), seg=10)
    # carbon side skirt blade
    sill = []
    for i in range(41):
        zz = lerp(-.9, .9, i / 40); x = car.surf_side(.24, zz, sd) or .87
        sill.append([G(sd * (x - .06), .13, zz), G(sd * (x + .045), .13, zz), G(sd * (x + .05), .16, zz), G(sd * (x - .06), .2, zz)])
    car.loft(f'Skirt{sd}', sill, 'CARBON', smooth_=False)
    # flush door handle, a black slot under the belt
    z = -.42; y = kf(YS, z) - .06; x = car.surf_side(y, z, sd)
    if x: rbox(f'handle{sd}', (.01, .028, .15), (sd * (x + .002), y, z), 'GLOSSBLACK', r=.004)
    # mirrors: 80s sail-mounted wedge in body colour
    mz = .48; my = car.belt(mz) + .04; mx = car.C['cw'](mz)
    car.extrude_x(f'msail{sd}', [(mz + .1, my - .045), (mz - .08, my - .045), (mz - .02, my + .02), (mz + .07, my + .02)], sd * (mx - .01), sd * (mx + .06), 'GLOSSBLACK')
    b = bmesh.new(); bmesh.ops.create_cube(b, size=1.)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free()
    for v in me.vertices:
        gx, gy, gz = v.co.x * .15, v.co.z * .075, v.co.y * .11
        if gz < 0: gx *= .85; gy *= .85
        v.co = G(sd * (mx + .12) + gx, my + .035 + gy, mz - .03 + gz)
    me.materials.append(car.M['PAINT']); mo = car.link(bpy.data.objects.new(f'mcap{sd}', me)); bevel_obj(mo, .02, 3, .3)
    car.box(f'mglass{sd}', (.13, .06, .004), (sd * (mx + .12), my + .035, mz - .086), 'GLOSSBLACK')

# ---- louvers over the quarter windows and the hatch glass
BOTH = car.BV([car.body, car.cabin])
for sd in (1, -1):
    for k in range(7):
        z = lerp(-1.1, -1.55, k / 6); u0, u1 = .03, .5
        pts = []
        for j in range(8):
            u = lerp(u0, u1, j / 7); x, y = car.ring_pt(z - .06 * (j / 7), u, .006); pts.append((sd * x, y, z - .06 * (j / 7)))
        car.tube(f'qlouv{sd}{k}', pts, .007, 'GLOSSBLACK', res=3)
for k in range(13):
    z = lerp(-.78, -1.86, k / 12); pts = []
    for j in range(15):
        x = lerp(-.5, .5, j / 14) * (1 - .25 * (k / 12)); y = car.surf_y(x, z, BOTH)
        if y: pts.append((x, y + .012, z))
    if len(pts) > 3: car.tube(f'hlouv{k}', pts, .009, 'GLOSSBLACK', res=3)
for sd in (1, -1):   # louver side rails
    pts = []
    for k in range(10):
        z = lerp(-.74, -1.9, k / 9); x = sd * .52 * (1 - .25 * k / 9); y = car.surf_y(x, z, BOTH)
        if y: pts.append((x, y + .02, z))
    car.tube(f'hrail{sd}', pts, .012, 'GLOSSBLACK', res=3)

# ---------------------------------------------------------------- tail
for sd in (1, -1):
    def tp(x, y, off=.008): return (x, y, BZ(x, y) - off)
    # smoked lens across the band, two lamp rows behind it on each side, a reverse lamp near the middle
    grid(f'tlens{sd}', lambda u, v, sd=sd: tp(sd * lerp(.02, .82, u), lerp(.7, .79, v), .004), 30, 4, 'LENS', flip=sd > 0)
    car.tube(f'tlamp{sd}', [tp(sd * x, .765, .012) for x in [lerp(.12, .8, k / 20) for k in range(21)]], .013, 'TAIL', res=4)
    car.tube(f'tlamp2{sd}', [tp(sd * x, .722, .012) for x in [lerp(.4, .8, k / 12) for k in range(13)]], .008, 'TAIL', res=4)
    car.box(f'rev{sd}', (.1, .025, .008), (sd * .28, .745, BZ(sd * .28, .745) - .012), 'HEAD')
grid('valance', lambda u, v: (lambda x, y: (x, y, BZ(x, y) - .005))(lerp(-.76, .76, u), lerp(.2, .34, v)), 60, 6, 'GLOSSBLACK', flip=True)
# quad exits low on the left, in a black valance; a finned diffuser
for i, x in enumerate((-.42, -.56)):
    for dy in (.0,):
        y = .25; zt = BZ(x, y); zo = zt - .04
        car.cyl(f'exh{i}', (x, y, zt + .1), (x, y, zo), .048, 'CHROME', seg=40, cap=False)
        car.cyl(f'exhR{i}', (x, y, zo + .01), (x, y, zo), .052, 'CHROME', r1=.049, seg=40, cap=False)
        car.cyl(f'exhC{i}', (x, y, zo + .04), (x, y, zo + .035), .043, 'GAP', seg=24)
for k in range(5):
    x = -.15 + k * .15; zt = BZ(x, .25)
    car.extrude_x(f'dfin{k}', [(-1.95, .16), (zt - .06, .16), (zt - .04, .32), (-2.1, .32)], x - .006, x + .006, 'CARBON')
# GT wing: a cambered blade on two pedestal stands off the hatch tail, big flat endplates
def foil(chord, thick, n=24):
    up, lo = [], []
    for k in range(n + 1):
        t = k / n; xc = (1 - math.cos(math.pi * t)) / 2
        yt = 5 * thick * (.2969 * math.sqrt(xc) - .126 * xc - .3516 * xc ** 2 + .2843 * xc ** 3 - .1036 * xc ** 4)
        yc = .06 * (2 * .4 * xc - xc * xc) / .16 if xc < .4 else .06 * (1 - 2 * .4 + 2 * .4 * xc - xc * xc) / .36
        up.append((-xc * chord, (yc + yt) * chord)); lo.append((-xc * chord, (yc - yt) * chord))
    return up + list(reversed(lo[1:-1]))
WZ = -1.98; WX = .86; SEC = foil(.34, .12, 28); WY = 1.24; WS = []
for i in range(61):
    x = lerp(-WX, WX, i / 60); tilt = -.16; ring = []
    for z, yy in SEC:
        zz = z * math.cos(tilt) - yy * math.sin(tilt); y2 = z * math.sin(tilt) + yy * math.cos(tilt); ring.append(G(x, WY + y2, WZ + zz))
    WS.append(ring)
car.loft('Wing', WS, 'PAINT')
for sd in (1, -1):
    car.extrude_x(f'endplate{sd}', [(WZ + .03, WY - .07), (WZ - .36, WY - .09), (WZ - .38, WY + .07), (WZ - .02, WY + .05)], sd * (WX - .002), sd * (WX + .012), 'PAINT')
    x = sd * .46; y0 = car.surf_y(x, WZ - .14, BOTH) or 1.0
    st = car.extrude_x(f'stand{sd}', [(WZ - .02, y0 - .02), (WZ - .26, y0 - .02), (WZ - .22, WY + .01), (WZ - .07, WY + .01)], x - .012, x + .012, 'GLOSSBLACK')
    bevel_obj(st, .004)
car.box('gurney', (2 * WX, .025, .006), (0, WY + .03, WZ - .33), 'GLOSSBLACK', rot=(.3, 0, 0))

# ---------------------------------------------------------------- inside: liner, buckets with harnesses, dash, cage hoop
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
    x = sd * .36
    rbox(f'seatback{sd}', (.42, .6, .09), (x, .82, -.42), 'INTERIOR', rot=(-.22, 0, 0), r=.02)
    rbox(f'cushion{sd}', (.4, .08, .42), (x, .5, -.15), 'INTERIOR', r=.02)
    for e in (1, -1): rbox(f'bol{sd}{e}', (.06, .52, .13), (x + e * .2, .8, -.4), 'INTERIOR', rot=(-.22, 0, 0), r=.02)
    car.box(f'harness{sd}', (.05, .55, .01), (x - .08, .82, -.36), 'VINYL', rot=(-.22, 0, 0))
rbox('dash', (1.5, .12, .34), (0, .78, .4), 'INTERIOR', rot=(.2, 0, 0), r=.02)
rbox('console', (.2, .12, 1.0), (0, .5, -.1), 'INTERIOR', r=.02)
sw = [(.36 + .16 * math.cos(2 * math.pi * k / 32), .84 + .16 * math.sin(2 * math.pi * k / 32) * .9, .18 + .16 * math.sin(2 * math.pi * k / 32) * .42) for k in range(33)]
car.tube('steer', sw, .016, 'INTERIOR', res=4)
car.cyl('column', (.36, .8, .2), (.36, .74, .42), .025, 'INTERIOR', seg=16)
hoop = [(x, .45 + 1.0 * (1 - (x / .58) ** 2) ** .5 * .78, -.78) for x in [lerp(-.58, .58, k / 20) for k in range(21)]]
car.tube('cage', hoop, .02, 'GLOSSBLACK', res=4)
car.extrude_y('Floor', [(-.86, -2.1), (.86, -2.1), (.86, 2.0), (-.86, 2.0)], .14, .16, 'GLOSSBLACK')

# ---------------------------------------------------------------- vinyl shell: the lime slashes ride on this, 4 mm off the flanks
def vinyl_shell():
    me = car.body.data; bm = bmesh.new(); bm.from_mesh(me)
    pi = next(i for i, m in enumerate(me.materials) if m.name.split('.')[0] == 'PAINT')
    keep = [f for f in bm.faces if f.material_index == pi and -2.22 < -f.calc_center_median().y < .66 and .2 < f.calc_center_median().z < .97 and abs(f.normal.x) > .45]
    drop = [f for f in bm.faces if f not in set(keep)]; bmesh.ops.delete(bm, geom=drop, context='FACES')
    for v in bm.verts:
        n = v.normal; v.co = v.co + n * .004
    for f in bm.faces: f.material_index = 0
    vm = bpy.data.meshes.new('Vinyl'); bm.to_mesh(vm); bm.free(); vm.materials.clear(); vm.materials.append(car.M['VINYL']); vm.shade_smooth()
    car.link(bpy.data.objects.new('Vinyl', vm))
skin_normals(); bpy.data.objects.remove(SKIN0)
vinyl_shell()
objs = car.objs(); result = car.stats(); print(result)
print('stations: head z %.3f  tail z %.3f  plate z %.3f  pop y %.3f' % (FZ(.42, .515), BZ(.6, .76), BZ(0, .5), (TY(.6, 1.93) or 0)))
