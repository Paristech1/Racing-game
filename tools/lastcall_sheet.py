"""Builds docs/lastcall/course-sheet.html (the interactive course sheet) from docs/lastcall/layout.json.
usage: node tools/lastcall_export.cjs && python3 tools/lastcall_sheet.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); DOCS = os.path.join(HERE, '..', 'docs', 'lastcall')
d = json.load(open(os.path.join(DOCS, 'layout.json')))
L = d['L']; P = d['plan']

SECT = {
 'Center City': ('#f0c040', 'Market St east from City Hall, left up 6th St past Independence Mall.', 'Bridge Run, outbound'),
 'Ben Franklin Bridge': ('#ff6a4a', '1.3 km over the Delaware on the 30 m deck, between the blue-lit towers. Flat out.', 'Bridge Run'),
 'Camden': ('#ffa04a', 'Hard left onto the waterfront past the Battleship, then left again into the tunnel portal.', 'new link'),
 'Harbor Line Tunnel': ('#5fe6ff', 'Down 28 m under the river, the sweeping Harbor Line bends, up into the Port Richmond vent tower and the Halo.', 'Event 01'),
 'Port Richmond': ('#8fb4d8', 'Up onto the I-95 viaduct beside the river. The expansion-joint crest throws you before the Cottman off-ramp.', 'new link'),
 'Roosevelt Blvd': ('#b6ff3c', 'The mile, with live traffic. Local lanes swing round the Cottman interchange; the express lanes run straight under it.', 'Event 02'),
 'Hunting Park': ('#ff3fb8', 'The Ring stands at the end of the Boulevard. You see it the whole mile.', 'new'),
 'Mt Airy': ('#c9a2ff', 'Germantown Ave cobbles and trolley rails uphill to 14 m, left down Mt Airy Ave under the street trees.', 'Event 09'),
 'Wissahickon': ('#4fd17a', 'Lincoln Drive S-bends down the gorge, R 43 to 60. Forbidden Drive runs the creek floor below.', 'Event 09'),
 'Kelly Drive': ('#6fa8ff', 'Sweeping river bends past Boathouse Row, outline lights doubled in the Schuylkill.', 'Philly Classic'),
 'Parkway': ('#f2ece0', 'Over Fairmount past the Art Museum, down the Parkway, 15th St past LOVE Park, hard left onto Market.', 'Bridge Run, return'),
}
secs = d['sectors']
# headline numbers away from the loops (a loop's own radius and height are on its card)
_far = [p for i, p in enumerate(P) if all(not (l['s0'] - 150 <= i * 6 <= l['s1'] + 150) for l in d['loops'])]
CLIMB = round(max(p[1] for p in _far) - min(p[1] for p in P)); MINR = round(1 / max(abs(p[3]) for p in _far))

def pts_between(s0, s1):
    out = []
    for i, p in enumerate(P):
        s = i * 6
        if (s0 <= s < s1) if s0 < s1 else (s >= s0 or s < s1): out.append(p)
    return out

paths = []
for i, sc in enumerate(secs):
    s0 = sc['s']; s1 = s0 + sc['len'] + 6
    pts = pts_between(s0, min(s1, L + 6)) if s1 <= L + 6 else pts_between(s0, L + 6)
    if not pts: continue
    dd = 'M' + ' L'.join(f"{p[0]:.0f},{p[2]:.0f}" for p in pts)
    paths.append(f'<path class="sec" data-k="{i}" d="{dd}" stroke="{SECT[sc["name"]][0]}"/>')
br = []
for b in d['branches']:
    dd = 'M' + ' L'.join(f"{p[0]:.0f},{p[2]:.0f}" for p in b['pts'])
    br.append(f'<path class="br" d="{dd}"/>')
loopsvg = []
for lp in d['loops']:
    p = P[lp['s0'] // 6]
    loopsvg.append(f'<g class="loopmk"><circle cx="{p[0]:.0f}" cy="{p[2]:.0f}" r="62"/><text x="{p[0] + 80:.0f}" y="{p[2] - 80:.0f}">{lp["name"]}</text></g>')
lab = []
names = {'FRANKLIN SQUARE': (430, 150), 'SERVICE BORE': (1080, -1150), 'EXPRESS LANES': (120, -2410), 'FORBIDDEN DRIVE': (-1250, -1690)}
for sc in d['branches']:
    x, z = names[sc['name']]
    lab.append(f'<text class="brl" x="{x}" y="{z}">{sc["name"]} −{sc["save"]} m</text>')
# profile
H = [p[1] for p in P]
W_, Hh = 1200, 220; y0, y1 = -35, 72
def px(s): return s / L * W_
def py(y): return Hh - (y - y0) / (y1 - y0) * Hh
prof = 'M' + ' L'.join(f"{px(i*6):.1f},{py(h):.1f}" for i, h in enumerate(H))
bands = []
for i, sc in enumerate(secs):
    bands.append(f'<rect class="band" data-k="{i}" x="{px(sc["s"]):.1f}" y="0" width="{px(sc["len"]):.1f}" height="{Hh}" fill="{SECT[sc["name"]][0]}"/>')
ticks = ''.join(f'<line x1="0" x2="{W_}" y1="{py(v):.1f}" y2="{py(v):.1f}" class="grid"/><text x="-8" y="{py(v)+4:.1f}" class="ax" text-anchor="end">{v}</text>' for v in (-28, 0, 30, 60))
kms = ''.join(f'<text x="{px(k*1000):.1f}" y="{Hh+18}" class="ax" text-anchor="middle">{k}</text>' for k in range(0, 13, 2))
loopl = ''.join(f'<text x="{px(lp["s0"]+130):.1f}" y="{py(lp["h"]+2)-6:.1f}" class="lpl" text-anchor="middle">{lp["name"]} · {lp["h"]:.0f} m</text>' for lp in d['loops'])

rows = []
for i, sc in enumerate(secs):
    c, txt, src = SECT[sc['name']]
    rows.append(f'''<button class="row" data-k="{i}" style="--c:{c}"><span class="sw"></span><span class="rn">{sc["name"]}</span><span class="rk">{sc["s"]/1000:.2f}</span><span class="rl">{sc["len"]:,} m</span><span class="rt">{txt}</span><span class="rs">{src}</span></button>''')

SC_TXT = {
 'FRANKLIN SQUARE': ('Cuts the 6th St corner on a diagonal through the park.', 'Paths and grass, less grip. Round the fountain. Shockwave stash by the fountain.'),
 'SERVICE BORE': ('A maintenance bore 10 m under the road tube, straight through both river bends.', 'Narrow (8 m), unlit, wet. Ghost Lane stash halfway.'),
 'EXPRESS LANES': ('The Boulevard\'s inner lanes, straight down a trench under the Cottman bridge.', 'No traffic and no gems. Two speed cameras flash you.'),
 'FORBIDDEN DRIVE': ('The gravel bridle path on the creek floor, under the Lincoln Drive S-bends.', 'Gravel, less grip. A stone-bridge jump with an Overdrive floating over it.'),
}
scards = []
for sc in d['branches']:
    a, b = SC_TXT[sc['name']]
    scards.append(f'<div class="sc"><div class="sch"><h4>{sc["name"]}</h4><span class="save">−{sc["save"]} m</span></div><p>{a}</p><p class="risk">{b}</p><div class="scm">{sc["L"]} m vs {sc["main"]} m on the main line</div></div>')

slots = ['calm', 'speed', 'guard', 'launch', 'hit', 'grip', 'ghost', 'catchup']
PUC = {'refill': '#5fe6ff', 'long': '#b28cff', 'over': '#ffb020', 'sling': '#ff3b4a', 'shield': '#7dff9a', 'shock': '#ff6fd8', 'grip': '#4f7bff', 'jam': '#f2f04a', 'payback': '#ff5a1f', 'ghost': '#d13bff', 'desperate': '#ff4466'}
PUN = {'refill': 'Refill', 'long': 'Long Boost', 'over': 'Overdrive', 'sling': 'Slingshot', 'shield': 'Shield', 'shock': 'Shockwave', 'grip': 'Grip', 'jam': 'Signal Jam', 'payback': 'Payback', 'ghost': 'Ghost Lane', 'desperate': 'Last-Chance'}
lt = ['<div class="lt"><div></div>' + ''.join(f'<div class="lth">{n}<small>lap {i+1}</small></div>' for i, n in enumerate(d['tables'])) + '</div>']
for s in slots:
    lt.append('<div class="lt"><div class="slot">' + s + '</div>' + ''.join(f'<div class="gem" style="--g:{PUC[t[s]]}"><i></i>{PUN[t[s]]}</div>' for t in d['tables'].values()) + '</div>')
STY = {'gate': 'Gate: three abreast, pick one', 'pair': 'Pair: two abreast', 'bait': 'Bait: off the racing line', 'crown': 'Crown: top of a loop', 'stash': 'Stash: on a shortcut', 'air': 'Airdrop: only reachable in the air', 'single': 'Single'}
drops = ''.join(f'<li><b>{STY[x["style"]].split(":")[0]}</b> · {x["where"]} <small>{x["s"]/1000:.1f} km</small> <span class="dsl">{" / ".join(x["slots"])}</span></li>' for x in d['drops'])

html = open(os.path.join(HERE, 'lastcall_sheet_tpl.html')).read()
html = (html.replace('%PATHS%', ''.join(paths)).replace('%BR%', ''.join(br)).replace('%LOOPS%', ''.join(loopsvg)).replace('%BRL%', ''.join(lab))
        .replace('%PROF%', prof).replace('%BANDS%', ''.join(bands)).replace('%TICKS%', ticks).replace('%KMS%', kms).replace('%LOOPL%', loopl)
        .replace('%ROWS%', ''.join(rows)).replace('%SC%', ''.join(scards)).replace('%LT%', ''.join(lt)).replace('%DROPS%', drops)
        .replace('%L%', f'{L/1000:.2f}').replace('%RACE%', f'{3*L/1000:.1f}').replace('%CLIMB%', str(CLIMB)).replace('%MINR%', str(MINR)).replace('%PW%', str(W_)).replace('%PH%', str(Hh)))
open(os.path.join(DOCS, 'course-sheet.html'), 'w').write(html)
print(len(html))
