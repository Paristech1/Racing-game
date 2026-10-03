"""Blueprint overlay check for the Volcano P1.

Builds the body from volcano_p1.py, renders orthographic side / front / top views with the
Workbench engine, and draws the traced blueprint (refs/p1_blueprint.png) over each one in
magenta, warped onto the game axles the same way the design curves were mapped.

    python3 p1_overlay.py --out /tmp/p1_overlay   ->  /tmp/p1_overlay_{side,front,top}.png
"""
import os, sys, runpy, math
import bpy
from mathutils import Vector
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else '/tmp/p1_overlay'
argv = sys.argv; sys.argv = [argv[0], '--out', '/tmp/_p1_overlay.glb']
ns = runpy.run_path(os.path.join(HERE, 'volcano_p1.py')); sys.argv = argv
G = ns['G']; scene = bpy.context.scene
PPM = 250   # pixels per metre in every view

scene.render.engine = 'BLENDER_WORKBENCH'
sh = scene.display.shading; sh.light = 'STUDIO'; sh.color_type = 'MATERIAL'; sh.show_cavity = True
scene.world = bpy.data.worlds.new('W'); scene.world.color = (1, 1, 1)
scene.view_settings.view_transform = 'Standard'
cd = bpy.data.cameras.new('O'); cd.type = 'ORTHO'; cam = bpy.data.objects.new('O', cd); scene.collection.objects.link(cam); scene.camera = cam

def shoot(tag, pos, aim, up, w_m, h_m):
    scene.render.resolution_x = int(w_m * PPM); scene.render.resolution_y = int(h_m * PPM)
    cd.ortho_scale = max(w_m, h_m); cam.location = pos
    fwd = (aim - pos).normalized(); up = up.normalized(); right = fwd.cross(up).normalized(); up = right.cross(fwd)
    from mathutils import Matrix
    M = Matrix((right, up, -fwd)).transposed(); cam.rotation_euler = M.to_euler()
    scene.render.filepath = f'{OUT}_{tag}_raw.png'; bpy.ops.render.render(write_still=True)
    return Image.open(scene.render.filepath).convert('RGB')

# ---- blueprint -> game mapping (same as the design-curve trace)
BP = np.asarray(Image.open(os.path.join(HERE, 'refs', 'p1_blueprint.png')).convert('RGB')).astype(int)
lines = (BP[:, :, 0] > 120) & (BP[:, :, 1] > 140)
s = 2.72 / 274
def bz_of(z):
    if z >= 1.36: return 2.5 - (2.26 - z) / .72
    if z >= -1.36: return 1.25 - (1.36 - z) / 1.0187
    return -1.42 - (-1.36 - z) / .932
def sample(px, py):
    px = int(round(px)); py = int(round(py))
    return 0 <= py < lines.shape[0] and 0 <= px < lines.shape[1] and lines[py, px]

def overlay(img, fn, tag):
    a = np.asarray(img).copy(); H, W = a.shape[:2]
    for v in range(H):
        for u in range(W):
            if fn(u, v): a[v, u] = (255, 0, 200)
    Image.fromarray(a.astype('uint8')).save(f'{OUT}_{tag}.png'); print('wrote', f'{OUT}_{tag}.png')

# side: nose to the left, z -2.6..2.6, y -.1..1.5
Ws, Hs = 5.2, 1.6
img = shoot('side', G(12, .7, 0), G(0, .7, 0), Vector((0, 0, 1)), Ws, Hs)
overlay(img, lambda u, v: sample(183 + (1.36 - bz_of(2.6 - u / PPM)) / s, 195 - (.7 + Hs / 2 - v / PPM) / s), 'side')
# front: x -1.3..1.3, y -.1..1.5
Wf, Hf = 2.6, 1.6
img = shoot('front', G(0, .7, 12), G(0, .7, 0), Vector((0, 0, 1)), Wf, Hf)
overlay(img, lambda u, v: sample(840 + (u / PPM - Wf / 2) / .00973, 192 - (.7 + Hf / 2 - v / PPM) / .00973), 'front')
# top: nose to the left, z -2.6..2.6, x -1.3..1.3
Wt, Ht = 5.2, 2.6
img = shoot('top', G(0, 12, 0), G(0, 0, 0), Vector((-1, 0, 0)), Wt, Ht)
overlay(img, lambda u, v: sample(183 + (1.36 - bz_of(2.6 - u / PPM)) / s, 428 - (Ht / 2 - v / PPM) / s), 'top')
