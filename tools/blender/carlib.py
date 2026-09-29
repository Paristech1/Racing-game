"""AFTERHOURS car-building library for Blender (bpy), shared by the per-car scripts (wisp_07.py, hellbound_717.py, ...).
Exec this file, then exec a car script in the same namespace. Game coords: x right, y up, z forward; Blender (x, -z, y).
The body is a loft of designed cross-sections (sill tuck -> bulge -> tumble-in -> shoulder -> crowned deck), cut with
booleans (arches, intakes, lamp recesses, panel gaps); the cabin is a second loft with a parametric glass / pillar split.
Material names are the contract with js/afterhours.js (glbParts): PAINT CARBON GLASS GLOSSBLACK GAP HEAD TAIL CHROME
LENS SATIN ACCENT STRIPE."""
import bpy, bmesh, math
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

def G(x, y, z): return Vector((x, -z, y))
def clamp(v, a, b): return max(a, min(b, v))
def lerp(a, b, t): return a + (b - a) * t
def smooth(e0, e1, v):
    t = clamp((v - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)
def kf(keys, z):
    i = 0
    while i < len(keys) - 2 and z > keys[i + 1][0]: i += 1
    p0 = keys[max(0, i - 1)]; p1 = keys[i]; p2 = keys[i + 1]; p3 = keys[min(len(keys) - 1, i + 2)]
    t = clamp((z - p1[0]) / (p2[0] - p1[0]), 0, 1); t2 = t * t; t3 = t2 * t
    return .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)

class Car:
    def __init__(self, scene_name, paint=(.5, .5, .5), accent=(.4, 1, .95)):
        old = bpy.data.scenes.get(scene_name)
        if old:
            for o in list(old.objects): bpy.data.objects.remove(o)
            for c in list(old.collection.children): bpy.data.collections.remove(c)
            bpy.data.scenes.remove(old)
        for blk in (bpy.data.meshes, bpy.data.curves, bpy.data.materials):
            for d in list(blk):
                if d.users == 0: blk.remove(d)
        self.scene = bpy.data.scenes.new(scene_name)
        for w in bpy.context.window_manager.windows: w.scene = self.scene
        self.VL = self.scene.view_layers[0]
        self.CAR = bpy.data.collections.new('Car'); self.scene.collection.children.link(self.CAR)
        def mat(name, col, metal=0., rough=.5, emit=None, coat=False, strength=6.):
            m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
            b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
            if coat and 'Coat Weight' in b.inputs: b.inputs['Coat Weight'].default_value = 1.; b.inputs['Coat Roughness'].default_value = .02
            if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
            return m
        self.M = {'PAINT': mat('PAINT', paint, .6, .2, coat=True), 'CARBON': mat('CARBON', (.02, .021, .024), .1, .35, coat=True),
                  'GLASS': mat('GLASS', (.004, .005, .007), .2, .02, coat=True), 'GLOSSBLACK': mat('GLOSSBLACK', (.005, .005, .006), .2, .08, coat=True),
                  'GAP': mat('GAP', (.002, .002, .002), 0., .9), 'HEAD': mat('HEAD', (.9, .95, 1.), 0., .3, emit=(.85, .92, 1.)),
                  'TAIL': mat('TAIL', (1., .05, .05), 0., .3, emit=(1., .03, .05), strength=8.), 'CHROME': mat('CHROME', (.85, .86, .88), 1., .08),
                  'LENS': mat('LENS', (.9, .9, .9), 0., .02), 'SATIN': mat('SATIN', (.2, .21, .23), .9, .3),
                  'ACCENT': mat('ACCENT', accent, 0., .3, emit=accent, strength=6.), 'STRIPE': mat('STRIPE', (.004, .004, .005), .3, .1, coat=True)}
        self.cut_objs = []; self.body = None; self.cabin = None; self.bvh = None

    # ---------------------------------------------------------------- basics
    def DG(self):
        d = self.VL.depsgraph; d.update(); return d
    def link(self, ob): self.CAR.objects.link(ob); return ob
    def fixn(self, ob):
        bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    def new_obj(self, name, verts, faces, m, smooth_=True):
        me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
        ob = self.link(bpy.data.objects.new(name, me)); me.materials.append(self.M[m])
        if smooth_: me.shade_smooth()
        return ob
    def loft(self, name, stations, m, smooth_=True, cap=True):
        verts = [v for r in stations for v in r]; n = len(stations[0]); S = len(stations); faces = []
        for i in range(S - 1):
            for j in range(n):
                a = i * n + j; b = i * n + (j + 1) % n; c = (i + 1) * n + (j + 1) % n; d = (i + 1) * n + j; faces.append((a, b, c, d))
        if cap:
            for i, flip in ((0, True), (S - 1, False)):
                ring = list(range(i * n, i * n + n)); faces.append(tuple(reversed(ring)) if flip else tuple(ring))
        ob = self.new_obj(name, verts, faces, m, smooth_); self.fixn(ob); return ob
    @staticmethod
    def mirror_ring(half): return half + [(-x, y) for (x, y) in reversed(half[1:-1])]
    def sharpen(self, ob, deg):
        bm = bmesh.new(); bm.from_mesh(ob.data); lim = math.radians(deg)
        for f in bm.faces: f.smooth = True
        for e in bm.edges: e.smooth = len(e.link_faces) == 2 and e.calc_face_angle(0) <= lim and e.link_faces[0].material_index == e.link_faces[1].material_index
        bm.to_mesh(ob.data); bm.free()
    def slot_of(self, ob, key):
        for i, m in enumerate(ob.data.materials):
            if m and m.name.split('.')[0] == key: return i
        ob.data.materials.append(self.M[key]); return len(ob.data.materials) - 1

    # ---------------------------------------------------------------- body
    def build_body(self, P):
        """P: Z0 Z1 HW YB YS YT, optional dome(x,z), lean(y,z,P), swage=(yl_fn, w_fn, depth), feature (bool), sill (tuck depth),
        Rx (shoulder radius), nose/tail rounding."""
        self.P = P; Z0, Z1 = P['Z0'], P['Z1']; HW, YB, YS, YT = P['HW'], P['YB'], P['YS'], P['YT']
        dome = P.get('dome', lambda x, z: 0.); tuck = P.get('sill', .085); Rx = P.get('Rx', .15)
        sw = P.get('swage'); feat = P.get('feature', True)
        def section(z):
            hs = kf(HW, z); yb = kf(YB, z); ys = kf(YS, z); yt = max(kf(YT, z), ys + .03)
            yw = yb + (ys - yb) * P.get('bulge_at', .5); Ry = max(.022, (yt - .012) - ys); x0 = hs - .045
            half = [(0, yb), (hs - tuck - .16, yb), (hs - tuck - .05, yb + .008), (hs - tuck - .015, yb + .045), (hs - tuck, yb + .1)]
            yl, wl, dl = (sw[0](z), sw[1](z), sw[2]) if sw else (0, 0, 0)
            for k in range(1, 9):
                t = k / 8; y = lerp(yb + .1, yw, t); half.append((hs - tuck * (1 - t) ** 2.2 - dl * wl * math.exp(-((y - yl) / .04) ** 2), y))
            for t in (.22, .44, .5, .56, .78, 1.):
                half.append((hs - .045 * t ** 1.7 - (.007 if (feat and t > .5) else 0), lerp(yw, ys, t)))
            for k in range(1, 7):
                a = k / 6 * math.pi / 2; half.append((x0 - Rx * (1 - math.cos(a)), ys + Ry * math.sin(a)))
            xe = x0 - Rx; ye = ys + Ry
            for k in range(1, 7):
                t = k / 6; x = lerp(xe, 0, t); half.append((x, ye + (yt - ye) * (1 - (1 - t) ** 2) + dome(x, z)))
            half[-1] = (0, half[-1][1])
            rn, rt = P.get('round_nose', .16), P.get('round_tail', .18)
            tn = clamp((z - (Z1 - rn)) / rn, 0, 1); tr = clamp(((Z0 + rt) - z) / rt, 0, 1)
            en = 1 - math.sqrt(max(0., 1 - tn * tn)); er = 1 - math.sqrt(max(0., 1 - tr * tr)); ym = (yb + yt) * .5
            return [(x * (1 - .2 * en - .12 * er), ym + (y - ym) * (1 - .28 * en - .18 * er)) for x, y in half]
        leanf = P.get('lean', lambda y, z: 0.)
        stations = []; NS = P.get('NS', 220)
        for i in range(NS):
            t = i / (NS - 1); t = .82 * t + .18 * (.5 - .5 * math.cos(math.pi * t)); z = Z0 + (Z1 - Z0) * t
            stations.append([G(x, y, z + leanf(y, z)) for x, y in self.mirror_ring(section(z))])
        self.body = self.loft('Body', stations, 'PAINT'); self.bvh = self.BV(); return self.body
    def h_of(self, y, z):  # 0 at the floor, 1 at the deck
        P = self.P; yb = kf(P['YB'], z); yt = kf(P['YT'], z); return clamp((y - yb) / max(yt - yb, .01), 0, 1)

    # ---------------------------------------------------------------- cutters
    def cutter(self, ob, m):
        ob.data.materials.clear(); ob.data.materials.append(self.M[m]); ob.hide_render = True; self.cut_objs.append(ob); return ob
    def front_prism(self, name, poly_xy, z0, z1, m='GAP'):
        n = len(poly_xy); verts = [G(x, y, z0) for x, y in poly_xy] + [G(x, y, z1) for x, y in poly_xy]
        faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        ob = self.new_obj(name, verts, faces, m, False); self.fixn(ob); return self.cutter(ob, m)
    def side_prism(self, name, poly_zy, x0, x1, m='GAP'):
        n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
        faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        ob = self.new_obj(name, verts, faces, m, False); self.fixn(ob); return self.cutter(ob, m)
    def cyl_x(self, name, cy, cz, r, x0, x1, m='GAP', seg=96):
        verts = []
        for x in (x0, x1):
            for k in range(seg): a = 2 * math.pi * k / seg; verts.append(G(x, cy + r * math.sin(a), cz + r * math.cos(a)))
        faces = [tuple(range(seg)), tuple(range(2 * seg - 1, seg - 1, -1))] + [(k, (k + 1) % seg, seg + (k + 1) % seg, seg + k) for k in range(seg)]
        ob = self.new_obj(name, verts, faces, m, False); self.fixn(ob); return self.cutter(ob, m)
    @staticmethod
    def rounded(cx, cy, w, h, r, n=5, skew=0.):
        pts = []
        for (qx, qy, a0) in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
            for k in range(n + 1):
                a = math.radians(a0 + 90 * k / n); x = cx + qx * (w / 2 - r) + r * math.cos(a); y = cy + qy * (h / 2 - r) + r * math.sin(a)
                pts.append((x + skew * (y - cy), y))
        return pts
    def strip_cut(self, name, pts, hw, depth, m='GAP', axis='side'):
        verts = []; faces = []
        for (x, y, z) in pts:
            if axis == 'side':
                sd = 1 if x > 0 else -1
                verts += [G(x + sd * .05, y, z - hw), G(x + sd * .05, y, z + hw), G(x - sd * depth, y, z + hw), G(x - sd * depth, y, z - hw)]
            elif axis == 'top':
                verts += [G(x - hw, y + .05, z), G(x + hw, y + .05, z), G(x + hw, y - depth, z), G(x - hw, y - depth, z)]
            else:
                verts += [G(x, y + .05, z - hw), G(x, y + .05, z + hw), G(x, y - depth, z + hw), G(x, y - depth, z - hw)]
        for i in range(len(pts) - 1):
            for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
        L = 4 * (len(pts) - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
        ob = self.new_obj(name, verts, faces, m, False); self.fixn(ob); return self.cutter(ob, m)
    def lamp_recess(self, name, pts, h0, h1, depth_in=.06, depth_out=.2, m='GLOSSBLACK'):  # a slot following surface points
        verts = []; faces = []; n = len(pts)
        for k, (x, y, z) in enumerate(pts):
            h = lerp(h0, h1, k / max(n - 1, 1))
            verts += [G(x, y - h, z + depth_out), G(x, y + h * .8, z + depth_out), G(x, y + h * .8, z - depth_in), G(x, y - h, z - depth_in)]
        for i in range(n - 1):
            for j in range(4): a = 4 * i + j; b = 4 * i + (j + 1) % 4; faces.append((a, b, b + 4, a + 4))
        L = 4 * (n - 1); faces += [(0, 1, 2, 3), (L + 3, L + 2, L + 1, L)]
        ob = self.new_obj(name, verts, faces, m, False); self.fixn(ob); return self.cutter(ob, m)
    def apply_cuts(self):
        cc = bpy.data.collections.new('Cutters'); self.scene.collection.children.link(cc)
        for o in self.cut_objs:
            for c in list(o.users_collection): c.objects.unlink(o)
            cc.objects.link(o)
        mod = self.body.modifiers.new('cuts', 'BOOLEAN'); mod.operation = 'DIFFERENCE'; mod.solver = 'EXACT'; mod.operand_type = 'COLLECTION'; mod.collection = cc
        if hasattr(mod, 'material_mode'): mod.material_mode = 'TRANSFER'
        nm = bpy.data.meshes.new_from_object(self.body.evaluated_get(self.DG())); self.body.modifiers.clear(); om = self.body.data; self.body.data = nm; bpy.data.meshes.remove(om)
        for o in list(cc.objects): bpy.data.objects.remove(o)
        bpy.data.collections.remove(cc); self.cut_objs = []
    def recolor(self, key, test):  # test(gx, gy, gz, normal_game) -> bool, applied to PAINT faces of the body
        si = self.slot_of(self.body, key)
        for p in self.body.data.polygons:
            if p.material_index != 0: continue
            c = p.center; n = p.normal
            if test(abs(c.x), c.z, -c.y, (n.x, n.z, -n.y)): p.material_index = si

    # ---------------------------------------------------------------- surface queries
    def BV(self, objs=None):
        objs = objs or [self.body]
        if len(objs) == 1: return BVHTree.FromObject(objs[0], self.DG())
        verts = []; polys = []
        for o in objs:
            me = o.evaluated_get(self.DG()).to_mesh(); off = len(verts); verts += [o.matrix_world @ v.co for v in me.vertices]
            polys += [[off + i for i in p.vertices] for p in me.polygons]; o.evaluated_get(self.DG()).to_mesh_clear()
        return BVHTree.FromPolygons(verts, polys)
    def surf_y(self, x, z, bvh=None):
        h = (bvh or self.bvh).ray_cast(G(x, 3, z), Vector((0, 0, -1))); return h[0].z if h[0] else None
    def surf_front(self, x, y):
        h = self.bvh.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else None
    def surf_back(self, x, y):
        h = self.bvh.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else None
    def surf_side(self, y, z, sd=1):
        h = self.bvh.ray_cast(G(sd * 2.5, y, z), Vector((-sd, 0, 0))); return abs(h[0].x) if h[0] else None

    # ---------------------------------------------------------------- cabin
    def build_cabin(self, C):
        """C: CZ0 CZ1 CH(z->roof y) cw(z) rw(z) dlo=(F, K, R0, R1) pillars=[(z0,z1),...] (black, on the side glass)."""
        self.C = C; CZ0, CZ1, CH = C['CZ0'], C['CZ1'], C['CH']; cw_, rw_ = C['cw'], C['rw']; BELT = {}
        def belt(z): return (self.surf_y(cw_(z) + .01, z) or kf(self.P['YT'], z)) - .004
        self.belt = belt
        def ring(z, grow=0.):
            cw = cw_(z) + grow; rw = rw_(z) + grow * .7; top = kf(CH, z) + grow * .5; b = BELT.setdefault(round(z, 5), belt(z))
            half = [(0, b - .08), (cw + .004, b - .08), (cw, b)]
            for k in range(1, 15):
                t = k / 15; half.append((lerp(cw, rw, t ** 1.18) + .012 * math.sin(math.pi * t), lerp(b, top - .05, t)))
            for k in range(0, 9):
                t = k / 8; half.append((rw * (1 - t) * (1 - .04 * t), top - .05 * (1 - t) ** 2))
            half[-1] = (0, top); return half
        self.cab_ring = ring
        CZS = [lerp(CZ0, CZ1, i / 159) for i in range(160)]
        cab = [[G(x, y, z) for x, y in self.mirror_ring(ring(z))] for z in CZS]
        self.cabin = self.loft('Cabin', cab, 'PAINT'); self.cabin.data.materials.append(self.M['GLASS']); self.cabin.data.materials.append(self.M['GLOSSBLACK'])
        NR = len(cab[0]); NH = NR // 2 + 1
        def ring_u(jj):
            h = jj if jj < NH else NR - jj
            return clamp((h - 2) / 14 * .55, 0, .55) if h <= 16 else .55 + (h - 16) / (NH - 1 - 16) * .45
        self.ring_u = ring_u
        F, K, R0, R1 = C['dlo']; RG = C.get('rear_glass', CZ0 + .5)
        def a_line(u): return lerp(F, F - K * .97, clamp(u / .6, 0, 1))
        self.a_line = a_line
        for p in self.cabin.data.polygons:
            js = sorted({v % NR for v in p.vertices})
            if len(js) != 2: continue
            j0, j1 = js if js[1] - js[0] == 1 else (js[1], js[0])
            if min(j0 if j0 < NH else NR - j0, j1 if j1 < NH else NR - j1) < 2: continue
            u = .5 * (ring_u(j0) + ring_u(j1)); gz = -p.center.y; za = a_line(u)
            if gz > za + .03: p.material_index = 1
            elif gz > za - .03: continue
            elif u >= .6: p.material_index = 1 if gz < RG else 0
            elif u < .53 and lerp(R0, R1, u / .53) < gz:
                p.material_index = 2 if any(a < gz < b for a, b in C.get('pillars', [])) else 1
        self.sharpen(self.cabin, 32)
        # A-pillar blades and the DLO surround
        def ring_pt(z, u, grow=.004):
            half = ring(z, grow); us = [ring_u(h) for h in range(len(half))]
            for h in range(2, len(half) - 1):
                if us[h] <= u <= us[h + 1]:
                    t = (u - us[h]) / max(us[h + 1] - us[h], 1e-6); return lerp(half[h][0], half[h + 1][0], t), lerp(half[h][1], half[h + 1][1], t)
            return half[-1]
        self.ring_pt = ring_pt
        for sd in (1, -1):
            pts = []
            for k in range(16):
                u = .6 * k / 15; z = a_line(u); x, y = ring_pt(z, u); pts.append((sd * x, y, z))
            self.tube(f'apillar{sd}', pts, C.get('apillar_r', .016), 'GLOSSBLACK', res=4)
            trim = C.get('dlo_trim', 'CHROME')
            if trim:
                self.tube(f'dlo_belt{sd}', [(sd * (cw_(z) + .003), belt(z) + .005, z) for z in [lerp(F, R0, k / 20) for k in range(21)]], .0065, trim, res=4)
                top = []
                for k in range(20):
                    z = lerp(F - K * .97, R1, k / 19); x, y = ring_pt(z, .53, .006); top.append((sd * x, y, z))
                top.append((sd * (cw_(R0) + .003), belt(R0) + .005, R0))
                self.tube(f'dlo_top{sd}', top, .0065, trim, res=4)
        return self.cabin

    # ---------------------------------------------------------------- detail primitives
    def tube(self, name, pts, r, m, res=6):
        cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 2; cu.resolution_u = res; cu.use_fill_caps = True
        sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
        for p, q in zip(sp.points, pts): p.co = (*G(*q), 1)
        sp.use_endpoint_u = True; sp.order_u = min(4, len(pts))
        ob = bpy.data.objects.new(name, cu); self.CAR.objects.link(ob); cu.materials.append(self.M[m])
        me = bpy.data.meshes.new_from_object(ob.evaluated_get(self.DG())); bpy.data.objects.remove(ob); bpy.data.curves.remove(cu)
        ob = self.link(bpy.data.objects.new(name, me)); me.shade_smooth(); return ob
    def box(self, name, size, pos, m, rot=(0, 0, 0)):
        sx, sy, sz = size; x, y, z = pos
        bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.); me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        R = Matrix.Rotation(rot[2], 4, 'Z') @ Matrix.Rotation(rot[1], 4, 'Y') @ Matrix.Rotation(rot[0], 4, 'X')
        for v in me.vertices: g = R @ Vector((v.co.x * sx, v.co.z * sy, v.co.y * sz)); v.co = G(g.x, g.y, g.z) + G(x, y, z)
        ob = self.link(bpy.data.objects.new(name, me)); me.materials.append(self.M[m]); return ob
    def extrude_y(self, name, poly_xz, y0, y1, m):
        n = len(poly_xz); verts = [G(x, y0, z) for x, z in poly_xz] + [G(x, y1, z) for x, z in poly_xz]
        faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        ob = self.new_obj(name, verts, faces, m, False); self.fixn(ob); return ob
    def extrude_x(self, name, poly_zy, x0, x1, m, smooth_=False):
        n = len(poly_zy); verts = [G(x0, y, z) for z, y in poly_zy] + [G(x1, y, z) for z, y in poly_zy]
        faces = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        ob = self.new_obj(name, verts, faces, m, smooth_); self.fixn(ob); return ob
    def cyl(self, name, p0, p1, r0, m, r1=None, seg=20, cap=True):  # cylinder between two points
        r1 = r0 if r1 is None else r1; A = Vector(p0); B = Vector(p1); d = B - A; t = d.normalized()
        u = t.cross(Vector((0, 1, 0))) if abs(t.y) < .9 else t.cross(Vector((1, 0, 0))); u.normalize(); w = t.cross(u)
        verts = []
        for P, r in ((A, r0), (B, r1)):
            for k in range(seg): a = 2 * math.pi * k / seg; q = P + (u * math.cos(a) + w * math.sin(a)) * r; verts.append(G(q.x, q.y, q.z))
        faces = [(k, (k + 1) % seg, seg + (k + 1) % seg, seg + k) for k in range(seg)]
        if cap: faces += [tuple(range(seg - 1, -1, -1)), tuple(range(seg, 2 * seg))]
        ob = self.new_obj(name, verts, faces, m); self.fixn(ob); return ob
    def sphere(self, name, c, r, m, scale=(1, 1, 1), seg=12):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=max(6, seg // 2), radius=1.)
        for v in bm.verts: v.co = G(c[0] + v.co.x * r * scale[0], c[1] + v.co.z * r * scale[1], c[2] + v.co.y * r * scale[2])
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(self.M[m]); me.shade_smooth()
        return self.link(bpy.data.objects.new(name, me))
    def band(self, name, fn, z0, z1, nz, nu, m):  # surface patch: fn(u, z) -> (x, y)
        verts = []; faces = []
        for i in range(nz + 1):
            z = lerp(z0, z1, i / nz)
            for j in range(nu + 1): x, y = fn(j / nu, z); verts.append(G(x, y, z))
        W = nu + 1
        for i in range(nz):
            for j in range(nu): a = i * W + j; faces.append((a, a + 1, a + W + 1, a + W))
        return self.new_obj(name, verts, faces, m)
    def arch_liners(self, WB, WR, R, x0=.56, x1=1.0, zs=None):
        for sd in (1, -1):
            for zw in (zs or (WB, -WB)):
                seg = 40; verts = []; faces = []
                for x in (sd * x0, sd * x1):
                    for k in range(seg + 1):
                        a = math.radians(-20 + 220 * k / seg); verts.append(G(x, WR + (R - .006) * math.sin(a), zw + (R - .006) * math.cos(a)))
                for k in range(seg): faces.append((k, k + 1, seg + 2 + k, seg + 1 + k))
                self.new_obj(f'liner{sd}{zw}', verts, faces, 'GAP')
    def mirror(self, fn):  # call fn(sd) for both sides
        for sd in (1, -1): fn(sd)
    def objs(self): return [o for o in self.CAR.objects if o.type == 'MESH']
    def stats(self):
        ob = self.objs(); return {'objects': len(ob), 'tris': sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in ob)}
