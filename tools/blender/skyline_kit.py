"""AFTERHOURS — Skyline kit, built in Blender (bpy) on kitlib.py: three original Center City-style towers for the skyline
west of City Hall, drawn from night photos of the skyline (lit crowns in colour, glass shafts with fins, stepped tops).
  Tower_Spire  — glass shaft with setbacks, a faceted glowing crown outlined in LED and a steel spire
  Tower_Glass  — a chamfered glass slab whose top 30 m is an open lantern banded with LED rings
  Tower_Step   — a stone ziggurat, every step edged in LED
LED is tinted per instance in the game. Exec kitlib.py first, then this, in one namespace."""
import random
new_scene('Skyline Kit'); R = random.Random(63)
def fins(acc, w, d, y0, y1, step=3., depth=.35):
    for fc in range(4):
        L = w if fc < 2 else d; n = int(L // step)
        for i in range(1, n):
            u = -L / 2 + i * L / n
            if fc == 0: acc.box('MULLION', u, (y0 + y1) / 2, d / 2 + depth / 2, .22, y1 - y0, depth)
            elif fc == 1: acc.box('MULLION', u, (y0 + y1) / 2, -d / 2 - depth / 2, .22, y1 - y0, depth)
            elif fc == 2: acc.box('MULLION', w / 2 + depth / 2, (y0 + y1) / 2, u, depth, y1 - y0, .22)
            else: acc.box('MULLION', -w / 2 - depth / 2, (y0 + y1) / 2, u, depth, y1 - y0, .22)
def lit(acc, w, d, y0, y1, p=.16, fh=4., bw=3.):  # scattered lit panes on the four faces
    for fc in range(4):
        L = w if fc < 2 else d; nb = int(L // bw)
        for fl in range(int((y1 - y0) // fh)):
            for b in range(nb):
                if R.random() > p: continue
                u = -L / 2 + (b + .5) * L / nb; y = y0 + (fl + .5) * fh; pw, ph = L / nb * .8, fh * .62
                if fc == 0: acc.box('WIN', u, y, d / 2 + .03, pw, ph, .04)
                elif fc == 1: acc.box('WIN', u, y, -d / 2 - .03, pw, ph, .04)
                elif fc == 2: acc.box('WIN', w / 2 + .03, y, u, .04, ph, pw)
                else: acc.box('WIN', -w / 2 - .03, y, u, .04, ph, pw)
def ring_led(acc, w, d, y, r=.22, inset=0.):
    hw, hd = w / 2 + inset, d / 2 + inset
    acc.tube('LED', [(-hw, y, -hd), (hw, y, -hd), (hw, y, hd), (-hw, y, hd), (-hw, y, -hd)], r, n=4)
objs = []
# ---------------------------------------------------------------------------------------------- Tower_Spire
A = Acc('Tower_Spire')
for (w, y0, y1) in ((36, 0, 150), (30, 150, 180), (24, 180, 200)):
    A.bx('GLASSWALL', -w / 2, w / 2, y0, y1, -w / 2, w / 2); fins(A, w, w, y0, y1); lit(A, w, w, y0 + 6, y1 - 2)
    A.bx('MULLION', -w / 2 - .6, w / 2 + .6, y1 - .8, y1, -w / 2 - .6, w / 2 + .6); ring_led(A, w, w, y1 + .1, inset=.6)
# faceted crown: two stacked square pyramids turned 45 degrees, glowing, every edge in LED
for (r0, r1, y0, y1) in ((16.5, 10.5, 200, 214), (10.5, 3.2, 214, 228)):
    A.lathe('CROWN', 0, 0, [(r0, y0), (r1, y1)], n=4, smooth=False, rot=math.pi / 4)
    for k in range(4):
        a = TAU * k / 4 + math.pi / 4; A.tube('LED', [(r0 * math.cos(a) * .707 * 1.414, y0, r0 * math.sin(a) * .707 * 1.414), (r1 * math.cos(a), y1, r1 * math.sin(a))], .25, n=4)
A.cyl('STEEL', 0, 228, 0, 1.2, 262, .12, seg=8); A.box('LED', 0, 262.5, 0, .8, .8, .8)
objs += A.build()
# ---------------------------------------------------------------------------------------------- Tower_Glass
B = Acc('Tower_Glass'); W, D = 40, 28
B.bx('GLASSWALL', -W / 2, W / 2, 0, 250, -D / 2, D / 2)
for sx in (-1, 1):
    for sz in (-1, 1): B.box('GLASSWALL', sx * W / 2, 125, sz * D / 2, 5, 250, 5, math.pi / 4)   # chamfered corners
fins(B, W, D, 0, 250, 4.); lit(B, W, D, 8, 248, .14)
for y in range(252, 282, 4): ring_led(B, W - 2, D - 2, y, .2)                                           # lantern rings
B.bx('GLASSWALL', -W / 2 + 1.5, W / 2 - 1.5, 250, 280, -D / 2 + 1.5, D / 2 - 1.5)
for sx in (-1, 1):
    for sz in (-1, 1): B.tube('LED', [(sx * (W / 2 - 1), 250, sz * (D / 2 - 1)), (sx * (W / 2 - 1), 284, sz * (D / 2 - 1))], .3, n=4)
B.bx('MULLION', -W / 2 + 4, W / 2 - 4, 280, 284, -D / 2 + 4, D / 2 - 4)
objs += B.build()
# ---------------------------------------------------------------------------------------------- Tower_Step
C = Acc('Tower_Step')
for (w, y0, y1) in ((44, 0, 120), (38, 120, 145), (30, 145, 165), (22, 165, 180), (14, 180, 190)):
    C.bx('STONE', -w / 2, w / 2, y0, y1, -w / 2, w / 2); lit(C, w, w, y0 + 4, y1 - 1, .22, 3.6, 2.6)
    for fc in range(4):   # stone piers between the window bays
        n = int(w // 5)
        for i in range(1, n):
            u = -w / 2 + i * w / n
            if fc == 0: C.box('STONE', u, (y0 + y1) / 2, w / 2 + .25, .9, y1 - y0, .5)
            elif fc == 1: C.box('STONE', u, (y0 + y1) / 2, -w / 2 - .25, .9, y1 - y0, .5)
            elif fc == 2: C.box('STONE', w / 2 + .25, (y0 + y1) / 2, u, .5, y1 - y0, .9)
            else: C.box('STONE', -w / 2 - .25, (y0 + y1) / 2, u, .5, y1 - y0, .9)
    ring_led(C, w, w, y1 + .15, .24, .5); C.bx('STONE', -w / 2 - .5, w / 2 + .5, y1 - .6, y1, -w / 2 - .5, w / 2 + .5)
C.cyl('STEEL', 0, 190, 0, .5, 214, .1, seg=8); C.box('LED', 0, 214.3, 0, .6, .6, .6)
objs += C.build()
tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)
result = {'objects': len(objs), 'tris': tris}; print(result)
