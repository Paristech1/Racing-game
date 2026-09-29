"""Shared helpers for the AFTERHOURS scenery kits (Blender, bpy): scene setup, kit materials and Acc, a per-material
geometry accumulator in game coords (x right, y up, z forward; Blender (x, -z, y)). Exec this, then a kit script."""
import bpy, bmesh, math
from mathutils import Vector
def G(x, y, z): return Vector((x, -z, y))
def lerp(a, b, t): return a + (b - a) * t
TAU = math.pi * 2
def new_scene(name):
    global scene, KIT, M
    old = bpy.data.scenes.get(name)
    if old:
        for o in list(old.objects): bpy.data.objects.remove(o)
        for c in list(old.collection.children): bpy.data.collections.remove(c)
        bpy.data.scenes.remove(old)
    for blk in (bpy.data.meshes, bpy.data.materials):
        for d in list(blk):
            if d.users == 0: blk.remove(d)
    scene = bpy.data.scenes.new(name)
    for w in bpy.context.window_manager.windows: w.scene = scene
    KIT = bpy.data.collections.new('Kit'); scene.collection.children.link(KIT)
    def mat(n, col, metal=0., rough=.6, emit=None, strength=4.):
        m = bpy.data.materials.new(n); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
        if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
        return m
    M = {'GLASSWALL': mat('GLASSWALL', (.05, .08, .12), .7, .15), 'MULLION': mat('MULLION', (.25, .27, .3), .8, .35),
         'STONE': mat('STONE', (.55, .52, .48), 0, .8), 'CONCRETE': mat('CONCRETE', (.45, .45, .46), 0, .85),
         'WIN': mat('WIN', (1, .85, .6), 0, .4, (1, .8, .5), 3.), 'LED': mat('LED', (1, 1, 1), 0, .3, (1, 1, 1), 8.),
         'CROWN': mat('CROWN', (.6, .7, .9), .2, .3, (.5, .6, .9), 3.), 'DARK': mat('DARK', (.03, .03, .035), .4, .5),
         'STEEL': mat('STEEL', (.3, .32, .35), .9, .3)}
    return scene
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

