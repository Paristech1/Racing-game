"""Studio preview rig for the AFTERHOURS car builds (not exported): floor, stand-in wheels, area lights, camera.
Live (MCP), after building a car scene:  exec this file, then  shots([(tag, cam_pos, look_at, lens), ...]) -> {tag: base64 png}.
Positions are game coords (x right, y up, z forward); G() maps them to Blender."""
import bpy, bmesh, math, os, base64, tempfile
from mathutils import Vector

def G(x, y, z): return Vector((x, -z, y))
SCENE = globals().get('SCENE', 'Autobahn 63')
WHEELS = globals().get('WHEELS', ((.9, 1.5), (.9, -1.5)))   # (track half-width, axle z)
WR = globals().get('WR', .37)

def _mat(name, col, metal=0., rough=.5):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    return m

def rig():
    sc = bpy.data.scenes[SCENE]
    pv = next((c for c in sc.collection.children if c.name.startswith('Preview')), None)
    if pv:
        for o in list(pv.objects): bpy.data.objects.remove(o)
    else:
        pv = bpy.data.collections.new('Preview'); sc.collection.children.link(pv)
    fm = _mat('pv_floor', (.05, .05, .055), 0, .3); tm = _mat('pv_tyre', (.018, .018, .02), 0, .75)
    rm = _mat('pv_rim', (.55, .56, .6), 1, .12); cm = _mat('pv_cal', (1, .7, .05), .2, .4)
    def add(name, me, m, loc=None, rot=None, scale=None):
        me.materials.append(m); o = bpy.data.objects.new(name, me); pv.objects.link(o)
        if loc is not None: o.location = loc
        if rot is not None: o.rotation_euler = rot
        if scale is not None: o.scale = scale
        return o
    gm = bpy.data.meshes.new('pvfloor'); gm.from_pydata([(-40, -40, 0), (40, -40, 0), (40, 40, 0), (-40, 40, 0)], [], [(0, 1, 2, 3)]); add('pvfloor', gm, fm)
    def cyl(r, d, seg=64):
        bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=d)
        me = bpy.data.meshes.new('c'); bm.to_mesh(me); bm.free(); me.shade_smooth(); return me
    for tx, zw in WHEELS:
        for sx in (1, -1):
            c = G(sx * tx, WR, zw)
            add('tyre', cyl(WR, .25), tm, c, (0, math.pi / 2, 0))
            add('rimface', cyl(WR * .8, .02), tm, c + Vector((sx * .1, 0, 0)), (0, math.pi / 2, 0))
            for k in range(10):
                a = 2 * math.pi * k / 10
                bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1); me = bpy.data.meshes.new('sp'); bm.to_mesh(me); bm.free()
                add('spoke', me, rm, G(sx * (tx + .115), WR + .15 * math.cos(a), zw + .15 * math.sin(a)), (a, 0, 0), (.03, .028, .27))
            add('cal', cyl(.02, .02, 8), cm, G(sx * (tx + .07), WR + .17, zw - .1), None, (4, 2, 16))
    def light(name, loc, energy, size, col=(1, 1, 1)):
        L = bpy.data.lights.new(name, 'AREA'); L.energy = energy; L.size = size; L.color = col
        o = bpy.data.objects.new(name, L); pv.objects.link(o); o.location = loc
        o.rotation_euler = (Vector((0, 0, .5)) - o.location).to_track_quat('-Z', 'Y').to_euler()
    light('key', (5, 3, 6), 2600, 6); light('rim', (-5, -5, 3), 1800, 5, (.7, .8, 1)); light('strip', (0, 0, 7), 1200, 10)
    light('fill', (-4, 6, 2), 600, 6); light('front', (0, -7, 1.5), 600, 4)
    w = bpy.data.worlds.get('pvW') or bpy.data.worlds.new('pvW'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (.03, .034, .04, 1); bg.inputs['Strength'].default_value = 1
    cam = bpy.data.cameras.new('C'); cam.lens = 50; co = bpy.data.objects.new('C', cam); pv.objects.link(co); sc.camera = co
    sc.render.engine = 'BLENDER_EEVEE'; sc.render.resolution_x = 900; sc.render.resolution_y = 500; sc.render.resolution_percentage = 100
    return sc

def shots(views):
    sc = bpy.data.scenes[SCENE]; co = sc.camera; win = bpy.context.window_manager.windows[0]; out = {}
    for tag, pos, look, lens in views:
        co.data.lens = lens; co.location = pos; co.rotation_euler = (look - pos).to_track_quat('-Z', 'Y').to_euler()
        p = os.path.join(tempfile.gettempdir(), f'pv_{tag}.png')
        with bpy.context.temp_override(window=win, scene=sc): bpy.ops.render.render()
        bpy.data.images['Render Result'].save_render(p, scene=sc)
        out[tag] = base64.b64encode(open(p, 'rb').read()).decode()
    return out
