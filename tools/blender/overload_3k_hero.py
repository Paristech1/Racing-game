"""AFTERHOURS — OVERLOAD 3K hero build: the game body from overload_3k.py plus hero_rig (wheels, shaders, studio, cameras).
    python3 overload_3k_hero.py --blend out.blend [--render prefix] [--views front34,side,rear34,headon,rear,wheel] [--samples 64] [--res 1600x900] [--look studio|night]"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import bpy, hero_rig
def arg(k, d=None): return sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
BLEND = arg('--blend', '/tmp/overload_3k_hero.blend'); RENDER = arg('--render')
VIEWS = arg('--views', 'front34,side,rear34,headon,rear,wheel').split(','); SAMPLES = int(arg('--samples', 64))
RES = tuple(int(v) for v in arg('--res', '1600x900').split('x')); LOOK = arg('--look', 'studio')

bpy.ops.wm.read_factory_settings(use_empty=True)
ns = {'DETAIL': 1}
exec(open(os.path.join(HERE, 'carlib.py')).read(), ns); exec(open(os.path.join(HERE, 'overload_3k.py')).read(), ns)
car = ns['car']; scene = car.scene
hero_rig.shaders(car.M, paint=(.006, .0065, .008), metallic=0., rough=.14, coat=0., coat_rough=.1, flake=False)   # satin black, like the references
hero_rig.wheels(scene, ns['TRACK'], ns['WB'], ns['WR'], rim='turbine', caliper=(.05, .85, 1.), coll=car.CAR)
st = hero_rig.studio(scene, LOOK, floor=(.02, .021, .024), power=.7); cams = hero_rig.cameras(scene, st, ns['WB'], ns['TRACK'], ns['WR'])
hero_rig.setup_render(scene, SAMPLES, RES, LOOK)
for s in list(bpy.data.scenes):
    if s != scene: bpy.data.scenes.remove(s)
bpy.ops.wm.save_as_mainfile(filepath=BLEND); print('saved', BLEND)
if RENDER: hero_rig.render(scene, cams, RENDER, VIEWS)
