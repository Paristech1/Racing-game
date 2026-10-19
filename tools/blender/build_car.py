"""Headless build of a carlib car script (pip bpy): exec carlib.py + <car>.py, write the raw GLB, optional Cycles shots.
  python3 build_car.py hikari_91 ../../models/hikari_91.glb [--shots DIR] [--blend FILE]
The shots use preview_rig.py (studio floor, stand-in wheels, area lights); compare them against the reference frames."""
import sys, os, json, math, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import bpy
from mathutils import Vector
args = sys.argv[1:]; name, out = args[0], args[1]
shots = args[args.index('--shots') + 1] if '--shots' in args else None
blend = args[args.index('--blend') + 1] if '--blend' in args else None
ns = {'HERE': HERE}
exec(open(os.path.join(HERE, 'carlib.py')).read(), ns)
exec(open(os.path.join(HERE, name + '.py')).read(), ns)
import dump_mesh
d = {'mats': dump_mesh.dump(ns['objs']), 'info': json.dumps(ns['result'])}
tmp = os.path.join('/tmp', name + '_dump.json'); json.dump(d, open(tmp, 'w'))
subprocess.run([sys.executable, os.path.join(HERE, 'pack_glb.py'), tmp, out], check=True)
if blend: bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(blend))
if shots:
    os.makedirs(shots, exist_ok=True); car = ns['car']
    pv = {'SCENE': car.scene.name, 'WHEELS': ns.get('PV_WHEELS', ((ns.get('TRACK', .89), ns['WB']), (ns.get('TRACK', .89), -ns['WB']))), 'WR': ns['WR']}
    exec(open(os.path.join(HERE, 'preview_rig.py')).read(), pv)
    for o in car.CAR.objects:
        if o.name.startswith('Vinyl'): o.hide_render = True
    sc = pv['rig'](); sc.render.engine = 'CYCLES'; sc.cycles.samples = int(os.environ.get('SAMPLES', 24)); sc.cycles.device = 'CPU'
    sc.render.resolution_x = 1100; sc.render.resolution_y = 620
    try: sc.cycles.use_denoising = True
    except Exception: pass
    G = pv['G']; L = Vector((0, 0, .55))
    views = [('front34', G(3.6, 1.15, 4.2), G(0, .55, .3), 45), ('side', G(7.5, .7, 0), G(0, .6, 0), 50), ('rear34', G(-3.5, 1.3, -4.2), G(0, .6, -.3), 45),
             ('headon', G(0, .8, 7.5), G(0, .55, 0), 55), ('top', G(0, 9, 0.01), G(0, 0, 0), 40)]
    want = os.environ.get('VIEWS'); views = [v for v in views if not want or v[0] in want.split(',')]
    import base64
    for tag, b64 in pv['shots'](views).items(): open(os.path.join(shots, tag + '.png'), 'wb').write(base64.b64decode(b64))
print('done', ns['result'])
