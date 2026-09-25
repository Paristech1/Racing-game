"""AFTERHOURS — Philly Classic landmark kit, built in Blender (bpy): City Hall, the Art Museum, four Boathouse Row
variants and a Ben Franklin Bridge tower. Modelled from night photos of each landmark.
Coordinates are game space (x right, y up, z forward), mapped to Blender with G(x, y, z) = (x, -z, y).
Every asset is an Empty named after it; under it sits one mesh per material (`<Asset>_<MAT>`), so the game instances
each landmark with a handful of draw calls. Material names are the contract with js/afterhours.js (PHILLY_KIT_MATS).
Live (MCP): exec this file; `objs` lists the meshes for dump_mesh.dump(). Preview with preview_rig.py (SCENE='Philly Kit').
"""
import bpy, bmesh, math
from mathutils import Vector

def G(x, y, z): return Vector((x, -z, y))
def lerp(a, b, t): return a + (b - a) * t
TAU = math.pi * 2

old = bpy.data.scenes.get('Philly Kit')
if old:
    for o in list(old.objects): bpy.data.objects.remove(o)
    for c in list(old.collection.children): bpy.data.collections.remove(c)
    bpy.data.scenes.remove(old)
for blk in (bpy.data.meshes, bpy.data.materials):
    for d in list(blk):
        if d.users == 0: blk.remove(d)
scene = bpy.data.scenes.new('Philly Kit')
for w in bpy.context.window_manager.windows: w.scene = scene
KIT = bpy.data.collections.new('Kit'); scene.collection.children.link(KIT)

def mat(name, col, metal=0., rough=.6, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
M = {'STONE': mat('STONE', (.78, .72, .6), 0, .75, (.35, .26, .15), .6), 'STONEHI': mat('STONEHI', (.86, .8, .68), 0, .7, (.45, .34, .2), .7),
     'GRANITE': mat('GRANITE', (.32, .3, .28), 0, .85), 'SLATE': mat('SLATE', (.1, .11, .13), .3, .5),
     'WIN': mat('WIN', (1, .8, .5), 0, .4, (1, .72, .4), 3.), 'GAP': mat('GAP', (.01, .01, .01), 0, .95),
     'BRONZE': mat('BRONZE', (.3, .2, .1), .8, .4), 'GOLD': mat('GOLD', (.85, .65, .3), 1, .3),
     'SAND': mat('SAND', (.85, .68, .42), 0, .7, (.5, .32, .12), .9), 'ROOFBLUE': mat('ROOFBLUE', (.12, .3, .42), .2, .45),
     'LED': mat('LED', (1, 1, 1), 0, .3, (1, 1, 1), 8.), 'WOOD': mat('WOOD', (.13, .12, .12), 0, .8),
     'TRIM': mat('TRIM', (.75, .75, .72), 0, .6), 'STEEL': mat('STEEL', (.18, .36, .62), .6, .45)}

class Acc:
    """Collects geometry per material for one asset (game coords); build() turns it into Blender meshes under an Empty."""
    def __init__(self, name): self.name = name; self.g = {}
    def _buf(self, m): return self.g.setdefault(m, {'v': [], 'f': [], 's': []})
    def poly(self, m, verts, faces, smooth=False):
        b = self._buf(m); o = len(b['v']); b['v'] += [tuple(v) for v in verts]
        for f in faces: b['f'].append(tuple(o + i for i in f)); b['s'].append(smooth)
    def box(self, m, cx, cy, cz, sx, sy, sz, ry=0.):
        c, s = math.cos(ry), math.sin(ry); V = []
        for dx, dy, dz in ((-1, -1, -1), (1, -1, -1), (1, 1, -1), (-1, 1, -1), (-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1)):
            x, z = dx * sx / 2, dz * sz / 2; V.append((cx + x * c + z * s, cy + dy * sy / 2, cz - x * s + z * c))
        self.poly(m, V, [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6), (1, 2, 6, 5), (0, 4, 7, 3)])
    def bx(self, m, x0, x1, y0, y1, z0, z1): self.box(m, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, x1 - x0, y1 - y0, z1 - z0)
    def cyl(self, m, cx, y0, cz, r0, y1, r1=None, seg=16, cap=True, sides=None, rot=0.):
        r1 = r0 if r1 is None else r1; n = sides or seg; V = []
        for y, r in ((y0, r0), (y1, r1)):
            for k in range(n): a = TAU * k / n + rot; V.append((cx + r * math.cos(a), y, cz + r * math.sin(a)))
        F = [(k, (k + 1) % n, n + (k + 1) % n, n + k) for k in range(n)]
        self.poly(m, V, F, smooth=sides is None)
        if cap: self.poly(m, V, [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))])
    def lathe(self, m, cx, cz, prof, n=16, smooth=True, rot=0.):  # prof: [(r, y)] bottom -> top
        V = []
        for r, y in prof:
            for k in range(n): a = TAU * k / n + rot; V.append((cx + r * math.cos(a), y, cz + r * math.sin(a)))
        F = []
        for i in range(len(prof) - 1):
            for k in range(n): a = i * n + k; b = i * n + (k + 1) % n; F.append((a, b, b + n, a + n))
        self.poly(m, V, F, smooth)
    def prism_x(self, m, x0, x1, pts_zy):  # extrude a (z, y) polygon along x
        n = len(pts_zy); V = [(x0, y, z) for z, y in pts_zy] + [(x1, y, z) for z, y in pts_zy]
        self.poly(m, V, [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)])
    def prism_z(self, m, z0, z1, pts_xy):
        n = len(pts_xy); V = [(x, y, z0) for x, y in pts_xy] + [(x, y, z1) for x, y in pts_xy]
        self.poly(m, V, [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, n + i, n + (i + 1) % n, (i + 1) % n) for i in range(n)])
    def gable_x(self, m, x0, x1, z0, z1, y0, h, over=0.):  # roof with its ridge along x
        zc = (z0 + z1) / 2; self.prism_x(m, x0 - over, x1 + over, [(z0 - over, y0 - over * .6), (z1 + over, y0 - over * .6), (zc, y0 + h)])
    def gable_z(self, m, z0, z1, x0, x1, y0, h, over=0.):
        xc = (x0 + x1) / 2; self.prism_z(m, z0 - over, z1 + over, [(x0 - over, y0 - over * .6), (x1 + over, y0 - over * .6), (xc, y0 + h)])
    def frustum(self, m, cx, cz, w0, d0, y0, w1, d1, y1):  # square-ish frustum (mansard / hip)
        V = [(cx - w0 / 2, y0, cz - d0 / 2), (cx + w0 / 2, y0, cz - d0 / 2), (cx + w0 / 2, y0, cz + d0 / 2), (cx - w0 / 2, y0, cz + d0 / 2),
             (cx - w1 / 2, y1, cz - d1 / 2), (cx + w1 / 2, y1, cz - d1 / 2), (cx + w1 / 2, y1, cz + d1 / 2), (cx - w1 / 2, y1, cz + d1 / 2)]
        self.poly(m, V, [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7), (4, 5, 6, 7), (3, 2, 1, 0)])
    def tube(self, m, pts, r, n=6):  # polyline tube (LED lines, cables, rails)
        for a, b in zip(pts[:-1], pts[1:]):
            A, B = Vector(a), Vector(b); d = B - A
            if d.length < 1e-6: continue
            t = d.normalized(); u = t.cross(Vector((0, 1, 0))) if abs(t.y) < .9 else t.cross(Vector((1, 0, 0))); u.normalize(); w = t.cross(u)
            V = [tuple(P + (u * math.cos(TAU * k / n) + w * math.sin(TAU * k / n)) * r) for P in (A, B) for k in range(n)]
            self.poly(m, V, [(k, (k + 1) % n, n + (k + 1) % n, n + k) for k in range(n)], smooth=True)
    def build(self, at=(0, 0, 0)):
        root = bpy.data.objects.new(self.name, None); KIT.objects.link(root); root.location = G(*at); out = []
        for m, b in self.g.items():
            me = bpy.data.meshes.new(f'{self.name}_{m}'); me.from_pydata([tuple(G(*v)) for v in b['v']], [], b['f']); me.update()
            for p, s in zip(me.polygons, b['s']): p.use_smooth = s
            bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
            me.materials.append(M[m]); ob = bpy.data.objects.new(f'{self.name}_{m}', me); KIT.objects.link(ob); ob.parent = root; out.append(ob)
        return out

objs = []
# ====================================================================================== CITY HALL
# Footprint 84 x 84 (the game's lot at Broad & Market). Granite base, four storeys of pilastered stone under a slate mansard,
# corner pavilions with domed mansards, a pavilion with an arched portal on every face, and the tower rising from the centre:
# pilastered shaft, clock stage with corner columns, colonnaded drum, ogee dome, lantern and the statue on top.
A = Acc('CityHall'); HW = 42
A.bx('GRANITE', -HW - .4, HW + .4, 0, 6, -HW - .4, HW + .4)
for y in (1.5, 3, 4.5): A.bx('GAP', -HW - .45, HW + .45, y - .06, y + .06, -HW - .45, HW + .45)   # rustication joints
A.bx('STONE', -HW + 1, HW - 1, 6, 30, -HW + 1, HW - 1)
def facade(face_len, place):  # place(u, y, depth_out, width, height, mat) on one face
    bays = int(face_len // 5)
    for i in range(bays + 1):
        u = -face_len / 2 + i * face_len / bays; place(u, 18, .5, .9, 24, 'STONEHI')               # pilasters
    for i in range(bays):
        u = -face_len / 2 + (i + .5) * face_len / bays
        for y in (9.5, 15.5, 21.5, 26.5):
            place(u, y, .06, 2.2, 3.4 if y < 26 else 2.6, 'WIN'); place(u, y + 2.05, .35, 3.0, .35, 'STONEHI')   # window + hood
    place(0, 29.4, .9, face_len + 2, 1.2, 'STONEHI'); place(0, 28.4, .4, face_len + 1, .8, 'STONE')          # cornice + frieze
def on_face(acc, face, half):
    def place(u, y, d, w, h, m):
        if face == 'N': acc.box(m, u, y, -half - d / 2 + .02, w, h, d)
        elif face == 'S': acc.box(m, u, y, half + d / 2 - .02, w, h, d)
        elif face == 'E': acc.box(m, half + d / 2 - .02, y, u, d, h, w)
        else: acc.box(m, -half - d / 2 + .02, y, u, d, h, w)
    return place
for fc in 'NSEW': facade(2 * HW - 38, on_face(A, fc, HW - 1))
A.frustum('SLATE', 0, 0, 2 * HW - 2, 2 * HW - 2, 30, 2 * HW - 14, 2 * HW - 14, 38.5)                     # mansard
for fc in 'NSEW':                                                                                         # dormers
    for i in range(6):
        u = -22 + i * 8.8
        if abs(u) < 12: continue
        x, z, ry = {'N': (u, -HW + 4, 0), 'S': (u, HW - 4, 0), 'E': (HW - 4, u, math.pi / 2), 'W': (-HW + 4, u, math.pi / 2)}[fc]
        A.box('STONEHI', x, 33.2, z, 2.6, 4.2, 2.6, ry); A.box('WIN', x + (.0 if fc in 'NS' else (1.32 if fc == 'E' else -1.32)), 33, z + ((-1.32 if fc == 'N' else 1.32) if fc in 'NS' else 0), 1.3 if fc in 'NS' else .05, 2.4, .05 if fc in 'NS' else 1.3)
        A.box('SLATE', x, 36, z, 3.2, 1.6, 3.2, ry + math.pi / 4)
def pavilion(acc, cx, cz, w, top, dome_h):
    acc.bx('STONE', cx - w / 2, cx + w / 2, 6, top, cz - w / 2, cz + w / 2)
    for fc in 'NSEW':
        def pl(u, y, d, ww, h, m, fc=fc):
            if fc == 'N': acc.box(m, cx + u, y, cz - w / 2 - d / 2 + .02, ww, h, d)
            elif fc == 'S': acc.box(m, cx + u, y, cz + w / 2 + d / 2 - .02, ww, h, d)
            elif fc == 'E': acc.box(m, cx + w / 2 + d / 2 - .02, y, cz + u, d, h, ww)
            else: acc.box(m, cx - w / 2 - d / 2 + .02, y, cz + u, d, h, ww)
        for u in (-w / 2 + .6, -w / 6, w / 6, w / 2 - .6): pl(u, (6 + top) / 2, .7, 1.2, top - 6, 'STONEHI')      # paired columns
        for u in (-w / 3, 0, w / 3):
            for y in range(10, int(top) - 4, 6): pl(u, y, .06, 2.0, 3.6, 'WIN')
        pl(0, top - .6, 1.1, w + 2.2, 1.2, 'STONEHI')
    # domed mansard: square section, ogee profile, capped by a small lantern
    prof = [(w / 2 - .4, top), (w / 2 - 1.2, top + dome_h * .35), (w / 2 - 2.6, top + dome_h * .7), (w / 2 - 5, top + dome_h * .92), (1.2, top + dome_h)]
    acc.lathe('SLATE', cx, cz, [(r * math.sqrt(2), y) for r, y in prof], n=4, smooth=False, rot=math.pi / 4)
    acc.cyl('STONEHI', cx, top + dome_h, cz, 1.0, top + dome_h + 2.4, .7, seg=8); acc.cyl('GOLD', cx, top + dome_h + 2.4, cz, .25, top + dome_h + 4.2, .05, seg=6)
for sx in (-1, 1):
    for sz in (-1, 1): pavilion(A, sx * (HW - 9), sz * (HW - 9), 18, 42, 10)
for fc in 'NSEW':   # centre pavilions with the portals
    cx, cz = {'N': (0, -HW + 3), 'S': (0, HW - 3), 'E': (HW - 3, 0), 'W': (-HW + 3, 0)}[fc]
    pavilion(A, cx, cz, 24, 44, 11)
    # arched portal: dark arch with a lit passage inside, set into the pavilion face
    arch = [(-4.2, 0), (4.2, 0), (4.2, 8)] + [(4.2 * math.cos(a), 8 + 4.2 * math.sin(a)) for a in [math.pi * k / 10 for k in range(1, 10)]] + [(-4.2, 8)]
    if fc in 'NS':
        z = cz + (-12.02 if fc == 'N' else 12.02); A.prism_z('GAP', z - .3, z + .3, [(x, y + 6) for x, y in arch]); A.prism_z('WIN', z - (.25 if fc == 'S' else -.25) - .02, z - (.25 if fc == 'S' else -.25) + .02, [(x * .7, y * .9 + 6.2) for x, y in arch])
    else:
        x = cx + (12.02 if fc == 'E' else -12.02); A.prism_x('GAP', x - .3, x + .3, [(z, y + 6) for z, y in arch])
# ---- the tower
A.bx('STONE', -13, 13, 30, 72, -13, 13)
for fc in 'NSEW':
    pl = on_face(A, fc, 13)
    for u in (-12.3, -6.5, 6.5, 12.3): pl(u, 51, .8, 1.4, 42, 'STONEHI')                               # corner + inner pilasters
    for u in (-3.2, 0, 3.2):
        for y in (42, 52, 62): pl(u, y, .06, 1.8, 5.5, 'WIN')                                            # tall arched windows
    for y in (47, 57, 67): pl(0, y, .5, 13, .5, 'STONEHI')
    pl(0, 71.4, 1.2, 28.4, 1.4, 'STONEHI')                                                               # shaft cornice
A.bx('STONE', -11.5, 11.5, 72, 97, -11.5, 11.5)                                                          # clock stage
for sx in (-1, 1):
    for sz in (-1, 1):
        A.cyl('STONEHI', sx * 11.2, 72, sz * 11.2, 1.5, 97, 1.3, seg=12)                                # corner columns
        A.lathe('STONEHI', sx * 11.2, sz * 11.2, [(1.9, 97), (1.9, 98.2), (1.2, 100.5), (.2, 103)], n=8)   # urns / finials
for fc in 'NSEW':
    pl = on_face(A, fc, 11.5)
    pl(0, 90, .5, 11, 11, 'STONEHI'); pl(0, 78.5, .06, 5, 6, 'WIN'); pl(0, 96.5, 1.2, 25, 1.2, 'STONEHI')  # clock surround, window
A.cyl('STONE', 0, 97, 0, 9.6, 108, 9.2, sides=8, rot=math.pi / 8)                                        # drum
for k in range(16):
    a = TAU * k / 16; A.cyl('STONEHI', 10.4 * math.cos(a), 97.5, 10.4 * math.sin(a), .55, 107, .5, seg=8)   # colonnade
    if k % 2 == 0: A.box('WIN', 9.65 * math.cos(a), 102.5, 9.65 * math.sin(a), .06, 5, 2.6, -a)
A.cyl('STONEHI', 0, 107, 0, 11.4, 108.5, 11.4, sides=16); A.cyl('STONEHI', 0, 97, 0, 11.4, 98, 11.4, sides=16)
A.lathe('SLATE', 0, 0, [(9.4, 108.5), (9.2, 111), (8.2, 114), (6.4, 117.5), (4.2, 120.5), (2.4, 123), (1.6, 125)], n=8, smooth=False, rot=math.pi / 8)  # ogee dome
for k in range(8):
    a = TAU * (k + .5) / 8; A.box('STONEHI', 8.3 * math.cos(a), 113, 8.3 * math.sin(a), 1.4, 3, .6, -a + math.pi / 2)   # dome lucarnes
A.cyl('STONEHI', 0, 125, 0, 1.9, 131, 1.5, sides=8); A.cyl('GOLD', 0, 131, 0, 2.2, 132, 2.2, sides=8)                    # lantern
A.cyl('STONEHI', 0, 132, 0, 1.3, 134.5, 1.1, seg=12)                                                     # pedestal
# the statue: a standing figure in a long coat and a wide hat, one arm out over the city
A.lathe('BRONZE', 0, 0, [(.95, 134.5), (1.05, 135.6), (.9, 138.8), (.62, 141.4), (.7, 142.4), (.42, 143.2), (.32, 143.4)], n=12)
A.lathe('BRONZE', 0, 0, [(.36, 143.4), (.42, 144.2), (.4, 144.8), (.2, 145.1)], n=10)
A.cyl('BRONZE', 0, 144.7, 0, .78, 144.95, .78, seg=12)
A.tube('BRONZE', [(.4, 141.9, .2), (1.3, 141.6, .9), (1.9, 141.2, 1.5)], .17)
A.tube('BRONZE', [(-.4, 141.9, 0), (-.55, 140.2, .1)], .16)
objs += A.build()

# ====================================================================================== ART MUSEUM
# Local origin: centre of the terrace at the top of the steps, front facing +x (the game's steps climb west from Broad).
# A temple front of eight columns under a pediment and a blue-tiled gable, flanked by two wings that reach forward round
# the courtyard, each ending in its own pedimented portico.
B = Acc('ArtMuseum')
def temple(acc, x_front, zc, width, depth, h, ncol, roof_h):
    x_back = x_front - depth
    acc.bx('SAND', x_back, x_front - 5, 0, h, zc - width / 2, zc + width / 2)                                          # cella
    acc.bx('SAND', x_front - 6, x_front + .6, 0, .9, zc - width / 2 - .4, zc + width / 2 + .4)                        # stylobate
    for i in range(ncol):
        z = zc - width / 2 + 1.4 + i * (width - 2.8) / (ncol - 1)
        for xx in (x_front - .6, x_front - 4):
            acc.cyl('SAND', xx, .9, z, .82, h - 1.4, .7, seg=16); acc.cyl('STONEHI', xx, h - 1.4, z, 1.05, h - .9, 1.05, sides=4, rot=math.pi / 4)
    acc.bx('SAND', x_front - 6, x_front + .5, h - .9, h + .8, zc - width / 2 - .3, zc + width / 2 + .3)                # entablature
    acc.bx('STONEHI', x_front - 6, x_front + .8, h + .8, h + 1.3, zc - width / 2 - .5, zc + width / 2 + .5)           # cornice
    # pediment (tympanum) facing +x and the tiled gable running back along x
    acc.prism_x('SAND', x_front - .2, x_front + .6, [(zc - width / 2 - .3, h + 1.3), (zc + width / 2 + .3, h + 1.3), (zc, h + 1.3 + roof_h)])
    acc.gable_x('ROOFBLUE', x_back - .4, x_front + .7, zc - width / 2, zc + width / 2, h + 1.35, roof_h, over=.6)
    acc.tube('STONEHI', [(x_front + .8, h + 1.3, zc - width / 2 - .6), (x_front + .8, h + 1.3 + roof_h + .15, zc), (x_front + .8, h + 1.3, zc + width / 2 + .6)], .28, n=4)
    for i in range(1, ncol - 1):   # doors behind the colonnade
        z = zc - width / 2 + 1.4 + i * (width - 2.8) / (ncol - 1)
        if i % 2: acc.box('WIN', x_front - 5.02, 3.4, z, .06, 5.2, 2.2)
temple(B, 30, 0, 36, 60, 15, 8, 6.5)
B.bx('SAND', -30, 22, 0, 13.5, -38, 38)                                                                   # main block behind the portico
B.bx('STONEHI', -30.5, 22.5, 13.5, 14.4, -38.5, 38.5)
for sz in (-1, 1):
    zc = sz * 52
    B.bx('SAND', -30, 30, 0, 12.5, zc - 13, zc + 13); B.bx('STONEHI', -30.5, 30.5, 12.5, 13.3, zc - 13.5, zc + 13.5)   # wing
    B.gable_x('ROOFBLUE', -30.5, 30.5, zc - 13, zc + 13, 13.3, 4.2, over=.5)
    temple(B, 44, zc, 20, 16, 12.5, 6, 4.4)                                                               # the wing's own portico
    for i in range(6):   # pilasters and blind windows on the courtyard-facing side
        x = -24 + i * 9; z = zc - sz * 13.05
        B.box('STONEHI', x, 6.2, z, .9, 12.4, .5); B.box('WIN' if i % 2 else 'GAP', x + 4.5, 5, z - sz * .02, 2.2, 3.8, .06)
    B.bx('SAND', 22, 30, 0, 12.5, sz * 38 - (13 if sz < 0 else 0), sz * 38 + (13 if sz > 0 else 0))     # link to the centre block
objs += B.build()

# ====================================================================================== BOATHOUSE ROW (4 variants)
# Local origin: footprint centre at the waterline, road side facing +z. Board-and-batten Victorian boathouses with steep
# gables, cross gables, a turret, dormers and porches. Every roof edge, eave and corner carries an LED line (LED material,
# tinted per instance in the game).
def led_gable_z(acc, x0, x1, zf, y0, h):  # LED outline of a gable end facing +z
    acc.tube('LED', [(x0, y0, zf), ((x0 + x1) / 2, y0 + h, zf), (x1, y0, zf)], .08)
def boathouse(name, w, d, wall, roof_h, kind):
    H = Acc(name); x0, x1, z0, z1 = -w / 2, w / 2, -d / 2, d / 2
    H.bx('WOOD', x0, x1, 0, wall, z0, z1)
    for i in range(int(w // 1.2)):                                                                        # battens
        x = x0 + .6 + i * 1.2; H.box('TRIM', x, wall / 2, z1 + .05, .12, wall - .2, .1)
    H.bx('TRIM', x0 - .1, x1 + .1, wall / 2 - .15, wall / 2 + .15, z0 - .1, z1 + .1)                      # belt course
    for i in range(int(w // 5)):                                                                          # boat doors below, windows above
        x = x0 + 2.5 + i * 5
        if x > x1 - 2: break
        H.box('GAP' if i % 3 else 'WIN', x, wall * .24, z1 + .08, 3.4, wall * .42, .06)
        H.box('WIN', x, wall * .72, z1 + .08, 1.4, wall * .26, .06)
    if kind == 'A':     # long gable along x with two cross gables on the front
        H.gable_x('SLATE', x0, x1, z0, z1, wall, roof_h, over=.5)
        for xc in (x0 + w * .27, x1 - w * .27):
            H.gable_z('SLATE', 0, z1 + .6, xc - 5, xc + 5, wall, roof_h * 1.05, over=.4)
            H.prism_z('WOOD', z1 - .01, z1 + .6, [(xc - 5, wall), (xc + 5, wall), (xc, wall + roof_h * 1.05)])
            led_gable_z(H, xc - 5.4, xc + 5.4, z1 + 1.0, wall - .25, roof_h * 1.05 + .5); H.box('WIN', xc, wall + roof_h * .35, z1 + .62, 1.6, 1.8, .06)
        H.tube('LED', [(x0 - .5, wall + roof_h, 0), (x1 + .5, wall + roof_h, 0)], .08)
        for zz in (z0 - .5, z1 + .5): H.tube('LED', [(x0 - .5, wall - .3, zz), (x1 + .5, wall - .3, zz)], .08)
    elif kind == 'B':   # tall front gable (ridge along z) and a square turret with a pyramid cap
        H.gable_z('SLATE', z0, z1, x0, x1 - 7, wall, roof_h * 1.4, over=.5)
        H.prism_z('WOOD', z1 - .01, z1 + .3, [(x0, wall), (x1 - 7, wall), ((x0 + x1 - 7) / 2, wall + roof_h * 1.4)])
        led_gable_z(H, x0 - .5, x1 - 6.5, z1 + .8, wall - .3, roof_h * 1.4 + .4)
        H.box('WIN', (x0 + x1 - 7) / 2, wall + roof_h * .45, z1 + .35, 2.6, 2.2, .06)
        H.bx('WOOD', x1 - 7, x1, wall, wall + 5, z1 - 7, z1)
        H.frustum('SLATE', x1 - 3.5, z1 - 3.5, 7.8, 7.8, wall + 5, .3, .3, wall + 5 + roof_h * 1.3)
        for (xa, za) in ((x1 - 7.4, z1 + .4), (x1 + .4, z1 + .4), (x1 + .4, z1 - 7.4), (x1 - 7.4, z1 - 7.4)):
            H.tube('LED', [(xa, wall + 5, za), (x1 - 3.5, wall + 5 + roof_h * 1.3 + .3, z1 - 3.5)], .08)
        H.box('WIN', x1 - 3.5, wall + 2.5, z1 + .05, 2.2, 2.4, .06)
        H.gable_x('SLATE', x1 - 7, x1, z0, z1 - 7, wall, roof_h * .8, over=.4)
        for xx in (x0 - .5, x1 + .5): H.tube('LED', [(xx, 0.2, z1 + .5), (xx, wall - .3, z1 + .5)], .08)
        H.tube('LED', [(x0 - .5, wall - .3, z1 + .5), (x1 + .5, wall - .3, z1 + .5)], .08)
    elif kind == 'C':   # hipped roof with three gabled dormers and a porch roof along the front
        H.frustum('SLATE', 0, 0, w + 1, d + 1, wall, w - 10, 1.2, wall + roof_h * 1.1)
        for xc in (-w * .3, 0, w * .3):
            H.gable_z('SLATE', z1 - 3.4, z1 + .2, xc - 2.2, xc + 2.2, wall + .8, 2.6, over=.25)
            H.prism_z('WOOD', z1 - .1, z1 + .2, [(xc - 2.2, wall + .8), (xc + 2.2, wall + .8), (xc, wall + 3.4)]); H.box('WIN', xc, wall + 1.8, z1 + .22, 1.4, 1.2, .06)
            led_gable_z(H, xc - 2.5, xc + 2.5, z1 + .5, wall + .6, 3.0)
        H.frustum('SLATE', 0, z1 + 1.8, w + 1, 3.8, wall * .5, w + .2, 1.2, wall * .5 + 1.3)
        for x in (x0 + .5, x0 + w / 3, x1 - w / 3, x1 - .5): H.box('TRIM', x, wall * .25, z1 + 3.3, .3, wall * .5, .3)
        H.tube('LED', [(x0 - .5, wall - .2, z1 + .5), (x1 + .5, wall - .2, z1 + .5)], .08)
        H.tube('LED', [(-(w - 10) / 2, wall + roof_h * 1.1 + .1, 0), ((w - 10) / 2, wall + roof_h * 1.1 + .1, 0)], .08)
        for sx in (-1, 1): H.tube('LED', [(sx * (w / 2 + .5), wall, z1 + .5), (sx * (w - 10) / 2, wall + roof_h * 1.1 + .1, 0)], .08)
    else:               # 'D': twin front gables
        for xc in (x0 + w / 4, x1 - w / 4):
            H.gable_z('SLATE', z0, z1, xc - w / 4, xc + w / 4, wall, roof_h * 1.2, over=.45)
            H.prism_z('WOOD', z1 - .01, z1 + .3, [(xc - w / 4, wall), (xc + w / 4, wall), (xc, wall + roof_h * 1.2)])
            led_gable_z(H, xc - w / 4 - .4, xc + w / 4 + .4, z1 + .8, wall - .3, roof_h * 1.2 + .4)
            H.box('WIN', xc, wall + roof_h * .4, z1 + .35, 2.2, 2.4, .06)
        H.tube('LED', [(x0 - .5, wall - .3, z1 + .5), (x1 + .5, wall - .3, z1 + .5)], .08)
        for xx in (x0 - .5, 0, x1 + .5): H.tube('LED', [(xx, .2, z1 + .5), (xx, wall - .3, z1 + .5)], .08)
    H.bx('TRIM', x0 - 1, x1 + 1, -.6, 0, z0 - 3, z1 + 1)                                                  # dock / plinth
    return H.build()
for nm, w, d, wall, rh, kind in (('Boathouse_A', 34, 16, 6.5, 5.2, 'A'), ('Boathouse_B', 36, 16, 7, 5, 'B'),
                                  ('Boathouse_C', 40, 16, 6, 5, 'C'), ('Boathouse_D', 36, 16, 6.8, 5, 'D')):
    objs += boathouse(nm, w, d, wall, rh, kind)

# ====================================================================================== BEN FRANKLIN BRIDGE TOWER
# Local origin: tower centre on the pier top; legs under both cables (z = +-35). Each leg is a riveted lattice column
# (four corner posts, struts every 6 m, X-bracing on every face); four portal frames tie the legs together, the top
# two with lattice panels, and a saddle cap carries the cable over each leg.
T = Acc('BFBTower'); LZ = 35.
def lattice_leg(acc, zc, h0, h1, w0, d0, w1, d1):
    def at(y):
        t = (y - h0) / (h1 - h0); return lerp(w0, w1, t) / 2, lerp(d0, d1, t) / 2
    for sx in (-1, 1):
        for sz in (-1, 1):
            a, b = at(h0); c, e = at(h1); acc.tube('STEEL', [(sx * a, h0, zc + sz * b), (sx * c, h1, zc + sz * e)], .55, n=4)
    ys = [h0 + i * 6 for i in range(int((h1 - h0) // 6) + 1)]
    for y0, y1 in zip(ys[:-1], ys[1:]):
        a0, b0 = at(y0); a1, b1 = at(y1)
        for sz in (-1, 1): acc.tube('STEEL', [(-a1, y1, zc + sz * b1), (a1, y1, zc + sz * b1)], .22, n=4)          # struts
        for sx in (-1, 1): acc.tube('STEEL', [(sx * a1, y1, zc - b1), (sx * a1, y1, zc + b1)], .22, n=4)
        for sz in (-1, 1):                                                                                          # X on the x faces
            acc.tube('STEEL', [(-a0, y0, zc + sz * b0), (a1, y1, zc + sz * b1)], .14, n=4); acc.tube('STEEL', [(a0, y0, zc + sz * b0), (-a1, y1, zc + sz * b1)], .14, n=4)
        for sx in (-1, 1):                                                                                          # X on the z faces
            acc.tube('STEEL', [(sx * a0, y0, zc - b0), (sx * a1, y1, zc + b1)], .14, n=4); acc.tube('STEEL', [(sx * a0, y0, zc + b0), (sx * a1, y1, zc - b1)], .14, n=4)
for sz in (-1, 1): lattice_leg(T, sz * LZ, 0, 108, 5.6, 7.6, 4.2, 5.8)
for y, h, panel in ((24, 2.4, False), (60, 3.2, True), (85, 3.2, True), (104, 3.6, False)):
    for dy in (-h / 2, h / 2): T.tube('STEEL', [(0, y + dy, -LZ + 2.6), (0, y + dy, LZ - 2.6)], .45, n=4)
    for sx in (-1.6, 1.6):
        for dy in (-h / 2, h / 2): T.tube('STEEL', [(sx, y + dy, -LZ + 2.6), (sx, y + dy, LZ - 2.6)], .3, n=4)
    if panel:
        n = 8; zs = [-LZ + 2.6 + i * (2 * LZ - 5.2) / n for i in range(n + 1)]
        for za, zb in zip(zs[:-1], zs[1:]):
            T.tube('STEEL', [(0, y - h / 2, za), (0, y + h / 2, zb)], .16, n=4); T.tube('STEEL', [(0, y + h / 2, za), (0, y - h / 2, zb)], .16, n=4)
for (ya, yb) in ((60, 85), (85, 104)):   # the big X between the upper portals
    for sz in (-1, 1): T.tube('STEEL', [(0, ya, -sz * (LZ - 3)), (0, yb, sz * (LZ - 3))], .5, n=4)
for sz in (-1, 1):
    T.box('STEEL', 0, 110, sz * LZ, 6.4, 3.4, 8.4); T.box('STEEL', 0, 112.2, sz * LZ, 3.2, 1.4, 5.2)                 # saddles
    T.bx('GRANITE', -4.2, 4.2, -1.2, 0, sz * LZ - 5.2, sz * LZ + 5.2)                                                  # leg footing
objs += T.build()

tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)
result = {'objects': len(objs), 'tris': tris, 'assets': sorted({o.parent.name for o in objs})}
print(result)
