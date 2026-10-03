"""AFTERHOURS hero rig: turns a built car scene into a showcase scene (not exported to the game).
Adds real wheels (tyres with tread, rims, drilled discs, calipers), studio-grade paint / carbon / glass shaders, a cyclorama
studio or a night rig, named cameras (Cam_<view>), and Cycles renders.

    import hero_rig
    hero_rig.dress(scene, M, track=.87, wb=1.5, wr=.37, paint=(...), rim='turbine', caliper=(...), look='studio')
    hero_rig.render(scene, '/tmp/out', views=['front34', 'side'], samples=64, res=(1600, 900))

Game coords: x right, y up, z forward (Blender (x, -z, y))."""
import math, bpy, bmesh
from mathutils import Vector

def G(x, y, z): return Vector((x, -z, y))
def lerp(a, b, t): return a + (b - a) * t

def bsdf(m): return m.node_tree.nodes['Principled BSDF']
def setp(m, **kw):
    b = bsdf(m)
    for k, v in kw.items():
        b.inputs[k.replace('_', ' ')].default_value = (*v, 1) if isinstance(v, tuple) and len(v) == 3 else v
def newmat(name, col, metal=0., rough=.5, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True; setp(m, Base_Color=col, Metallic=metal, Roughness=rough, **kw); return m
def node(m, kind):
    return m.node_tree.nodes.new(kind)
def link(m, a, b): m.node_tree.links.new(a, b)

def shaders(M, paint, flake=True, metallic=.3, rough=.26, coat=1., coat_rough=.015):
    P = M['PAINT']; setp(P, Base_Color=paint, Metallic=metallic, Roughness=rough, Coat_Weight=coat, Coat_Roughness=coat_rough, Coat_IOR=1.5)
    if flake:
        fl = node(P, 'ShaderNodeTexNoise'); fl.inputs['Scale'].default_value = 2200.; fl.inputs['Detail'].default_value = 1.
        bu = node(P, 'ShaderNodeBump'); bu.inputs['Strength'].default_value = .035
        link(P, fl.outputs['Fac'], bu.inputs['Height']); link(P, bu.outputs['Normal'], bsdf(P).inputs['Normal'])
    C = M['CARBON']; setp(C, Metallic=.05, Roughness=.42, Coat_Weight=.5, Coat_Roughness=.06)
    tc = node(C, 'ShaderNodeTexCoord'); ck = node(C, 'ShaderNodeTexChecker'); ck.inputs['Scale'].default_value = 140.
    wa = node(C, 'ShaderNodeTexWave'); wa.bands_direction = 'X'; wa.inputs['Scale'].default_value = 560.; wa.inputs['Distortion'].default_value = 0.
    wb = node(C, 'ShaderNodeTexWave'); wb.bands_direction = 'Y'; wb.inputs['Scale'].default_value = 560.; wb.inputs['Distortion'].default_value = 0.
    for n in (ck, wa, wb): link(C, tc.outputs['Object'], n.inputs['Vector'])
    mx = node(C, 'ShaderNodeMix'); mx.data_type = 'FLOAT'
    link(C, ck.outputs['Fac'], mx.inputs[0]); link(C, wa.outputs['Fac'], mx.inputs[2]); link(C, wb.outputs['Fac'], mx.inputs[3])
    cr = node(C, 'ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (.0015, .0016, .002, 1); cr.color_ramp.elements[1].color = (.02, .021, .024, 1)
    link(C, mx.outputs[0], cr.inputs['Fac']); link(C, cr.outputs['Color'], bsdf(C).inputs['Base Color'])
    setp(M['GLASS'], Base_Color=(.006, .007, .009), Metallic=0., Roughness=.02, Transmission_Weight=.12, IOR=1.3, Coat_Weight=.3, Coat_Roughness=0.)
    if 'LENS' in M: setp(M['LENS'], Base_Color=(1., 1., 1.), Roughness=0., Transmission_Weight=1.)
    setp(M['HEAD'], Emission_Strength=30.); setp(M['TAIL'], Emission_Strength=22.)
    if 'ACCENT' in M: setp(M['ACCENT'], Emission_Strength=14.)
    setp(M['GLOSSBLACK'], Metallic=0., Roughness=.06, Coat_Weight=1.)

# ---------------------------------------------------------------- wheels
def _mesh(scene, name, verts, faces, m, smooth=True, crease=None):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob); me.materials.append(m)
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if smooth:
        lim = math.radians(crease or 180)
        for f in bm.faces: f.smooth = True
        for e in bm.edges: e.smooth = len(e.link_faces) == 2 and e.calc_face_angle(0) <= lim
    bm.to_mesh(me); bm.free(); return ob

def lathe(prof, seg=96, t0=0., t1=2 * math.pi, closed=True):
    full = abs((t1 - t0) - 2 * math.pi) < 1e-6; S = seg if full else seg + 1; n = len(prof); V = []; F = []
    for k in range(S):
        t = t0 + (t1 - t0) * k / seg; V += [(a, r * math.cos(t), r * math.sin(t)) for r, a in prof]
    for k in range(seg):
        k2 = (k + 1) % S
        for j in range(n if closed else n - 1):
            j2 = (j + 1) % n; F.append((k * n + j, k * n + j2, k2 * n + j2, k2 * n + j))
    if not full and closed:
        F.append(tuple(range(n))); F.append(tuple(range((S - 1) * n + n - 1, (S - 1) * n - 1, -1)))
    return V, F

def _sc(prof, k): return [(r * k, a) for r, a in prof]
def place(V, sx): return [Vector((sx * a, y, z)) for a, y, z in V]

def _spokes_split10(k):
    V = []; F = []
    for p in range(5):
        phi = 2 * math.pi * p / 5 + math.pi / 2
        for side in (-1, 1):
            base = len(V); NS = 9
            for i in range(NS):
                u = i / (NS - 1); r = lerp(.068, .281, u) * k; ang = phi + side * lerp(.06, .155, u ** .8)
                a = lerp(.062, .118, u ** 1.6); w = lerp(.017, .011, u) * k; t = lerp(.034, .022, u)
                for (dw, da) in ((-w, 0), (w, 0), (w * .8, -t), (-w * .8, -t)):
                    aa = ang + dw / r; V.append((a + da, r * math.cos(aa), r * math.sin(aa)))
            for i in range(NS - 1):
                for j in range(4): a0 = base + 4 * i + j; a1 = base + 4 * i + (j + 1) % 4; F.append((a0, a1, a1 + 4, a0 + 4))
            F.append((base + 3, base + 2, base + 1, base)); L = base + 4 * (NS - 1); F.append((L, L + 1, L + 2, L + 3))
    return V, F

def _spokes_turbine(k, n=18):
    """curved turbine blades: thin vanes that sweep round as they run out to the rim, with a deep concave face"""
    V = []; F = []
    for p in range(n):
        phi = 2 * math.pi * p / n
        base = len(V); NS = 10
        for i in range(NS):
            u = i / (NS - 1); r = lerp(.075, .281, u) * k; ang = phi + .9 * u ** 1.3      # sweep
            a = lerp(.05, .118, u ** 1.4); w = lerp(.008, .006, u) * k; t = lerp(.05, .03, u)
            for (dw, da) in ((-w, 0), (w, 0), (w, -t), (-w, -t)):
                aa = ang + dw / r; V.append((a + da, r * math.cos(aa), r * math.sin(aa)))
        for i in range(NS - 1):
            for j in range(4): a0 = base + 4 * i + j; a1 = base + 4 * i + (j + 1) % 4; F.append((a0, a1, a1 + 4, a0 + 4))
        F.append((base + 3, base + 2, base + 1, base)); L = base + 4 * (NS - 1); F.append((L, L + 1, L + 2, L + 3))
    return V, F

def wheels(scene, track, wb, wr, rim='split10', caliper=(.9, .38, 0.), steer=-9., rim_col=(.006, .006, .007), coll=None):
    k = wr / .36   # profiles below are authored for a .36 m rolling radius
    TYRE = newmat('TYRE', (.004, .004, .0045), 0., .7); RIM = newmat('RIM', rim_col, .5, .22, Coat_Weight=.5, Coat_Roughness=.1)
    LIP = newmat('RIMLIP', (.02, .02, .022), .8, .2); DISC = newmat('DISC', (.09, .09, .095), .3, .55)
    CAL = newmat('CALIPER', caliper, 0., .2, Coat_Weight=1., Coat_Roughness=.03); HAT = newmat('HAT', (.45, .45, .47), 1., .35)
    GAP = newmat('HOLE', (.002, .002, .002), 0., .9)
    out = []
    for sx, sn in ((1, 'R'), (-1, 'L')):
        for zw, fn in ((wb, 'F'), (-wb, 'R')):
            tag = fn + sn; parts = []
            outp = [(.288, .128), (.3, .143), (.322, .152), (.342, .151), (.353, .143), (.3585, .13), (.3605, .112)]
            tread = []
            for g in (.068, .024, -.024, -.068): tread += [(.3605, g + .007), (.351, g + .006), (.351, g - .006), (.3605, g - .007)]
            prof = outp + tread + [(r, -a) for r, a in reversed(outp)] + [(.281, -.118), (.281, .118)]
            V, F = lathe(_sc(prof, k), 128); parts.append(_mesh(scene, f'tyre_{tag}', place(V, sx), F, TYRE, crease=40))
            V, F = lathe(_sc([(.271, -.128), (.279, -.13), (.281, .108), (.289, .122), (.296, .13), (.293, .136), (.281, .134), (.271, .118)], k), 128)
            parts.append(_mesh(scene, f'barrel_{tag}', place(V, sx), F, RIM, crease=50))
            V, F = lathe(_sc([(.2815, .1355), (.2945, .1365), (.2955, .1335), (.282, .1325)], k), 128); parts.append(_mesh(scene, f'lip_{tag}', place(V, sx), F, LIP))
            V, F = (_spokes_turbine(k) if rim == 'turbine' else _spokes_split10(k)); parts.append(_mesh(scene, f'spokes_{tag}', place(V, sx), F, RIM, crease=55))
            V, F = lathe(_sc([(.001, .075), (.06, .075), (.072, .066), (.074, .03), (.001, .03)], k), 64); parts.append(_mesh(scene, f'hub_{tag}', place(V, sx), F, RIM, crease=50))
            V, F = lathe(_sc([(.001, .108), (.03, .108), (.036, .1), (.036, .072), (.001, .072)], k), 6); parts.append(_mesh(scene, f'nut_{tag}', place(V, sx), F, LIP, smooth=False))
            V, F = lathe(_sc([(.1, -.017), (.218, -.017), (.22, -.02), (.22, -.046), (.218, -.049), (.1, -.049)], k), 128); parts.append(_mesh(scene, f'disc_{tag}', place(V, sx), F, DISC, crease=50))
            V, F = lathe(_sc([(.001, .03), (.104, .03), (.104, -.03), (.096, -.03), (.096, .022), (.001, .022)], k), 64); parts.append(_mesh(scene, f'hat_{tag}', place(V, sx), F, HAT, crease=50))
            V = []; F = []
            for ring, (rr, cnt) in enumerate(((.13, 26), (.16, 26), (.19, 26))):
                for q in range(cnt):
                    t = 2 * math.pi * (q + ring / 3) / cnt; cy, cz = rr * k * math.cos(t), rr * k * math.sin(t); b = len(V)
                    for a in (-.0155, -.0505):
                        for s in range(8): u = 2 * math.pi * s / 8; V.append((a, cy + .0055 * math.cos(u), cz + .0055 * math.sin(u)))
                    F += [tuple(b + s for s in range(8)), tuple(b + 8 + s for s in reversed(range(8)))]
                    F += [(b + s, b + (s + 1) % 8, b + 8 + (s + 1) % 8, b + 8 + s) for s in range(8)]
            parts.append(_mesh(scene, f'drill_{tag}', place(V, sx), F, GAP, smooth=False))
            tc = math.radians(48 if zw > 0 else 132)
            V, F = lathe(_sc([(.165, -.066), (.236, -.066), (.246, -.056), (.246, -.002), (.236, .01), (.165, .01), (.159, -.028)], k), 24, tc - .5, tc + .5)
            parts.append(_mesh(scene, f'caliper_{tag}', place(V, sx), F, CAL, crease=45))
            root = bpy.data.objects.new(f'Wheel_{tag}', None); scene.collection.objects.link(root); root.location = G(sx * track, wr, zw); root.empty_display_size = .4
            for p in parts: p.parent = root
            if zw > 0 and steer: root.rotation_euler = (0, 0, math.radians(steer))
            out.append(root); out += parts
    if coll:
        for o in out:
            for c in list(o.users_collection): c.objects.unlink(o)
            coll.objects.link(o)
    return out

# ---------------------------------------------------------------- studio, cameras, render
def studio(scene, look='studio', floor=(.07, .072, .078), power=1.):
    coll = bpy.data.collections.new('Studio'); scene.collection.children.link(coll)
    world = bpy.data.worlds.new('Studio'); scene.world = world; world.use_nodes = True; bg = world.node_tree.nodes['Background']
    def area(name, loc, target, energy, size, size_y=None, col=(1, 1, 1)):
        L = bpy.data.lights.new(name, 'AREA'); L.energy = energy; L.color = col
        if size_y: L.shape = 'RECTANGLE'; L.size = size; L.size_y = size_y
        else: L.size = size
        o = bpy.data.objects.new(name, L); coll.objects.link(o); o.location = loc
        o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
    V = []; F = []; W = 30; nr = 24
    prof = [(-14, 0)] + [(6 + 5 * math.sin(math.pi / 2 * k / nr), 5 - 5 * math.cos(math.pi / 2 * k / nr)) for k in range(nr + 1)] + [(11, 14)]
    for u, h in prof: V += [(-W / 2, u, h), (W / 2, u, h)]
    for i in range(len(prof) - 1): F.append((2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2))
    me = bpy.data.meshes.new('Cyc'); me.from_pydata(V, [], F); me.shade_smooth(); cyc = bpy.data.objects.new('Cyc', me); coll.objects.link(cyc)
    if look == 'night':
        bg.inputs['Color'].default_value = (.004, .005, .007, 1); bg.inputs['Strength'].default_value = 1.
        FLOOR = newmat('FLOOR', (.012, .012, .014), 0., .12)
        area('key_warm', (4.5, 4.5, 3.2), (0, 0, .5), 2600, 3.5, col=(1., .72, .45)); area('rim_cool', (-5, -5, 2.6), (0, 0, .6), 2400, 3, col=(.45, .8, 1.))
        area('fill_blue', (-5, 4, 1.5), (0, 0, .5), 260, 5, col=(.55, .7, 1.)); area('top_strip', (0, 0, 5.5), (0, 0, 0), 900, 7, 1.2, col=(.9, .93, 1.))
    else:
        bg.inputs['Color'].default_value = (.26, .27, .29, 1); bg.inputs['Strength'].default_value = .2
        FLOOR = newmat('FLOOR', floor, 0., .55)
        area('softbox_top', (0, 0, 5.2), (0, 0, 0), 2600 * power, 7., 3.2); area('strip_R', (4.8, 0, 2.4), (0, 0, .7), 1600 * power, 8., .6)
        area('strip_L', (-4.8, 0, 2.4), (0, 0, .7), 1600 * power, 8., .6); area('rim_back', (0, 7, 2.0), (0, 0, .6), 900 * power, 6., 2.)
        area('fill_front', (0, -8, 1.6), (0, 0, .6), 600 * power, 6., 2.)
    cyc.data.materials.append(FLOOR); return coll

def cameras(scene, coll, wb=1.5, track=.9, wr=.37):
    AIM = G(0, .52, 0); s = (wb + 1.0) / 2.36   # scale framing with the car's wheelbase
    CAMS = {'front34': (G(-5.3 * s, 1.25, 6.2 * s), 50, AIM), 'side': (G(9.2 * s, .78, .05), 50, AIM), 'rear34': (G(5.4 * s, 1.5, -6.1 * s), 50, AIM),
            'headon': (G(0, .72, 8.6 * s), 55, G(0, .5, 0)), 'rear': (G(0, .8, -8.6 * s), 55, G(0, .5, 0)), 'top': (G(4.6 * s, 5.4, 3.6 * s), 45, AIM),
            'wheel': (G(-(track + 1.45), .58, wb + 1.25), 50, G(-track, wr, wb))}
    cams = {}
    for kname, (pos, lens, aim) in CAMS.items():
        cd = bpy.data.cameras.new(f'Cam_{kname}'); cd.lens = lens; cd.dof.use_dof = kname == 'wheel'
        if kname == 'wheel': cd.dof.focus_distance = (pos - aim).length; cd.dof.aperture_fstop = 2.2
        o = bpy.data.objects.new(f'Cam_{kname}', cd); coll.objects.link(o); o.location = pos
        o.rotation_euler = (aim - pos).to_track_quat('-Z', 'Y').to_euler(); cams[kname] = o
    scene.camera = cams['front34']; return cams

def setup_render(scene, samples=64, res=(1600, 900), look='studio'):
    scene.render.engine = 'CYCLES'; scene.cycles.samples = samples; scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True; scene.cycles.max_bounces = 10; scene.cycles.transmission_bounces = 10; scene.cycles.glossy_bounces = 6
    scene.render.resolution_x, scene.render.resolution_y = res
    vt = [v.identifier for v in scene.view_settings.bl_rna.properties['view_transform'].enum_items]
    scene.view_settings.view_transform = 'AgX' if 'AgX' in vt else 'Filmic'
    try: scene.view_settings.look = 'AgX - Medium High Contrast' if look == 'studio' else 'AgX - Punchy'
    except TypeError: pass

def render(scene, cams, prefix, views):
    for v in views:
        scene.camera = cams[v]; scene.render.filepath = f'{prefix}_{v}.png'
        bpy.ops.render.render(write_still=True, scene=scene.name); print('rendered', v)
