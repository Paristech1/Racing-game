"""AFTERHOURS — GRAN FOUR (v3), built in Blender on carlib.py from Paris's Midjourney turnaround sheet (four views of a
matte pale-gray four-door GT). Traced feature by feature:
Front: a tall blunt nose carrying a big proud rounded-rectangle grille of vertical slats, slim LED headlamps tucked into
the upper corners with a DRL that runs along the lower edge and hooks down beside the grille, a wide black slot under the
grille, vertical black air curtains in the bumper corners, a black splitter blade edged in yellow.
Hood: long, a centre power dome between crowned fenders, the cowl set far back over the front doors.
Flanks: big four-door panels, the front door's leading edge chasing the front arch, the rear door's trailing edge
curving round the haunch, a concave lower door, thin black sills with a yellow line that carries on from the splitter,
flush handles, door mirrors, a low glasshouse with a silver DLO, black B-pillar and a pointed rear quarter window.
Roof: dark glass, thin yellow line along each roof rail.
Rear: wide haunches, a short deck with a black lip spoiler, slim white LED blades ending in red brackets at the
corners, a black lower band with two rectangular tailpipes.
Wheels (BODIES.granfour): x +-.84, z +-1.5, r .38 (turbine wheels are built in js/afterhours.js, wheelStyle 'turbine').
Headless (pip bpy): exec carlib.py, then this file in the same namespace."""
car = Car('Gran Four', paint=(.42, .42, .40), accent=(1., .66, .05))
DETAIL = globals().get('DETAIL', 1)

def mk(name, col, metal=0., rough=.5, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
car.M['INTERIOR'] = mk('INTERIOR', (.012, .012, .014), 0., .7)
car.M['TAILW'] = mk('TAILW', (1., .9, .9), 0., .3, emit=(1., .9, .9), strength=6.)
car.M['GRILLE'] = mk('GRILLE', (.16, .165, .175), .85, .3)           # dark gunmetal slats
car.M['YELLOW'] = mk('YELLOW', (1., .62, .03), 0., .35)                # accent lines (not lit)
car.M['REFLECT'] = mk('REFLECT', (.5, .02, .02), 0., .3)
car.M['LENS'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.01, .011, .013, 1)   # smoked lens
pb = car.M['PAINT'].node_tree.nodes['Principled BSDF']; pb.inputs['Metallic'].default_value = .3; pb.inputs['Roughness'].default_value = .42

# ---------------------------------------------------------------- body
# 4.92 m long, 3.0 m wheelbase, 1.96 m wide, 1.40 m tall. Tall blunt nose (bonnet ~.80 at the grille), hood rising to a
# cowl at ~.99 far back over the front doors, a belt that climbs gently to wide high rear haunches, a short deck at ~1.04.
Z0, Z1, WB, WR, TR = -2.45, 2.47, 1.5, .395, .8
HW = [[-2.45, .78], [-2.41, .86], [-2.33, .925], [-2.15, .968], [-1.8, .995], [-1.5, 1.0], [-1.05, .968], [-.5, .938], [.2, .932],
      [.85, .942], [1.5, .985], [1.85, .968], [2.02, .955], [2.15, .93], [2.26, .89], [2.35, .83], [2.42, .74], [2.47, .6]]   # broad nose, corners rounding back to the arches
HW = [[z, w + .035 * (1 - smooth(2.15, 2.45, z)) * (1 - smooth(-2.3, -2.45, z))] for z, w in HW]   # wider, lower stance (sheet front/rear views)
YB = [[-2.45, .4], [-2.41, .3], [-2.3, .2], [-2.1, .16], [2.15, .155], [2.36, .165], [2.47, .18]]
YT = [[-2.45, .86], [-2.42, .93], [-2.36, .98], [-2.2, 1.02], [-1.9, 1.035], [-1.4, 1.03], [-.8, 1.0], [0, .975], [.6, .965],
      [.95, .955], [1.3, .94], [1.7, .89], [2.05, .84], [2.3, .795], [2.42, .77], [2.47, .75]]
YS = [[-2.45, .8], [-2.41, .86], [-2.32, .91], [-2.1, .945], [-1.7, .955], [-1.2, .925], [-.5, .88], [.3, .865], [.9, .865],
      [1.45, .912], [1.9, .862], [2.2, .8], [2.38, .765], [2.47, .72]]
def dome(x, z):
    """hood: one broad centre power dome running up to the cowl, fading out just behind the grille"""
    a = abs(x); hz = smooth(1.0, 1.35, z) * (1 - smooth(2.2, 2.42, z))
    return .03 * hz * math.exp(-(a / .28) ** 2) - .014 * hz * smooth(.38, .55, a) * (1 - smooth(.6, .74, a))   # dome, then a valley before the fender crowns
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .07, 'NS': 340 if DETAIL else 170, 'res': 2 if DETAIL else 1,
    'Rx': lambda z: lerp(.12, .17, smooth(-1.0, -1.8, z)),
    'tumble': lambda z: .1 - .015 * smooth(-1.2, -2.0, z) + .02 * smooth(.9, 1.4, z) * (1 - smooth(1.9, 2.3, z)),
    'round_nose': .11, 'round_tail': .1, 'bulge_at': .44, 'dome': dome,
    'feature': lambda z: .026 * smooth(-2.35, -2.1, z) * (1 - smooth(2.1, 2.35, z)),     # crisp shoulder line
    'swage': (lambda z: lerp(.40, .52, smooth(.9, -1.0, z)), lambda z: smooth(1.05, .8, z) * (1 - smooth(-.9, -1.05, z)), .05, .09),   # concave lower doors
    'lean': lambda y, z: -.09 * smooth(2.15, 2.47, z) * (car.h_of(y, z) - .5) - .04 * smooth(-2.3, -2.45, z) * (car.h_of(y, z) - .5)})
SKIN0 = bpy.data.objects.new('Skin0', car.body.data.copy()); car.scene.collection.objects.link(SKIN0)   # uncut skin, for normals
def skin_normals():
    me = car.body.data; vg = car.body.vertex_groups.get('skin') or car.body.vertex_groups.new(name='skin')
    keep = set()
    for p_ in me.polygons:
        if me.materials[p_.material_index].name.split('.')[0] == 'PAINT': keep.update(p_.vertices)
    vg.add(list(keep), 1., 'REPLACE')
    mod = car.body.modifiers.new('skinN', 'DATA_TRANSFER'); mod.object = SKIN0; mod.use_loop_data = True
    mod.data_types_loops = {'CUSTOM_NORMAL'}; mod.loop_mapping = 'POLYINTERP_NEAREST'; mod.vertex_group = 'skin'
    nm = bpy.data.meshes.new_from_object(car.body.evaluated_get(car.DG())); car.body.modifiers.clear(); om = car.body.data; car.body.data = nm; bpy.data.meshes.remove(om)
    car.body.vertex_groups.clear()
ARCH_R = .44
for sd in (1, -1):
    car.cyl_x(f'archF{sd}', WR, WB, ARCH_R, sd * .58, sd * 1.4)
    car.cyl_x(f'archR{sd}', WR, -WB, ARCH_R, sd * .58, sd * 1.4)
car.apply_cuts()
car.sharpen(car.body, 55); car.bvh = car.BV()
car.arch_liners(WB, WR, ARCH_R, x0=.5, x1=.92)

# ---------------------------------------------------------------- helpers (as autobahn_63.py)
BV0 = car.BV()
def FZ(x, y):
    h = BV0.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else 2.3
def BZ(x, y):
    h = BV0.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else -2.35
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
    bm.to_mesh(ob.data); bm.free(); return ob
def rr_tube(name, cx, cy, w, h, r, z0, z1, m, wall=.008, n=6):
    o = Car.rounded(cx, cy, w, h, r, n); i_ = Car.rounded(cx, cy, w - 2 * wall, h - 2 * wall, max(r - wall, .002), n); k = len(o)
    verts = [G(x, y, z0) for x, y in o] + [G(x, y, z1) for x, y in o] + [G(x, y, z1) for x, y in i_] + [G(x, y, z0 + .02) for x, y in i_]
    faces = []
    for j in range(k):
        a, b = j, (j + 1) % k
        faces += [(a, b, k + b, k + a), (k + a, k + b, 2 * k + b, 2 * k + a), (2 * k + a, 2 * k + b, 3 * k + b, 3 * k + a)]
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob)
    car.new_obj(name + 'core', [G(x, y, z0 + .03) for x, y in i_], [tuple(range(k))], 'GAP', False)
    return ob

# ---------------------------------------------------------------- nose openings
GRILLE = Car.rounded(0, .595, .74, .3, .06, 6)                                   # the big proud slat grille
pocket('grille', GRILLE, .05, m='GAP', per=4)
SLOT = [(-.36, .4), (.36, .4), (.42, .23), (-.42, .23)]                      # centre lower slot under it
pocket('slot', SLOT, .1, per=8)
INTAKE = [(.44, .4), (.62, .465), (.79, .475), (.81, .3), (.75, .225), (.5, .225), (.44, .3)]   # big corner intakes under the lamps
HEAD_L = [(.39, .742), (.55, .75), (.69, .76), (.79, .773), (.86, .785), (.862, .74), (.85, .7), (.83, .7), (.79, .73), (.68, .706), (.55, .69), (.39, .688)]
for sd in (1, -1):
    pocket(f'head{sd}', [(sd * x, y) for x, y in HEAD_L], .035, per=6)
    pocket(f'intake{sd}', [(sd * x, y) for x, y in INTAKE], .11, per=8)
# ---------------------------------------------------------------- tail openings
pocket('rlow', [(-.82, .2), (.82, .2), (.82, .4), (.72, .42), (.5, .42), (.4, .36), (-.4, .36), (-.5, .42), (-.72, .42), (-.82, .4)], .03, back=True, per=8)   # black lower band, centre stepped down
# ---------------------------------------------------------------- shut lines: four doors, fuel door
for sd in (1, -1):
    def side_line(name, pts_zy):
        pts = []
        for z, y in pts_zy:
            x = car.surf_side(y, z, sd)
            if x: pts.append((sd * x, y, z))
        if len(pts) > 2: car.strip_cut(name, pts, .0032, .012)
    # front door leading edge: down from the A-pillar base, chasing the front arch
    side_line(f'dF{sd}', [(lerp(.86, 1.0, smooth(0, 1, k / 15)) - .04 * math.sin(k / 15 * math.pi), lerp(.98, .26, k / 15)) for k in range(16)])
    # B-pillar split, slightly raked
    side_line(f'dB{sd}', [(lerp(-.08, -.02, k / 13), lerp(.99, .26, k / 13)) for k in range(14)])
    # rear door trailing edge: from the quarter-window corner, bowing back round the haunch and down in front of the rear arch
    side_line(f'dR{sd}', [(-1.22 - .2 * math.sin(k / 15 * math.pi * .9) + .14 * (k / 15) ** 2, lerp(1.0, .26, k / 15)) for k in range(16)])
    pts = []
    for k in range(18):
        z = lerp(.98, 2.2, k / 17); x = sd * lerp(.7, .74, (k / 17) ** 2); y = car.surf_y(x, z)
        if y: pts.append((x, y, z))
    car.strip_cut(f'hood{sd}', pts, .0032, .012, axis='top')
car.apply_cuts()
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: -1.07 < gz < 1.07 and gy < .215 and abs(n[0]) > .3)   # thin black sills
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: gz > 2.25 and gy < .215)                             # chin
car.sharpen(car.body, 55); car.bvh = car.BV()

# ---------------------------------------------------------------- cabin: low fastback glasshouse under a glass roof
CH = [[-2.12, 1.05], [-1.95, 1.1], [-1.7, 1.18], [-1.4, 1.27], [-1.1, 1.325], [-.75, 1.37], [-.4, 1.392], [-.1, 1.398], [.15, 1.385],
      [.38, 1.345], [.58, 1.262], [.75, 1.155], [.89, 1.06], [.98, .99]]
def roof_y(z): return kf(CH, z)
car.build_cabin({'CZ0': -2.12, 'CZ1': .98, 'NC': 260 if DETAIL else 120, 'CH': CH, 'dlo': (.84, .6, -1.62, -1.36), 'rear_glass': 9., 'dlo_trim': 'CHROME',
    'pillars': [(-.1, -.0)], 'apillar_r': .016,
    'cw': lambda z: kf(HW, z) - .24 - .07 * smooth(-1.5, -2.12, z) - .07 * smooth(.62, .98, z),
    'rw': lambda z: kf(HW, z) - .48 - .03 * smooth(-1.4, -2.12, z) - .08 * smooth(.42, .98, z)})
# thin yellow line along each roof rail
for sd in (1, -1):
    pts = []
    for k in range(26):
        z = lerp(car.a_line(.6) - .02, -1.95, k / 25); x, y = car.ring_pt(z, .6, .007); pts.append((sd * x, y, z))
    car.tube(f'rail{sd}', pts, .0055, 'YELLOW', res=4)

# ---------------------------------------------------------------- front details
# grille (#04): a proud shield. Gloss-black frame standing ~4 cm off the nose, a dark back plate, ~30 vertical slats
# whose faces bow forward in the middle
GF = [(x, y) for x, y in GRILLE]
def gsurf(x, y): return FZ(x * .97, min(y, .7)) 
GZ = max(gsurf(x, y) for x, y in GF)                       # foremost skin point under the frame
def gzf(x, y): return GZ + .035 - .025 * (x / .37) ** 2 - .012 * ((y - .595) / .16) ** 2     # the shield's convex front
ring_o = Car.rounded(0, .595, .76, .32, .07, 6); ring_i = Car.rounded(0, .595, .7, .26, .045, 6); k = len(ring_o)
verts = [G(x, y, gzf(x, y)) for x, y in ring_o] + [G(x, y, gzf(x, y)) for x, y in ring_i] + \
        [G(x, y, gsurf(x, y) - .03) for x, y in ring_o] + [G(x, y, gzf(x, y) - .05) for x, y in ring_i]
faces = []
for j in range(k):
    a_, b_ = j, (j + 1) % k
    faces += [(a_, b_, k + b_, k + a_), (2 * k + b_, 2 * k + a_, a_, b_)[::-1], (k + a_, k + b_, 3 * k + b_, 3 * k + a_)]
fob = car.new_obj('gframe', verts, faces, 'GLOSSBLACK'); car.fixn(fob)
grid('gback', lambda u, v: (lerp(-.36, .36, u), lerp(.45, .74, v), GZ - .06), 20, 6, 'GAP')
NSL = 25 if DETAIL else 17
for k in range(NSL):   # each slat a rounded vertical rod with a fin behind it, so every one catches its own highlight
    x = lerp(-.33, .33, k / (NSL - 1)); ytop = .72 - .006 * (x / .35) ** 4; ybot = .47 + .006 * (x / .35) ** 4
    zf = gzf(x, .595) - .014
    car.cyl(f'slat{k}', (x, ybot, zf - .004), (x, ytop, zf - .004), .0085, 'GRILLE', seg=12)
    car.box(f'slatfin{k}', (.006, ytop - ybot, .06), (x, (ytop + ybot) / 2, zf - .035), 'GRILLE')
for sd in (1, -1):
    # LED DRL (#03): along the lamp's lower edge, hooking down beside the grille; projector cells behind a smoked lens
    drl = [(sd * x, y, FZ(sd * x, y) - .01) for x, y in [(.41, .697), (.55, .701), (.68, .716), (.78, .736), (.83, .748), (.845, .735), (.842, .71)]]
    car.tube(f'drl{sd}', drl, .0055, 'HEAD', res=8)
    for j, (x, y) in enumerate([(.52, .72), (.61, .726), (.7, .737)]):
        zf = FZ(sd * x, y) - .024
        car.cyl(f'proj{sd}{j}', (sd * x, y, zf), (sd * x, y, zf + .008), .013, 'CHROME', seg=24)
    def hl(u, v, sd=sd):
        x = lerp(.395, .85, u); y0 = lerp(.692, .735, u ** 1.4); y = lerp(y0, y0 + .048 - .006 * u, v); return (sd * x, y, FZ(sd * x, y) - .003)
    grid(f'hlens{sd}', hl, 24, 3, 'LENS', flip=sd < 0)
    # corner intake: a horizontal gloss-black blade across it, dark mesh behind
    car.tube(f'iblade{sd}', [(sd * x, .33, FZ(sd * x, .33) - .035) for x in [lerp(.46, .79, k / 8) for k in range(9)]], .009, 'GLOSSBLACK', res=3)
    grid(f'imesh{sd}', lambda u, v, sd=sd: (sd * lerp(.45, .8, u), lerp(.23, .47, v), FZ(sd * lerp(.45, .8, u), lerp(.23, .47, v)) - .1), 12, 6, 'GAP', flip=sd < 0)
for k in range(2):
    y = .28 + k * .055; car.box(f'sblade{k}', (.78, .007, .03), (0, y, FZ(0, y) - .05), 'GLOSSBLACK', rot=(-.2, 0, 0))
# splitter (#05): a black blade proud of the chin, edged in yellow; the edge carries on along each side to the front arch
def foot(x):   # skin footprint at bumper height, pushed out a little
    z = FZ(x, .22); return z + .035
SPL = []
for k in range(65):
    x = lerp(-.86, .86, k / 64); SPL.append((x * 1.02, foot(x)))
for sd_ in (1, -1):   # run the ends back along the sides to the front arch
    tail = [(sd_ * ((car.surf_side(.22, z) or .9) + .03), z) for z in [lerp(SPL[-1 if sd_ > 0 else 0][1] - .02, 1.95, k / 6) for k in range(7)]]
    SPL = SPL + tail if sd_ > 0 else list(reversed(tail)) + SPL
bevel_obj(car.extrude_y('Splitter', SPL, .13, .152, 'GLOSSBLACK'), .004)
car.tube('splitY', [(x * 1.004, .141, z + .004 * (z > 2.2)) for x, z in SPL], .0065, 'YELLOW', res=4)

# ---------------------------------------------------------------- flanks
for sd in (1, -1):
    # flush handles: front door and rear door, just under the shoulder
    for z in (.18, -.86):
        y = kf(YS, z) - .07; x = car.surf_side(y, z, sd)
        if x: car.box(f'handle{sd}{z}', (.007, .014, .17), (sd * (x + .002), y, z), 'SATIN')
    # sill blade with the yellow line along its bottom edge (continues from the splitter)
    sill = []
    for i in range(41):
        zz = lerp(-1.06, 1.06, i / 40); x = car.surf_side(.27, zz, sd) or .92
        sill.append([G(sd * (x - .07), .15, zz), G(sd * (x + .012), .15, zz), G(sd * (x + .016), .172, zz), G(sd * (x - .07), .21, zz)])
    car.loft(f'Sill{sd}', sill, 'GLOSSBLACK', smooth_=False)
    car.tube(f'sillY{sd}', [(sd * ((car.surf_side(.27, zz, sd) or .92) + .02), .155, zz) for zz in [lerp(-1.04, 1.04, k / 24) for k in range(25)]], .0055, 'YELLOW', res=4)
    # door mirror: black blade stalk off the front door, body-colour cap
    mz = .62; my = car.belt(mz) + .02; mx = car.C['cw'](mz)
    car.tube(f'mstalk{sd}', [(sd * (mx - .02), my - .015, mz), (sd * (mx + .06), my + .012, mz - .02), (sd * (mx + .11), my + .03, mz - .04)], .01, 'GLOSSBLACK', res=4)
    b = bmesh.new(); bmesh.ops.create_uvsphere(b, u_segments=32, v_segments=16, radius=1.)
    for v in b.verts:
        gx, gy, gz = v.co.x * .1, v.co.z * .042, v.co.y * .075
        if gz < 0: gz *= .3
        v.co = G(sd * (mx + .17) + gx, my + .045 + gy, mz - .07 + gz)
    me = bpy.data.meshes.new(f'mcap{sd}'); b.to_mesh(me); b.free(); me.materials.append(car.M['PAINT']); me.shade_smooth(); car.link(bpy.data.objects.new(f'mcap{sd}', me))
    car.box(f'mglass{sd}', (.17, .06, .006), (sd * (mx + .17), my + .045, mz - .095), 'GLOSSBLACK')

# ---------------------------------------------------------------- tail
def tailpt(x, y, off=.012): return (x, y, BZ(x, y) - off)
for sd in (1, -1):
    # lamp cluster at each end of the light bar: red bracket wrapping the corner, a white LED stroke inside it
    # cluster (blueprint #10): two stacked red brackets wrapping the corner over a smoked lens
    for dy, w in ((0., .01), (-.05, .009)):
        brk = [(.46, .9 + dy), (.66, .904 + dy), (.78, .9 + dy), (.83, .886 + dy), (.84, .866 + dy), (.81, .858 + dy), (.58, .862 + dy)]
        car.tube(f'tbrk{sd}{dy}', [tailpt(sd * x, y, .011) for x, y in brk], w, 'TAIL', res=6)
    grid(f'tlens{sd}', lambda u, v, sd=sd: (lambda x, y: (x, y, BZ(x, y) - .004))(sd * lerp(.46, .835, u), lerp(.806, .906, v)), 16, 4, 'LENS', flip=sd > 0)
    # red reflector slivers low on the bumper corners
    x, y = .86, .42; car.box(f'refl{sd}', (.012, .06, .012), (sd * x, y, BZ(sd * x, y) + .02), 'REFLECT')
    # rectangular tailpipes in the black band
    x, y = .56, .32; zt = BZ(sd * x, y)
    rr_tube(f'exh{sd}', sd * x, y, .2, .065, .018, zt + .05, zt - .02, 'CHROME')
# bumper crease under the lamps (the deck lid's lower edge) and the vertical lid shut lines
car.tube('tcrease', [tailpt(x, .79, .002) for x in [lerp(-.78, .78, k / 40) for k in range(41)]], .0032, 'GAP', res=3)
for sd in (1, -1): car.tube(f'tlid{sd}', [tailpt(sd * .82, y, .002) for y in [lerp(.79, .93, k / 6) for k in range(7)]], .0028, 'GAP', res=3)
# full-width light bar (#10): one red blade right across the tail, joining the two corner clusters
car.tube('tailbar', [tailpt(x, .896, .011) for x in [lerp(-.52, .52, k / 40) for k in range(41)]], .0075, 'TAIL', res=8)
# diffuser (#11): vertical gloss-black strakes across the middle of the black band
for k in range(7):
    x = -.33 + k * .11; zt = BZ(x, .3)
    car.extrude_x(f'dfin{k}', [(-2.12, .19), (zt + .015, .19), (zt + .005, .4), (-2.25, .4)], x - .006, x + .006, 'GLOSSBLACK')
# black lip spoiler across the deck edge, its tips kicked up
def foil(chord, thick, n=16):
    up, lo = [], []
    for k in range(n + 1):
        t = k / n; xc = (1 - math.cos(math.pi * t)) / 2
        yt = 5 * thick * (.2969 * math.sqrt(xc) - .126 * xc - .3516 * xc ** 2 + .2843 * xc ** 3 - .1036 * xc ** 4)
        up.append((-xc * chord, yt * chord)); lo.append((-xc * chord, -yt * chord))
    return up + list(reversed(lo[1:-1]))
SEC = foil(.15, .09, 16); WS = []; WZ = -2.28
for i in range(61):
    t = i / 60; x = lerp(-.8, .8, t); a = abs(x)
    ys = car.surf_y(min(a, .8) * (1 if x >= 0 else -1), WZ - .05) or 1.0
    y = ys + .035 + .022 * smooth(.6, .8, a); tilt = -.18 - .18 * smooth(.6, .8, a)
    ring = []
    for z, yy in SEC:
        zz = z * math.cos(tilt) - yy * math.sin(tilt); y2 = z * math.sin(tilt) + yy * math.cos(tilt)
        ring.append(G(x, y + y2, WZ + zz))
    WS.append(ring)
car.loft('Spoiler', WS, 'GLOSSBLACK')
for sd in (1, -1):
    x = sd * .5; y0 = car.surf_y(x, WZ - .06) or 1.0
    car.extrude_x(f'sstrut{sd}', [(WZ - .02, y0 - .01), (WZ - .11, y0 - .01), (WZ - .1, y0 + .04), (WZ - .04, y0 + .04)], x - .006, x + .006, 'GLOSSBLACK')

# ---------------------------------------------------------------- inside (seen through the glass)
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
    for zs in (.05, -.92):
        x = sd * .38
        car.box(f'seatback{sd}{zs}', (.46, .6, .08), (x, .93, zs - .3), 'INTERIOR', rot=(-.25, 0, 0))
        car.box(f'headrest{sd}{zs}', (.26, .16, .08), (x, 1.2 if zs > 0 else 1.1, zs - .36), 'INTERIOR', rot=(-.25, 0, 0))
        car.box(f'cushion{sd}{zs}', (.42, .08, .44), (x, .64, zs - .05), 'INTERIOR')
car.box('dash', (1.6, .12, .36), (0, .88, .6), 'INTERIOR', rot=(.25, 0, 0))
car.box('console', (.22, .14, 1.5), (0, .6, -.15), 'INTERIOR')
car.box('screen', (.42, .2, .015), (0, 1.0, .45), 'GLOSSBLACK', rot=(-.3, 0, 0))
sw = [(.38 + .17 * math.cos(2 * math.pi * k / 32), .94 + .17 * math.sin(2 * math.pi * k / 32) * .92, .36 + .17 * math.sin(2 * math.pi * k / 32) * .38) for k in range(33)]
car.tube('steer', sw, .016, 'INTERIOR', res=4)

skin_normals(); bpy.data.objects.remove(SKIN0)
objs = car.objs(); result = car.stats(); print(result)
print('stations: grille z %.3f, head z %.3f, plate z %.3f, tail z %.3f' % (FZ(0, .585), FZ(.64, .72), BZ(0, .66), BZ(.7, .87)))
print('GF_HW', HW); print('GF_YS', YS); print('GF_YB', YB)
