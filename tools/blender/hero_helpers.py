"""Shared helpers for the hero car builds (vandal_ss.py, stratos_v.py ...). Exec in the car script's namespace right after
car.build_body(...):  exec(open(os.path.join(HERE, 'hero_helpers.py')).read(), globals())
Gives: SKIN0 (uncut copy for normals) + skin_normals(), BV0 surface queries FZ/BZ/SX/TY, resample, pocket, top_pocket, grid,
bevel_obj, rbox, ring_disc, vinyl_shell(z0, z1, y0, y1). Same code as the Hikari 91 / Hellbound 717 builds."""
import bpy, bmesh, math
from mathutils import Vector
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
    car.body.vertex_groups.clear(); bpy.data.objects.remove(SKIN0)
BV0 = car.BV()
def FZ(x, y):
    h = BV0.ray_cast(G(x, y, 4), Vector((0, 1, 0))); return -h[0].y if h[0] else car.P['Z1']
def BZ(x, y):
    h = BV0.ray_cast(G(x, y, -4), Vector((0, -1, 0))); return -h[0].y if h[0] else car.P['Z0']
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
def _prism(name, fr, bk, cf, cb, m):
    n = len(fr); verts = fr + bk + [cf, cb]
    faces = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [(2 * n, (i + 1) % n, i) for i in range(n)] + [(2 * n + 1, n + i, n + (i + 1) % n) for i in range(n)]
    ob = car.new_obj(name, verts, faces, m, False); car.fixn(ob); return car.cutter(ob, m)
def pocket(name, poly, depth, m='GLOSSBLACK', back=False, per=10):
    """a recess that follows the curved nose/tail: every rim point is pushed `depth` into the skin under it"""
    pts = resample(poly, per) if per > 1 else list(poly); n = len(pts); S = BZ if back else FZ; sg = -1 if back else 1
    cx = sum(p[0] for p in pts) / n; cy = sum(p[1] for p in pts) / n
    return _prism(name, [G(x, y, S(x, y) + sg * .25) for x, y in pts], [G(x, y, S(x, y) - sg * depth) for x, y in pts],
                  G(cx, cy, S(cx, cy) + sg * .25), G(cx, cy, S(cx, cy) - sg * depth), m)
def top_pocket(name, poly_xz, depth, m='GAP'):
    pts = resample(poly_xz, 6); n = len(pts); cx = sum(p[0] for p in pts) / n; cz = sum(p[1] for p in pts) / n
    T = lambda x, z: TY(x, z) or .8
    return _prism(name, [G(x, T(x, z) + .2, z) for x, z in pts], [G(x, T(x, z) - depth, z) for x, z in pts], G(cx, T(cx, cz) + .2, cz), G(cx, T(cx, cz) - depth, cz), m)
def side_pocket(name, poly_zy, depth, sd, m='GLOSSBLACK'):   # a recess pushed into the flank, poly in (z, y)
    pts = resample(poly_zy, 6); n = len(pts); cz = sum(p[0] for p in pts) / n; cy = sum(p[1] for p in pts) / n
    S = lambda y, z: SX(y, z, sd) or 1.
    return _prism(name, [G(sd * (S(y, z) + .2), y, z) for z, y in pts], [G(sd * (S(y, z) - depth), y, z) for z, y in pts],
                  G(sd * (S(cy, cz) + .2), cy, cz), G(sd * (S(cy, cz) - depth), cy, cz), m)
def grid(name, P, nu, nv, m, flip=False):   # P(u, v) -> (x, y, z) in game space
    verts = [G(*P(i / nu, j / nv)) for i in range(nu + 1) for j in range(nv + 1)]; faces = []
    for i in range(nu):
        for j in range(nv):
            a = i * (nv + 1) + j; f = (a, a + nv + 1, a + nv + 2, a + 1); faces.append(tuple(reversed(f)) if flip else f)
    ob = car.new_obj(name, verts, faces, m); car.fixn(ob); return ob
def bevel_obj(ob, off, seg=2, ang=.6):
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.bevel(bm, geom=[e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0) > ang], offset=off, segments=seg, affect='EDGES', profile=.5)
    bm.to_mesh(ob.data); bm.free(); ob.data.shade_smooth(); car.sharpen(ob, 40); return ob
def rbox(name, size, pos, m, rot=(0, 0, 0), r=.006): return bevel_obj(car.box(name, size, pos, m, rot), r, 2)
def face_up(ob):   # an open band: make it face up, or the game culls it
    if ob.data.polygons[len(ob.data.polygons) // 2].normal.z < 0:
        for p_ in ob.data.polygons: p_.flip()
    return ob
def vinyl_shell(z0, z1, y0, y1, nx=.45, off=.004):
    """the livery rides on a copy of the paint flanks `off` proud of the skin; js/afterhours.js maps a canvas onto it
    with side-projected UVs (u from z, v from y)"""
    me = car.body.data; bm = bmesh.new(); bm.from_mesh(me)
    pi = next(i for i, m in enumerate(me.materials) if m.name.split('.')[0] == 'PAINT')
    def ok(f):
        c = f.calc_center_median(); return f.material_index == pi and z0 < -c.y < z1 and y0 < c.z < y1 and abs(f.normal.x) > nx
    keep = set(f for f in bm.faces if ok(f)); bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context='FACES')
    for v in bm.verts: v.co = v.co + v.normal * off
    for f in bm.faces: f.material_index = 0
    vm = bpy.data.meshes.new('Vinyl'); bm.to_mesh(vm); bm.free(); vm.materials.clear(); vm.materials.append(car.M['VINYL']); vm.shade_smooth()
    return car.link(bpy.data.objects.new('Vinyl', vm))
def mk(name, col, metal=0., rough=.5, emit=None, strength=4.):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = strength
    return m
def interior(seat_z=-.4, dash_z=.42, floor=(-.9, .9, -2.1, 2.1), y_center=.95, dy=0.):
    """the cabin liner (cabin skin minus glass, shrunk inward), buckets, dash and wheel, seen through the glass"""
    cab = car.cabin; me = cab.data; bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.material_index == 1], context='FACES')
    for v in bm.verts:
        c = Vector((0, v.co.y, y_center)); v.co = c + (v.co - c) * .965
    bmesh.ops.reverse_faces(bm, faces=bm.faces)
    for f in bm.faces: f.material_index = 0
    lin = bpy.data.meshes.new('Liner'); bm.to_mesh(lin); bm.free(); lin.materials.append(car.M['INTERIOR']); car.link(bpy.data.objects.new('Liner', lin))
    for sd in (1, -1):
        x = sd * .37
        rbox(f'seatback{sd}', (.43, .58, .1), (x, .8 + dy, seat_z), 'INTERIOR', rot=(-.22, 0, 0), r=.025)
        rbox(f'cushion{sd}', (.41, .09, .43), (x, .48 + dy * .6, seat_z + .27), 'INTERIOR', r=.025)
        for e in (1, -1): rbox(f'bol{sd}{e}', (.06, .5, .12), (x + e * .2, .78 + dy, seat_z + .02), 'INTERIOR', rot=(-.22, 0, 0), r=.02)
    rbox('dash', (1.5, .13, .34), (0, .76 + dy, dash_z), 'INTERIOR', rot=(.18, 0, 0), r=.025)
    rbox('console', (.2, .12, .9), (0, .5 + dy * .6, (seat_z + dash_z) / 2), 'INTERIOR', r=.02)
    sw = [(.37 + .16 * math.cos(2 * math.pi * k / 32), .82 + dy + .16 * math.sin(2 * math.pi * k / 32) * .9, dash_z - .22 + .16 * math.sin(2 * math.pi * k / 32) * .42) for k in range(33)]
    car.tube('steer', sw, .015, 'INTERIOR', res=4)
    x0, x1, z0, z1 = floor; car.extrude_y('Floor', [(x0, z0), (x1, z0), (x1, z1), (x0, z1)], .14, .16, 'GLOSSBLACK')
def rivets(WB, WR, R, sd, r=.011, n=17):
    for zw in (WB, -WB):
        for k in range(n):
            a = math.radians(-4 + 188 * k / (n - 1)); y = WR + R * math.sin(a); z = zw + R * math.cos(a)
            if y < .2: continue
            x = SX(y, z, sd)
            if x: car.sphere(f'rivet{sd}{zw}{k}', (sd * (x + .001), y, z), r, 'CHROME', scale=(.5, 1, 1), seg=10)
def shut(name, sd, z0, ln, y0, y1, kink=0.):
    pts = []
    for k in range(14):
        y = lerp(y0, y1, k / 13); z = z0 + ln * (y - y0) + kink * math.sin(k / 13 * math.pi); x = car.surf_side(y, z, sd)
        if x: pts.append((sd * x, y, z))
    if len(pts) > 2: car.strip_cut(name, pts, .0032, .012)
def flare_seam(name, sd, zw, WR, R):
    pts = []
    for k in range(17):
        a = math.radians(-6 + 192 * k / 16); y = WR + R * math.sin(a); z = zw + R * math.cos(a)
        if y < .2: continue
        x = car.surf_side(y, z, sd)
        if x: pts.append((sd * x, y, z))
    if len(pts) > 2: car.strip_cut(name, pts, .0035, .011)
