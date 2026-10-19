"""AFTERHOURS — Event 16 "Last Call" kit (Blender 5.x, bpy). Built against the Midjourney key frames listed in
docs/lastcall/mj-prompts.md. Game coords: x right, y up, z forward; Blender (x, -z, y). kitlib.py supplies Acc.

Assets (Empty + one mesh per material, origin at grade):
  HaloTower   — (frames 01/02) the Port Richmond vent hall the first loop runs inside: an elliptical glass drum on a dark
                plinth, steel fins, horizontal magenta LED bands with one cyan band, a ribbed glass dome with a crown ring
                and aviation lamps, road openings at both ends. Origin = middle of the loop, +z along the road.
  RingPylon   — (frames 03/04) the Ring's structure: two raked A-pylons either side of the loop, a lit cross girder over the
                crown, cable fans down to the loop's deck edges. Origin = the loop's entry point, +z forward; the cable
                anchors are computed from the same eased-loop formula the game uses (len 300 m, drift 17 m).
  LCPortal    — (frame 05) the sculpted white tunnel hood with an inset LED ring. Origin = road centre at the mouth, tube +z.
  Battleship  — (frames 05/11) an Iowa-class battleship museum: lofted hull with sheer and flare, deck, stepped
                superstructure, three triple turrets, funnels, mast, secondary mounts, lit ports. Bow +z, origin at waterline.
  Carousel    — (frame 07) Franklin Square carousel: platform, horses on brass poles, scalloped canopy rimmed with bulbs.
  Fountain    — (frame 07) the Franklin Square fountain: round basin, tiered bowls, lit jets.
  StoneArch   — (frame 08) the Valley Green stone bridge: segmental arch, voussoirs, parapets. Deck level y = 0, span along z.
  Inn         — (frame 08) Valley Green Inn: fieldstone, gable roof, long porch, lit windows. Facade +x.
  ForkGantry  — (frame 12) dark steel truss sign bridge, 30 m span; the game hangs the SHORTCUT sign on it.
  Cushion     — (frame 12) yellow-and-black crash cushion for a gore point, nose -z.
  CasinoTower — (frame 10) the riverside casino: glass tower with pink neon fins and a lit crown.
  FlagPole    — (frame 13) Parkway flag: pole, finial, flag (PAINT is tinted per instance).

CLI:  python3 lastcall_kit.py --out ../../models/lastcall_kit.glb      (bpy pip module, headless)
      add --render <prefix> for Cycles look-dev stills of every asset.
"""
import bpy, bmesh, math, os, sys, random
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'kitlib.py')).read())
ARGV = sys.argv
OUT = ARGV[ARGV.index('--out') + 1] if '--out' in ARGV else None
RENDER = ARGV[ARGV.index('--render') + 1] if '--render' in ARGV else None
R = random.Random(16)
if OUT: bpy.ops.wm.read_factory_settings(use_empty=True)
new_scene('LastCall Kit')

def mat(n, col, metal=0., rough=.6, emit=None, strength=4., alpha=None):
    m = bpy.data.materials.new(n); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    if alpha is not None: b.inputs['Alpha'].default_value = alpha
    M[n] = m; return m
# material slots: the contract with lcKitMats() in js/afterhours.js
mat('STEEL', (.2, .22, .25), .85, .32); mat('DARK', (.025, .027, .03), .35, .5); mat('CONCRETE', (.42, .42, .43), 0, .88)
mat('WHITE', (.86, .87, .88), .05, .32); mat('GLASS', (.08, .12, .16), .4, .05, alpha=.25)
mat('LEDA', (1, .2, .7), 0, .3, (1, .15, .65), 12.); mat('LEDB', (.2, .9, 1), 0, .3, (.2, .9, 1), 12.)
mat('LED', (1, 1, 1), 0, .3, (1, .97, .92), 10.); mat('EMBER', (1, .45, .15), 0, .3, (1, .42, .12), 10.)
mat('REDLAMP', (1, .1, .08), 0, .3, (1, .08, .05), 14.); mat('LAMP', (1, .9, .7), 0, .3, (1, .82, .55), 8.)
mat('WINLIT', (1, .75, .45), 0, .4, (1, .7, .4), 3.); mat('HULL', (.34, .36, .38), .3, .55); mat('HULLDARK', (.12, .13, .14), .3, .6)
mat('TEAK', (.42, .3, .2), 0, .75); mat('BRASS', (.75, .58, .3), .9, .3); mat('BULB', (1, .86, .55), 0, .3, (1, .8, .45), 9.)
mat('CANOPY', (.55, .08, .1), .1, .55); mat('CANOPY2', (.92, .86, .72), .05, .5); mat('PAINT', (.8, .8, .8), .1, .6)
mat('HORSE', (.92, .9, .86), .1, .35); mat('WATER', (.05, .1, .14), .6, .05); mat('JET', (.75, .9, 1), 0, .2, (.6, .85, 1), 5.)
mat('STONE', (.46, .43, .38), 0, .9); mat('STONE2', (.36, .34, .31), 0, .92); mat('SLATE', (.15, .17, .2), .2, .55)
mat('TRIM', (.86, .82, .74), 0, .6); mat('YELLOW', (1, .78, .05), .1, .45); mat('NEONA', (1, .25, .6), 0, .3, (1, .2, .6), 12.)
mat('SIGNBACK', (.18, .2, .22), .6, .4)

def bevel_obj(obs, keys, off=.05, seg=2):
    """round the hard edges of the listed material parts so corners catch the night rig (kit detail policy)"""
    for ob in obs:
        if ob.data.materials[0].name.split('.')[0] not in keys: continue
        bm = bmesh.new(); bm.from_mesh(ob.data)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
        edges = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > math.radians(50)]
        if edges: bmesh.ops.bevel(bm, geom=edges, offset=off, segments=seg, profile=.5, affect='EDGES', clamp_overlap=True)
        bm.to_mesh(ob.data); bm.free()
def beam(a, m, p0, p1, w0, w1, d0, d1):
    """a tapered box from p0 to p1 (game coords): width along world x-ish, depth across it"""
    p0, p1 = Vector(p0), Vector(p1); t = (p1 - p0).normalized()
    side = Vector((1, 0, 0)) if abs(t.x) < .9 else Vector((0, 0, 1)); u = (side - t * side.dot(t)).normalized(); v = t.cross(u)
    V = []
    for P, w, d in ((p0, w0, d0), (p1, w1, d1)):
        for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1)): V.append(tuple(P + u * sx * w / 2 + v * sz * d / 2))
    a.poly(m, V, [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
roots = {}
def done(acc, bev=('STEEL', 'CONCRETE', 'WHITE', 'STONE', 'STONE2', 'DARK', 'HULL', 'TRIM'), off=.05):
    obs = acc.build(); bevel_obj(obs, bev, off); roots[acc.name] = obs[0].parent; return obs

def ellipse(a, b, n, t0=0.):
    return [(b * math.sin(TAU * k / n + t0), a * math.cos(TAU * k / n + t0)) for k in range(n)]   # (x, z)

# ------------------------------------------------------------------ the eased loop (same formula as lcLoopPts in the game)
def loop_pts(Ll, drift, side=1):
    n = int(Ll); ds = Ll / n; phi = 0.; P = Vector((0, 0, 0)); out = []; ups = []
    t0 = Vector((0, 0, 1)); u0 = Vector((0, 1, 0)); r0 = t0.cross(u0)    # game R = T x U (local -x)
    lat = lambda s: side * drift * (.5 - .5 * math.cos(math.pi * s / Ll))
    for i in range(n):
        s = i * ds; phi += TAU / Ll * (1 - math.cos(TAU * s / Ll)) * ds
        t = t0 * math.cos(phi) + u0 * math.sin(phi); u = -t0 * math.sin(phi) + u0 * math.cos(phi)
        P = P + t * ds + r0 * (lat(s + ds) - lat(s)); out.append(P.copy()); ups.append(u)
    return out, ups, r0

# ================================================================== HaloTower
def halo_tower():
    a = Acc('HaloTower'); A, B, H, DOME = 76., 31., 60., 13.          # semi-axes along / across the road, wall height, dome rise
    NF = 96; pts = ellipse(A, B, NF)
    door = lambda x, z: abs(z) > A * .86 and abs(x) < 21               # road openings at both ends (entry lane -8.5 m, exit +8.5 m)
    # plinth: dark concrete band 4 m, with the doors cut
    for k in range(NF):
        x0, z0 = pts[k]; x1, z1 = pts[(k + 1) % NF]
        if door((x0 + x1) / 2, (z0 + z1) / 2): continue
        nx, nz = x0 * 1.03, z0 * 1.03; mx, mz = x1 * 1.03, z1 * 1.03
        a.poly('DARK', [(nx, 0, nz), (mx, 0, mz), (mx, 4, mz), (nx, 4, nz)], [(0, 1, 2, 3)])
        a.poly('DARK', [(x0, 4, z0), (x1, 4, z1), (mx, 4, mz), (nx, 4, nz)], [(0, 1, 2, 3)])
    # door frames: lit portal surrounds
    for sz in (-1, 1):
        zc = sz * A * .985
        for sx in (-1, 1): a.box('STEEL', sx * 21.5, 7, zc, 1.6, 14, 2.2)
        a.box('STEEL', 0, 14.6, zc, 44.6, 1.6, 2.2); a.box('LEDB', 0, 13.7, zc - sz * 1.15, 42, .25, .12)
        for sx in (-1, 1): a.box('LEDB', sx * 20.6, 6.9, zc - sz * 1.15, .25, 13.6, .12)
    # glass skin and the fins
    for k in range(NF):
        x0, z0 = pts[k]; x1, z1 = pts[(k + 1) % NF]; xm, zm = (x0 + x1) / 2, (z0 + z1) / 2
        ylo = 15.4 if door(xm, zm) else 4
        a.poly('GLASS', [(x0, ylo, z0), (x1, ylo, z1), (x1, H, z1), (x0, H, z0)], [(0, 1, 2, 3)])
        if k % 2 == 0 and not door(x0, z0):
            l = math.hypot(x0 / B / B, z0 / A / A) or 1; nx, nz = x0 / B / B / l, z0 / A / A / l   # outward normal
            ry = math.atan2(nx, nz)
            a.box('STEEL', x0 + nx * .6, (4 + H) / 2, z0 + nz * .6, .5, H - 4, 1.4, ry)
    # LED bands round the drum: magenta every 8 m, one cyan band at mid height (frame 01), and transoms
    for i, y in enumerate([8, 16, 24, 32, 40, 48, 56]):
        m = 'LEDB' if y == 32 else 'LEDA'
        ring = [(x * 1.006, y, z * 1.006) for x, z in pts] + [(pts[0][0] * 1.006, y, pts[0][1] * 1.006)]
        segs = []; cur = []
        for p in ring:
            if y < 15.5 and door(p[0], p[2]):
                if len(cur) > 1: segs.append(cur)
                cur = []
            else: cur.append(p)
        if len(cur) > 1: segs.append(cur)
        for sg in segs: a.tube(m, sg, .2 if m == 'LEDA' else .26, 5)
        ring2 = [(x * 1.012, y - 1.4, z * 1.012) for x, z in pts] + [(pts[0][0] * 1.012, y - 1.4, pts[0][1] * 1.012)]
        segs = []; cur = []
        for p in ring2:
            if y < 15.5 and door(p[0], p[2]):
                if len(cur) > 1: segs.append(cur)
                cur = []
            else: cur.append(p)
        if len(cur) > 1: segs.append(cur)
        for sg in segs: a.tube('STEEL', sg, .16, 4)
    # ribbed glass dome, crown ring, aviation lamps
    NR = 12
    for j in range(NR):
        y0 = H + DOME * math.sin(math.pi / 2 * j / NR); y1 = H + DOME * math.sin(math.pi / 2 * (j + 1) / NR)
        s0 = math.cos(math.pi / 2 * j / NR); s1 = math.cos(math.pi / 2 * (j + 1) / NR)
        s0 = max(s0, .08); s1 = max(s1, .08)
        for k in range(NF):
            x0, z0 = pts[k]; x1, z1 = pts[(k + 1) % NF]
            a.poly('GLASS', [(x0 * s0, y0, z0 * s0), (x1 * s0, y0, z1 * s0), (x1 * s1, y1, z1 * s1), (x0 * s1, y1, z0 * s1)], [(0, 1, 2, 3)])
    for k in range(0, NF, 4):
        x0, z0 = pts[k]; rib = [(x0 * max(.08, math.cos(math.pi / 2 * j / 24)), H + DOME * math.sin(math.pi / 2 * j / 24), z0 * max(.08, math.cos(math.pi / 2 * j / 24))) for j in range(25)]
        a.tube('STEEL', rib, .3, 5)
    crown = [(x * .1, H + DOME + .2, z * .1) for x, z in pts] + [(pts[0][0] * .1, H + DOME + .2, pts[0][1] * .1)]
    a.tube('LEDB', crown, .35, 6)
    a.tube('STEEL', [(x, H + .2, z) for x, z in pts] + [(pts[0][0], H + .2, pts[0][1])], .5, 6)
    for k in range(0, NF, 12):
        x, z = pts[k]; a.cyl('DARK', x, H + .5, z, .3, H + 2.2, seg=8); a.cyl('REDLAMP', x, H + 2.2, z, .45, H + 2.9, seg=8)
    # name band over the entry door
    a.box('SIGNBACK', 0, 18.4, -A * .995, 30, 4, .4)
    return done(a)

# ================================================================== RingPylon
def ring_pylon():
    a = Acc('RingPylon'); LL, DR = 300., 17.
    P, U, r0 = loop_pts(LL, DR)
    top = max(range(len(P)), key=lambda i: P[i].y)
    zc = P[top].z; xc = -DR / 2; Ht = P[top].y + 22                   # pylons straddle the loop at its crown
    halfw = 7 + 3.4
    xl, xr = xc - 30, xc + 30
    for xp in (xl, xr):
        lean = (xc - xp) * .18                                         # the legs rake in toward the loop
        for sz in (-1, 1):
            base = Vector((xp, 0, zc + sz * 30)); tip = Vector((xp + lean, Ht, zc + sz * 3))
            beam(a, 'WHITE', base, tip, 3.6, 1.6, 2.8, 1.3)
            a.tube('LED', [tuple(base + Vector((-(xp - xc) / abs(xp - xc) * 1.75, 0, 0))), tuple(tip + Vector((-(xp - xc) / abs(xp - xc) * .95, 0, 0)))], .12, 5)
            a.cyl('CONCRETE', base.x, 0, base.z, 3.4, 1.4, seg=12)
        a.box('WHITE', xp + lean, Ht + 1.2, zc, 3, 4, 9)                # pylon head
        a.cyl('REDLAMP', xp + lean, Ht + 3.2, zc, .5, Ht + 4, seg=8)
    # cross girder over the crown with an ember underside line (frame 03: ember outer edge)
    gx0, gx1 = xl + (xc - xl) * .18, xr + (xc - xr) * .18
    a.box('WHITE', (gx0 + gx1) / 2, Ht + 1.2, zc, gx1 - gx0, 2.6, 4)
    a.box('EMBER', (gx0 + gx1) / 2, Ht - .12, zc, gx1 - gx0 - 2, .2, 3)
    # cable fans: from each pylon head down to the deck edge on its side of the loop, every 12 m round the upper loop
    for i in range(0, len(P), 12):
        p, u = P[i], U[i]
        if p.y < 16: continue
        rr = r0                                                         # deck edges along R (constant here: the loop has no roll about t)
        for sd, xp in ((-1, xl), (1, xr)):
            lean = (xc - xp) * .18
            edge = p + rr * (-sd) * (halfw + .4) if False else p + Vector((sd * (halfw + .6), 0, 0)) + Vector((0, 0, 0))
            head = Vector((xp + lean, Ht - 2, zc))
            a.tube('STEEL', [tuple(head), tuple(edge - u * 1.2)], .09, 4)
    return done(a)

# ================================================================== LCPortal
def lc_portal():
    a = Acc('LCPortal'); W2, H2, D = 12.5, 10.5, 16.           # half width and height of the mouth, hood depth (back along -z)
    def arc(scale, z, n=40, y0=0.):
        return [(W2 * scale * math.cos(math.pi * k / n), y0 + H2 * scale * math.sin(math.pi * k / n), z) for k in range(n + 1)]
    # shell: lofted from the mouth (leaning out over the road, frame 05) back into the hill
    rings = [arc(1.32, 2.5), arc(1.22, 0), arc(1.14, -4), arc(1.1, -D)]
    inner = [arc(1.0, 1.2), arc(1.0, -D)]
    n = 41
    def loft(m, A_, B_, flip=False):
        V = A_ + B_; F = [((k, k + 1, n + k + 1, n + k) if not flip else (k, n + k, n + k + 1, k + 1)) for k in range(n - 1)]
        a.poly(m, V, F, smooth=True)
    for r0_, r1_ in zip(rings[:-1], rings[1:]): loft('WHITE', r0_, r1_)
    loft('WHITE', inner[0], inner[1], True)
    loft('WHITE', rings[0], inner[0], True)                       # the lip
    # inset LED ring and a second thinner ring (frame 05: cyan-white)
    a.tube('LED', [(x * .985, y * .985 + .1, 1.0) for x, y, z in arc(1.0, 1.0)], .22, 6)
    a.tube('LEDB', [(x, y, -.6) for x, y, z in arc(1.07, 0)], .1, 5)
    # wing walls into the hill
    for sx in (-1, 1):
        a.prism_z('CONCRETE', -2, 3.5, [(sx * W2 * 1.32, 0), (sx * (W2 * 1.32 + 16), 0), (sx * (W2 * 1.32 + 16), 4), (sx * W2 * 1.3, 9)])
    return done(a, bev=('CONCRETE',))

# ================================================================== Battleship
def battleship():
    a = Acc('Battleship'); Lh, Bh = 270., 33.
    def half_beam(z):              # z from -Lh/2 (stern) to +Lh/2 (bow)
        u = (z + Lh / 2) / Lh
        if u > .82: return Bh / 2 * max(.02, max(0., math.cos(min(1., (u - .82) / .18) * math.pi / 2)) ** 1.4)
        if u < .1: return Bh / 2 * (.72 + .28 * math.sin(u / .1 * math.pi / 2))
        return Bh / 2
    def deck_y(z):
        u = (z + Lh / 2) / Lh; return 9.5 + 5.5 * max(0, (u - .6) / .4) ** 2      # sheer rising to the bow
    NZ, NS = 90, 10
    secs = []
    for i in range(NZ + 1):
        z = -Lh / 2 + Lh * i / NZ; hb = half_beam(z); dy = deck_y(z)
        ring = []
        for k in range(NS + 1):                 # from keel (k=0) up to deck edge (k=NS), starboard side (+x)
            t = k / NS; y = -9 + (dy + 9) * t
            flare = 1 + .06 * max(0, (z / (Lh / 2) - .5)) * t
            x = hb * math.sin(math.pi / 2 * min(1, t * 1.6)) * flare
            ring.append((x, y, z))
        secs.append(ring)
    for sx in (1, -1):
        V = []; F = []
        for ring in secs:
            for x, y, z in ring: V.append((sx * x, y, z))
        for i in range(NZ):
            for k in range(NS):
                q = (i * (NS + 1) + k, (i + 1) * (NS + 1) + k, (i + 1) * (NS + 1) + k + 1, i * (NS + 1) + k + 1)
                F.append(q if sx > 0 else q[::-1])
        a.poly('HULL', V, F, smooth=True)
    # boot stripe at the waterline
    for sx in (1, -1):
        for i in range(NZ):
            z0 = secs[i][0][2]; z1 = secs[i + 1][0][2]; x0 = sx * half_beam(z0) * 1.004; x1 = sx * half_beam(z1) * 1.004
            a.poly('HULLDARK', [(x0, -.4, z0), (x1, -.4, z1), (x1, .9, z1), (x0, .9, z0)], [(0, 1, 2, 3) if sx > 0 else (3, 2, 1, 0)])
    # teak deck
    V = []; F = []
    for i in range(NZ + 1):
        z = secs[i][0][2]; hb = secs[i][-1][0]; y = secs[i][-1][1]; V += [(-hb, y, z), (hb, y, z)]
    for i in range(NZ): F.append((2 * i, 2 * i + 2, 2 * i + 3, 2 * i + 1))
    a.poly('TEAK', V, F)
    # stern transom
    a.poly('HULL', [(x, y, -Lh / 2) for x, y, _ in secs[0]] + [(-x, y, -Lh / 2) for x, y, _ in reversed(secs[0])], [tuple(range(2 * (NS + 1)))])
    # superstructure: stepped blocks between the turrets
    blocks = [(-22, 22, 12, 22, 26), (-16, 16, 22, 32, 18), (-10, 10, 32, 41, 12), (-24, 6, 12, 19, 24), (-60, -36, 12, 19, 20), (-52, -40, 19, 26, 12)]
    for z0, z1, y0, y1, w in blocks: a.bx('HULL', -w / 2, w / 2, y0 - 1, y1, z0, z1)
    # lit ports and bridge windows
    for z0, z1, y0, y1, w in blocks:
        for y in [y0 + 1.6 + 3.2 * j for j in range(int((y1 - y0) // 3.2))]:
            for z in [z0 + 2 + 3.2 * j for j in range(int((z1 - z0 - 3) // 3.2))]:
                if R.random() < .55:
                    for sx in (-1, 1): a.box('WINLIT', sx * (w / 2 + .05), y, z, .1, .9, 1.4)
    a.bx('DARK', -6, 6, 41, 43.5, -6, 6)                                    # bridge roof
    for sx in (-1, 1): a.box('WINLIT', sx * 5.05, 39.4, 0, .1, 1.1, 9)
    # funnels
    for zf, h in ((-8, 52), (-34, 48)):
        a.cyl('HULL', 0, 20, zf, 5.2, h, 4.6, seg=16); a.cyl('DARK', 0, h, zf, 4.7, h + .8, seg=16)
    # mast tower and yards
    a.cyl('HULL', 0, 41, 8, 1.4, 68, .5, seg=8)
    for y, w in ((58, 16), (64, 10)): a.box('STEEL', 0, y, 8, w, .4, .4)
    a.cyl('REDLAMP', 0, 68, 8, .4, 68.8, seg=6)
    # three triple 16-inch turrets: two forward (superfiring), one aft
    def turret(z, y, face):
        a.cyl('HULL', 0, y - 1, z, 8.2, y + 2.2, 7.6, seg=24)
        a.frustum('HULL', 0, z + face * 1.5, 13, 12, y + 2.2, 11, 9, y + 5.6)
        for gx in (-3, 0, 3):
            a.cyl('HULLDARK', gx, y + 3.6, z + face * 6, .55, y + 3.6, .55, seg=6, cap=False)
            p0 = Vector((gx, y + 3.6, z + face * 6)); p1 = p0 + Vector((0, .9, face * 19))
            a.tube('HULL', [tuple(p0), tuple(p1)], .52, 8)
    turret(70, deck_y(70), 1); turret(48, deck_y(48) + 6, 1); turret(-82, deck_y(-82), -1)
    a.bx('HULL', -6, 6, deck_y(48), deck_y(48) + 6, 42, 54)                # barbette under the superfiring turret
    # 5-inch twin mounts along the sides
    for z in (-50, -30, -10, 10, 30):
        for sx in (-1, 1):
            a.box('HULL', sx * 13, 14.4, z, 4.4, 2.6, 5.6)
            for gx in (-.8, .8): a.tube('HULLDARK', [(sx * 13 + gx, 15, z + 2), (sx * 13 + gx, 15.2, z + 8)], .18, 6)
    # deck lighting (frame 11: lights along the rails and up the superstructure)
    for i in range(0, NZ + 1, 3):
        z = secs[i][0][2]; hb = secs[i][-1][0]; y = secs[i][-1][1]
        for sx in (-1, 1): a.box('LAMP', sx * (hb - .4), y + 1.1, z, .22, .22, .22)
    for sx in (-1, 1):
        a.tube('STEEL', [(sx * (secs[i][-1][0] - .3), secs[i][-1][1] + 1.0, secs[i][0][2]) for i in range(2, NZ - 1)], .05, 4)
    return done(a, bev=('HULL',), off=.12)

# ================================================================== Carousel
def carousel():
    a = Acc('Carousel'); Rr = 8.
    a.cyl('TRIM', 0, 0, 0, Rr + .4, .6, seg=40); a.cyl('CANOPY', 0, .6, 0, Rr, .9, seg=40)
    a.cyl('BRASS', 0, .9, 0, .5, 7.6, seg=16)
    a.cyl('CANOPY2', 0, 6.4, 0, 2.1, 7.4, seg=24)
    a.lathe('CANOPY', 0, 0, [(Rr + .9, 7.0), (Rr + .9, 7.6), (Rr * .55, 9.2), (1.2, 10.6), (.2, 11.4)], 48)
    a.lathe('CANOPY2', 0, 0, [(Rr + .95, 7.05), (Rr + .95, 7.45)], 48)
    for k in range(48):                                        # scalloped valance + a bulb on every point
        th = TAU * k / 48; x, z = (Rr + .9) * math.cos(th), (Rr + .9) * math.sin(th)
        a.box('CANOPY2' if k % 2 else 'CANOPY', x, 6.7, z, .25, .6, 1.25, -th)
        a.cyl('BULB', x * 1.01, 6.35, z * 1.01, .14, 6.62, seg=6)
    for k in range(32):
        th = TAU * k / 32; a.cyl('BULB', (Rr * .55 + 2) * math.cos(th), 8.5, (Rr * .55 + 2) * math.sin(th), .12, 8.75, seg=6)
    for ring_r, nh in ((Rr - 1.4, 16), (Rr - 3.6, 12)):
        for k in range(nh):
            th = TAU * k / nh + (.2 if nh == 12 else 0); x, z = ring_r * math.cos(th), ring_r * math.sin(th)
            a.cyl('BRASS', x, .9, z, .07, 7.0, seg=6)
            hy = 1.9 + .45 * math.sin(k * 1.7); ry = -th
            fwd = Vector((-math.sin(th), 0, math.cos(th))); P0 = Vector((x, hy, z))
            beam(a, 'HORSE', P0 - fwd * .85, P0 + fwd * .7, .5, .46, .62, .55)                           # barrel
            beam(a, 'HORSE', P0 + fwd * .55 + Vector((0, .2, 0)), P0 + fwd * .95 + Vector((0, 1.0, 0)), .34, .26, .42, .3)   # neck
            beam(a, 'HORSE', P0 + fwd * .85 + Vector((0, 1.05, 0)), P0 + fwd * 1.45 + Vector((0, .82, 0)), .28, .2, .34, .22)  # head
            beam(a, 'CANOPY2', P0 + fwd * .7 + Vector((0, .7, 0)), P0 + fwd * .45 + Vector((0, 1.15, 0)), .08, .06, .3, .2)   # mane
            beam(a, 'CANOPY2', P0 - fwd * .82 + Vector((0, .15, 0)), P0 - fwd * 1.25 + Vector((0, -.45, 0)), .12, .06, .16, .1)  # tail
            for lz, ph in ((.55, .5), (-.6, -.5)):
                for lx in (-.17, .17):
                    hip = P0 + fwd * lz + Vector((lx * math.cos(th), -.2, lx * math.sin(th)))
                    beam(a, 'HORSE', hip, hip + fwd * (.35 * ph) + Vector((0, -.75, 0)), .12, .09, .14, .1)
            a.box('CANOPY', x, hy + .45, z, .6, .14, .6, ry)                 # saddle
    return done(a, bev=('TRIM',), off=.03)

# ================================================================== Fountain
def fountain():
    a = Acc('Fountain'); Rb = 11.
    a.lathe('STONE', 0, 0, [(Rb + .8, 0), (Rb + .8, .7), (Rb + .3, .9), (Rb + .3, .95), (Rb - .3, .95), (Rb - .3, .3)], 64, smooth=True)
    a.cyl('WATER', 0, .1, 0, Rb - .3, .55, seg=64, cap=True)
    a.lathe('STONE', 0, 0, [(1.2, .5), (.8, 2.2), (3.4, 2.6), (3.6, 3.0), (3.2, 3.0), (.6, 3.4), (.5, 4.8), (1.8, 5.2), (1.9, 5.5), (.3, 5.8), (.2, 6.6)], 40)
    a.cyl('WATER', 0, 2.75, 0, 3.15, 2.95, seg=40); a.cyl('WATER', 0, 5.25, 0, 1.75, 5.45, seg=24)
    a.lathe('JET', 0, 0, [(.02, 6.6), (.14, 7.2), (.06, 9.4), (.01, 9.8)], 10)
    for k in range(16):                                     # arcing jets from the rim toward the centre
        th = TAU * k / 16; pts_ = []
        for j in range(9):
            t = j / 8; r = (Rb - .6) * (1 - t * .55); y = .9 + 4.2 * t * (1 - t) * 2
            pts_.append((r * math.cos(th), y, r * math.sin(th)))
        a.tube('JET', pts_, .07, 4)
    for k in range(24):
        th = TAU * k / 24; a.box('LAMP', (Rb - .1) * math.cos(th), .8, (Rb - .1) * math.sin(th), .3, .12, .3)
    return done(a, bev=())

# ================================================================== StoneArch
def stone_arch():
    a = Acc('StoneArch'); span, rise, w = 20., 6.5, 6.4
    Rr = (span ** 2 / 4 + rise ** 2) / (2 * rise); half = math.asin(span / 2 / Rr); y0 = -rise - 1.1   # springing line below the deck
    cy = y0 + rise - Rr; n = 20; th = 1.1; D = 0.                                                      # deck at y = 0
    arc = lambda t, r: (cy + r * math.cos(t), r * math.sin(t))                                         # (y, z)
    for i in range(n):
        t0 = -half + 2 * half * i / n; t1 = -half + 2 * half * (i + 1) / n
        (yi0, zi0), (yi1, zi1) = arc(t0, Rr), arc(t1, Rr); (yo0, zo0), (yo1, zo1) = arc(t0, Rr + th), arc(t1, Rr + th)
        m = 'STONE2' if i % 2 else 'STONE'
        for sx in (-1, 1):
            q = [(sx * w / 2, yi0, zi0), (sx * w / 2, yi1, zi1), (sx * w / 2, yo1, zo1), (sx * w / 2, yo0, zo0)]
            a.poly(m, q, [(0, 1, 2, 3) if sx > 0 else (3, 2, 1, 0)])
            # spandrel: from the extrados straight up to the deck
            a.poly('STONE', [(sx * w / 2, yo0, zo0), (sx * w / 2, yo1, zo1), (sx * w / 2, D, zo1), (sx * w / 2, D, zo0)], [(0, 1, 2, 3) if sx > 0 else (3, 2, 1, 0)])
        a.poly('STONE2', [(-w / 2, yi0, zi0), (w / 2, yi0, zi0), (w / 2, yi1, zi1), (-w / 2, yi1, zi1)], [(0, 1, 2, 3)])   # soffit
    for sz in (-1, 1):                    # abutments down into the creek bed and wing walls
        a.box('STONE', 0, (y0 - 6 + D) / 2, sz * (span / 2 + 3), w + .6, D - y0 + 6, 6)
        for sx in (-1, 1): a.box('STONE', sx * (w / 2 + 1.5), -2.5, sz * (span / 2 + 7), 1, 5, 8, sx * sz * .35)
    for sx in (-1, 1):                    # parapets with coping, lamps on the four end posts
        a.box('STONE', sx * (w / 2 - .25), .55, 0, .5, 1.1, span + 12)
        a.box('TRIM', sx * (w / 2 - .25), 1.16, 0, .7, .14, span + 12.2)
        for sz in (-1, 1):
            a.box('STONE', sx * (w / 2 - .25), .8, sz * (span / 2 + 5.6), .9, 1.6, .9)
            a.cyl('DARK', sx * (w / 2 - .25), 1.6, sz * (span / 2 + 5.6), .07, 3.3, seg=6); a.box('LAMP', sx * (w / 2 - .25), 3.45, sz * (span / 2 + 5.6), .34, .5, .34)
    return done(a, bev=('STONE', 'TRIM'), off=.06)

# ================================================================== Inn
def inn():
    a = Acc('Inn'); w, d, h = 24., 12., 9.5
    a.bx('STONE', -d / 2, d / 2, 0, h, -w / 2, w / 2)
    a.gable_z('SLATE', -w / 2, w / 2, -d / 2, d / 2, h, 5.2, over=.6)
    for sz in (-1, 1): a.box('STONE', 0, h + 4.5, sz * (w / 2 - 2), 1.6, 5, 1.6)
    for y in (1.8, 5.6):
        for z in (-9, -5, -1, 3, 7):
            a.box('WINLIT' if R.random() < .8 else 'DARK', d / 2 + .05, y + .6, z, .1, 1.7, 1.1)
            a.box('TRIM', d / 2 + .08, y - .4, z, .18, .14, 1.4)
    for z in (-6, 0, 6):                                               # dormers
        a.box('STONE', d / 2 - 1.5, h + 1.5, z, 2.5, 2.4, 2.2); a.gable_x('SLATE', d / 2 - 2.8, d / 2 + .2, z - 1.4, z + 1.4, h + 2.7, 1.2, .2)
        a.box('WINLIT', d / 2 - .2, h + 1.4, z, .1, 1.2, 1.1)
    # porch along the facade, lanterns
    a.bx('TEAK', d / 2, d / 2 + 3.6, .5, .7, -w / 2 + 1, w / 2 - 1)
    a.prism_z('SLATE', -w / 2 + .6, w / 2 - .6, [(d / 2, 3.9), (d / 2 + 4, 3.3), (d / 2 + 4, 3.5), (d / 2, 4.2)])
    for z in range(-10, 11, 4): a.cyl('TRIM', d / 2 + 3.6, .7, z, .12, 3.3, seg=6)
    for z in (-8, 0, 8): a.box('LAMP', d / 2 + 3.2, 3.0, z, .3, .45, .3)
    return done(a, bev=('STONE',), off=.06)

# ================================================================== ForkGantry + Cushion
def fork_gantry():
    a = Acc('ForkGantry'); span, Hg = 30., 8.4
    for sx in (-1, 1):
        a.box('DARK', sx * span / 2, Hg / 2, 0, .6, Hg, .6); a.cyl('CONCRETE', sx * span / 2, 0, 0, .9, .6, seg=10)
    for y in (Hg, Hg + 1.8):
        for zz in (-.7, .7): a.box('DARK', 0, y, zz, span, .18, .18)
    for i in range(16):                                                    # Warren web
        x0 = -span / 2 + span * i / 16; x1 = -span / 2 + span * (i + 1) / 16
        for zz in (-.7, .7):
            y0, y1 = (Hg, Hg + 1.8) if i % 2 == 0 else (Hg + 1.8, Hg)
            a.tube('DARK', [(x0, y0, zz), (x1, y1, zz)], .07, 4)
    a.box('SIGNBACK', 7, Hg - .2, .9, 10.6, 3.6, .25)                     # sign box (face added in game)
    a.box('LED', 7, Hg - 2.1, 1.05, 10, .1, .1)
    return done(a, bev=('DARK',), off=.03)
def cushion():
    a = Acc('Cushion')
    for i in range(7):
        z = -i * .9; w = 1.0 + i * .12
        a.box('YELLOW' if i % 2 == 0 else 'DARK', 0, .55, z, w, 1.1, .82)
    a.box('YELLOW', 0, .55, .45, 1.0, 1.1, .1)
    for k, (dx, m) in enumerate(((-.3, 'DARK'), (.0, 'YELLOW'), (.3, 'DARK'))):
        a.box(m, dx, .55, .52, .2, .9, .04)
    a.box('LAMP', 0, 1.25, .2, .25, .25, .25)
    return done(a, bev=())

# ================================================================== CasinoTower
def casino():
    a = Acc('CasinoTower'); w, d, h = 36., 28., 118.
    a.bx('GLASS', -w / 2, w / 2, 0, h, -d / 2, d / 2)
    a.bx('DARK', -w / 2 - 1, w / 2 + 1, 0, 9, -d / 2 - 1, d / 2 + 1)
    for y in range(12, int(h), 4):
        for z in range(int(-d / 2) + 2, int(d / 2) - 1, 3):
            for sx in (-1, 1):
                if R.random() < .3: a.box('WINLIT', sx * (w / 2 + .03), y, z, .05, 2.2, 2.2)
    for k in range(9):                                              # pink neon fins up the long face
        x = -w / 2 + 2 + k * (w - 4) / 8
        for sz in (-1, 1): a.box('NEONA', x, h / 2 + 4, sz * (d / 2 + .5), .3, h - 12, .3)
    a.frustum('STEEL', 0, 0, w, d, h, w * .6, d * .6, h + 14)
    for y in (h + 3, h + 8, h + 12): a.tube('NEONA', [(x, y, z) for x, z in [(-w * .43 + (h + 14 - y) * 0, -d * .43), (w * .43, -d * .43), (w * .43, d * .43), (-w * .43, d * .43), (-w * .43, -d * .43)]], .25, 5)
    a.cyl('REDLAMP', 0, h + 14, 0, .6, h + 15, seg=8)
    a.box('NEONA', 0, 13, d / 2 + 1.2, 22, 3.2, .3)                 # marquee
    return done(a, bev=('DARK',))

# ================================================================== FlagPole
def flag_pole():
    a = Acc('FlagPole'); hp = 12.
    a.cyl('STEEL', 0, 0, 0, .09, hp, .06, seg=8); a.cyl('BRASS', 0, hp, 0, .16, hp + .3, seg=8)
    V = []; F = []; nw, nh = 8, 3
    for j in range(nh + 1):
        for i in range(nw + 1):
            u = i / nw; y = hp - .3 - 1.8 * j / nh; V.append((.1, y, -u * 2.8 + 0) if False else (math.sin(u * 4.2) * .25 * u, y, -.08 - u * 2.8))
    for j in range(nh):
        for i in range(nw): F.append((j * (nw + 1) + i, j * (nw + 1) + i + 1, (j + 1) * (nw + 1) + i + 1, (j + 1) * (nw + 1) + i))
    a.poly('PAINT', V, F, smooth=True); a.poly('PAINT', V, [f[::-1] for f in F], smooth=True)
    return done(a, bev=())

ONLY = ARGV[ARGV.index('--only') + 1].split(',') if '--only' in ARGV else None
builders = [halo_tower, ring_pylon, lc_portal, battleship, carousel, fountain, stone_arch, inn, fork_gantry, cushion, casino, flag_pole]
for b in builders:
    if ONLY and b.__name__ not in ONLY: continue
    b()
tris = {n: sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in e.children) for n, e in roots.items()}
print('assets', tris, 'total', sum(tris.values()))

if OUT:
    bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=False, export_apply=True, export_yup=True, export_texcoords=True,
                              export_normals=True, export_materials='EXPORT', export_lights=False, export_cameras=False)
    print('wrote', OUT, os.path.getsize(OUT))

if RENDER:
    # Cycles look-dev: each asset on its own at night, a cool moon, a warm ground bounce, emissives doing the rest
    sc = scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 48; sc.cycles.use_denoising = True
    sc.render.resolution_x, sc.render.resolution_y = 1280, 720
    w = bpy.data.worlds.new('night'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (.008, .01, .02, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 1; sc.world = w
    sun = bpy.data.objects.new('moon', bpy.data.lights.new('moon', 'SUN')); sun.data.energy = .35; sun.data.color = (.7, .8, 1); sun.rotation_euler = (math.radians(55), 0, math.radians(30)); sc.collection.objects.link(sun)
    gnd = bpy.data.meshes.new('gnd'); gnd.from_pydata([(-2000, -2000, -.01), (2000, -2000, -.01), (2000, 2000, -.01), (-2000, 2000, -.01)], [], [(0, 1, 2, 3)])
    go = bpy.data.objects.new('gnd', gnd); gm = bpy.data.materials.new('gnd'); gm.use_nodes = True; gm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.02, .02, .025, 1)
    gm.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .25; gnd.materials.append(gm); sc.collection.objects.link(go)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
    shots = {'HaloTower': ((150, -170, 40), 32), 'RingPylon': ((180, 20, 30), 28), 'LCPortal': ((26, 30, 6), 32), 'Battleship': ((170, 210, 45), 30),
             'Carousel': ((18, -16, 5), 30), 'Fountain': ((22, -20, 7), 32), 'StoneArch': ((22, -16, 2), 32), 'Inn': ((30, 22, 6), 34),
             'ForkGantry': ((10, -26, 5), 32), 'CasinoTower': ((150, -120, 40), 30), 'Cushion': ((4, -4, 2), 30), 'FlagPole': ((6, -8, 6), 30)}
    for n, root in roots.items():
        for o in roots.values(): o.hide_render = True; [setattr(c, 'hide_render', True) for c in o.children]
        root.hide_render = False; [setattr(c, 'hide_render', False) for c in root.children]
        (cx, cy, cz), lens = shots.get(n, ((40, -40, 10), 30))
        bb = [root.matrix_world @ (c.matrix_local @ Vector(v)) for c in root.children for v in c.bound_box]
        ctr = sum(bb, Vector()) / len(bb)
        cam.location = ctr + Vector((cx, cy, cz)); d = ctr - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens
        sc.render.filepath = f'{RENDER}_{n}.png'; bpy.ops.render.render(write_still=True); print('render', n)
