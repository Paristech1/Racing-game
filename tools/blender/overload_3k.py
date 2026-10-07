"""AFTERHOURS — OVERLOAD 3K, built in Blender on carlib.py, traced off refs/overload_blueprint*.png (Gemini blueprints made
from the seed-locked Midjourney set, seed 3003: concept A1's body with concept B2's light-blade headlamps).
A gloss-black quad-motor electric hypercar: broad rounded-rectangle plan, raised fender pods with a low hood between them,
slatted headlamps on the outer face of each pod, cyan light blades round the pod intakes and down the bumper corners, a
teardrop glass canopy that runs back into the engine deck, a long side scoop feeding venturi tunnels straight through the
rear haunches, the tunnel exits outlined in cyan as the tail lamps, and a finned diffuser.
Wheels: x +-TRACK, z +-WB, r WR.  Headless (pip bpy) or live (MCP): exec carlib.py, then this file in the same namespace."""
car = Car('Overload 3K', paint=(.004, .0045, .006), accent=(.05, .85, 1.))
DETAIL = globals().get('DETAIL', 1)
Z0, Z1, WB, WR, TRACK = -2.45, 2.55, 1.5, .37, .87

# ---------------------------------------------------------------- body (side, plan and front views of the blueprint)
HW = [[-2.45, .6], [-2.4, .84], [-2.3, .95], [-2.2, 1.0], [-1.5, 1.03], [-.8, .97], [0, .93], [.8, .95], [1.5, 1.02], [2.2, 1.0], [2.3, .95], [2.4, .85], [2.5, .66], [2.55, .44]]
YB = [[-2.45, .3], [-2.3, .18], [-2.0, .12], [2.1, .12], [2.4, .15], [2.55, .24]]
YS = [[-2.45, .7], [-2.3, .8], [-2.0, .86], [-1.5, .88], [-1.0, .83], [-.5, .74], [0, .7], [.6, .72], [1.1, .78], [1.5, .82], [1.9, .74], [2.2, .64], [2.4, .55], [2.55, .43]]   # pod / haunch crown
YT = [[-2.45, .74], [-2.3, .82], [-2.0, .86], [-1.5, .89], [-1.0, .9], [0, .86], [1.0, .86], [1.5, .87], [1.9, .8], [2.2, .7], [2.4, .6], [2.55, .46]]   # centre line
def hood_valley(x, z):   # the bonnet sits low between the pods; the engine deck keeps a soft centre spine
    front = .15 * smooth(1.05, 1.4, z) * (1 - smooth(2.42, 2.56, z)) * math.exp(-(x / .5) ** 4)
    rear = -.025 * smooth(-1.2, -1.5, z) * math.exp(-(x / .16) ** 2)
    return -front - rear
car.build_body({'Z0': Z0, 'Z1': Z1, 'HW': HW, 'YB': YB, 'YS': YS, 'YT': YT, 'sill': .07, 'Rx': .2, 'tumble': .05, 'NS': 360 if DETAIL else 220,
    'round_nose': .1, 'round_tail': .08, 'bulge_at': .86, 'dome': hood_valley, 'res': 2 if DETAIL else 1,
    # the side scoop: a deep concave channel from behind the front wheel, rising as it runs back into the tunnel mouth
    'swage': (lambda z: lerp(.46, .6, smooth(1.0, -.6, z)), lambda z: smooth(1.15, .85, z) * smooth(-.85, -.45, z), .16, .11),
    'lean': lambda y, z: -.06 * smooth(2.3, 2.55, z) * (car.h_of(y, z) - .5) + .03 * smooth(-2.25, -2.45, z) * (car.h_of(y, z) - .5)})
SKIN0 = bpy.data.objects.new('Skin0', car.body.data.copy()); car.scene.collection.objects.link(SKIN0)

ARCH_R = .43
for sd in (1, -1):
    for zw in (WB, -WB): car.cyl_x(f'arch{sd}{zw}', WR, zw, ARCH_R, sd * (TRACK - .25), sd * 1.5)
    # side scoop: a long shallow channel from behind the front wheel back into the tunnel mouth
    pass
    # pod intakes: the dark V at the inner face of each fender pod, outlined in cyan later
    car.front_prism(f'podin{sd}', [(sd * .66, .76), (sd * .48, .72), (sd * .43, .68), (sd * .6, .5), (sd * .69, .52)], 1.9, 2.9, 'GLOSSBLACK')
    # slatted headlamp recess on the outer face of the pod
    car.front_prism(f'lamp{sd}', [(sd * .7, .74), (sd * .9, .7), (sd * .93, .55), (sd * .74, .57)], 2.3, 2.9, 'GLOSSBLACK')
    # bumper-corner ducts with the vertical cyan blades
    car.front_prism(f'corner{sd}', [(sd * .8, .32), (sd * .95, .34), (sd * .93, .13), (sd * .84, .13)], 2.1, 2.9, 'GLOSSBLACK')

# lower intake band across the nose
car.front_prism('mouth', [(-.22, .3), (.22, .3), (.28, .13), (-.28, .13)], 2.05, 2.9, 'GLOSSBLACK')
for sd in (1, -1): car.front_prism(f'lowin{sd}', [(sd * .32, .3), (sd * .72, .33), (sd * .76, .13), (sd * .38, .13)], 2.05, 2.9, 'GLOSSBLACK')

# venturi tunnels: rounded-rectangle sections swept from the side scoop to the tail, through each rear haunch
def tunnel_sec(z):
    t = clamp((-.45 - z) / 2.05, 0, 1); s = t * t * (3 - 2 * t)
    cx = lerp(1.0, .53, s); cy = lerp(.6, .55, s); w = lerp(.34, .66, s); h = lerp(.36, .4, s)
    return cx, cy, w, h
def chaikin(pts, it=3):
    for _ in range(it):
        out = []
        for i in range(len(pts)):
            a = pts[i]; b = pts[(i + 1) % len(pts)]
            out += [(.75 * a[0] + .25 * b[0], .75 * a[1] + .25 * b[1]), (.25 * a[0] + .75 * b[0], .25 * a[1] + .75 * b[1])]
        pts = out
    return pts
def tunnel_shape(cx, cy, w, h, sd=1):   # trapezoid exit: the outer top corner kicks up, the inner bottom tucks in
    q = [(-w / 2 + .03, h / 2 - .03), (w / 2, h / 2 + .05), (w / 2 - .03, -h / 2), (-w / 2 + .12, -h / 2 + .05)]
    return [(sd * (cx + x), cy + y) for x, y in chaikin(q, 3)]
TUN = {}
for sd in (1, -1):
    st = []
    for i in range(44):
        z = lerp(-.3, -2.75, i / 43); cx, cy, w, h = tunnel_sec(z)
        ring = tunnel_shape(cx, cy, w, h, sd)
        st.append([G(x, y, z) for x, y in ring])
    ob = car.loft(f'tunnel{sd}', st, 'GLOSSBLACK', smooth_=False); car.cutter(ob, 'GLOSSBLACK'); TUN[sd] = st
# open rear: black recess between the tunnels, under the deck
car.front_prism('rearpanel', Car.rounded(0, .3, 1.7, .24, .05), -3.0, -2.33, 'GLOSSBLACK')
car.front_prism('rearslot', Car.rounded(0, .61, .44, .07, .03), -3.0, -2.36, 'GLOSSBLACK')
car.apply_cuts()

def skin_normals():
    """Copy each paint loop's normal from the uncut skin so the boolean slivers don't fold the gloss paint."""
    me = car.body.data; vg = car.body.vertex_groups.get('skin') or car.body.vertex_groups.new(name='skin'); keep = set()
    for p_ in me.polygons:
        if me.materials[p_.material_index].name.split('.')[0] == 'PAINT': keep.update(p_.vertices)
    vg.add(list(keep), 1., 'REPLACE')
    mod = car.body.modifiers.new('skinN', 'DATA_TRANSFER'); mod.object = SKIN0; mod.use_loop_data = True
    mod.data_types_loops = {'CUSTOM_NORMAL'}; mod.loop_mapping = 'POLYINTERP_NEAREST'; mod.vertex_group = 'skin'
    nm = bpy.data.meshes.new_from_object(car.body.evaluated_get(car.DG())); car.body.modifiers.clear(); om = car.body.data; car.body.data = nm; bpy.data.meshes.remove(om)
    car.body.vertex_groups.clear()
car.recolor('CARBON', lambda gx, gy, gz, n: gy < kf(YB, gz) + .07 and -1.1 < gz < 1.1)
car.recolor('GLOSSBLACK', lambda gx, gy, gz, n: gz < -2.3 and gy < .42)
car.sharpen(car.body, 30); skin_normals(); car.bvh = car.BV()
bpy.data.objects.remove(SKIN0)
car.arch_liners(WB, WR, ARCH_R, TRACK - .25, 1.08)

# ---------------------------------------------------------------- canopy: teardrop glass running into the engine deck
CH = [[-1.45, .97], [-1.1, 1.04], [-.7, 1.11], [-.3, 1.17], [.1, 1.2], [.45, 1.17], [.75, 1.09], [1.0, .99], [1.2, .91], [1.36, .86]]
car.build_cabin({'CZ0': -1.45, 'CZ1': 1.36, 'CH': CH, 'dlo': (1.28, .9, -.62, -.32), 'rear_glass': .5, 'dlo_trim': 'GLOSSBLACK',
    'pillars': [], 'apillar_r': .012, 'NC': 220 if DETAIL else 120,
    'cw': lambda z: kf([[-1.45, .16], [-1.1, .36], [-.6, .58], [0, .68], [.6, .7], [1.0, .66], [1.25, .54], [1.36, .44]], z),
    'rw': lambda z: kf([[-1.45, .06], [-1.1, .18], [-.6, .32], [0, .4], [.6, .38], [1.0, .3], [1.25, .2], [1.36, .14]], z)})

# ---------------------------------------------------------------- lights and accents
def front_pts(path):   # (x, y) list -> points on the nose surface
    out = []
    for x, y in path:
        z = car.surf_front(x, y)
        if z and z > 1.85: out.append((x, y, z - .004))   # rays that pass through an intake land far back; drop them
    return out
for sd in (1, -1):
    # slatted headlamps: three white bars in the pod recess
    for k in range(3):
        y = .59 + k * .05; x0, x1 = sd * (.75 + .01 * k), sd * (.89 - .01 * k)
        z = car.surf_front(sd * .82, y); z = (z if z and z > 1.85 else 2.2) + .012
        car.box(f'slat{sd}{k}', (abs(x1 - x0), .03, .03), ((x0 + x1) / 2, y, z), 'HEAD', rot=(0, 0, -sd * .25))
    # cyan blades round the pod intake and down into the bumper corner
    blade = front_pts([(sd * .67, .775), (sd * .47, .735), (sd * .41, .68), (sd * .6, .485), (sd * .72, .5)])
    if len(blade) > 2: car.tube(f'podblade{sd}', blade, .009, 'ACCENT')
    corner = front_pts([(sd * .86, .34), (sd * .89, .24), (sd * .9, .13)])
    if len(corner) > 2: car.tube(f'cornerblade{sd}', corner, .01, 'ACCENT')
    # tunnel exits: cyan outline round each rear opening = the tail lamps
    cx, cy, w, h = tunnel_sec(-2.45); ring = tunnel_shape(cx, cy, w + .035, h + .035, sd)
    pts = []
    for x, y in ring + ring[:1]:
        z = car.surf_back(x, y)
        pts.append((x, y, (z if z is not None and z < -2.2 else -2.43) + .006))   # rays through the tunnel itself land far forward
    if len(pts) > 6: car.tube(f'tail{sd}', pts, .012, 'ACCENT')
# cyan nose line along the top of the mouth
nose = front_pts([(x, .325 + .03 * abs(x)) for x in [lerp(-.72, .72, k / 14) for k in range(15)]])
if len(nose) > 4: car.tube('noseline', nose, .006, 'ACCENT')
# centre brake light in the rear slot, diffuser fins, splitter
zt = car.surf_back(0, .61) or -2.4
car.box('brake', (.36, .025, .01), (0, .61, zt - .06), 'TAIL')
for k in range(7):
    x = -.6 + k * .2; car.extrude_x(f'fin{k}', [(-1.95, .12), (-2.36, .12), (-2.36, .32), (-2.2, .3)], x - .008, x + .008, 'CARBON')
lip = [(-1.0, 2.1)] + [(math.sin(a) * .98, 2.42 + math.cos(a) * .14) for a in [(-math.pi / 2) + math.pi * k / 24 for k in range(25)]] + [(1.0, 2.1)]
car.extrude_y('Splitter', lip, .085, .11, 'CARBON')
# carbon spine down the engine deck, camera pods in place of mirrors
spine = []
for k in range(14):
    z = lerp(-1.3, -2.38, k / 13); y = car.surf_y(0, z)
    if y: spine.append((0, y + .01, z))
if len(spine) > 3: car.tube('spine', spine, .022, 'CARBON')
for sd in (1, -1):
    mz = .82; my = car.belt(mz) + .015; mx = car.C['cw'](mz)
    car.tube(f'camstalk{sd}', [(sd * (mx - .02), my - .01, mz), (sd * (mx + .07), my + .02, mz - .02)], .01, 'CARBON', res=4)
    car.box(f'campod{sd}', (.09, .035, .06), (sd * (mx + .11), my + .03, mz - .03), 'CARBON')
car.extrude_y('Floor', [(-.88, -2.1), (.88, -2.1), (.88, 2.2), (-.88, 2.2)], .1, .13, 'GLOSSBLACK')
objs = car.objs(); result = car.stats(); print(result)
