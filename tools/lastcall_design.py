"""AFTERHOURS — Event 16 "Last Call" course design tool.

Lays out the combined lap (Bridge Run + Harbor Line tunnel + Roosevelt Blvd + Mt Airy) from the same corner lists the
game uses (filletPath: straights joined by quadratic fillets, [x, z, fillet] in game metres, x east, -z north), lifts it
with height keys, inserts the two vertical loops, and checks it the way tools/track_report.mjs does (curvature, corners,
straights, self-clearance) plus the shortcut branches. Writes docs/lastcall/plan.png, profile.png and layout.json.

usage: python3 tools/lastcall_design.py
"""
import json, math, os, sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'docs', 'lastcall')
os.makedirs(OUT, exist_ok=True)
sys.path.insert(0, os.path.dirname(__file__))
from lastcall_layout import START, CORNERS, KEYS, LOOPS, SHORTCUTS, SECTORS, ROAD_W, BRIDGE  # noqa: E402

# ---------------------------------------------------------------- geometry (mirrors filletPath / resample3 in afterhours.js)
def fillet_path(start, corners, step=1.0, closed=True):
    out = []; cur = np.array(start, float)
    def seg(a, b):
        d = np.linalg.norm(b - a)
        if d < 1e-6: return
        n = int(math.ceil(d / step))
        for i in range(n): out.append(a + (b - a) * i / n)
    def bez(a, c, b):
        n = max(4, int(math.ceil((np.linalg.norm(c - a) + np.linalg.norm(b - c)) / step)))
        for i in range(n):
            t = i / n; u = 1 - t; out.append(u * u * a + 2 * u * t * c + t * t * b)
    C = [(np.array(c[:2], float), c[2]) for c in corners]
    for i, (c, r) in enumerate(C):
        prev = C[i - 1][0] if i else np.array(start, float)
        nxt = C[i + 1][0] if i < len(C) - 1 else np.array(start, float)
        t1 = c + (prev - c) / np.linalg.norm(prev - c) * r
        t2 = c + (nxt - c) / np.linalg.norm(nxt - c) * r
        seg(cur, t1); bez(t1, c, t2); cur = t2
    if closed: seg(cur, np.array(start, float))
    else: out.append(cur)
    return np.array(out)

def resample(P, closed=True, step=1.0):
    Q = np.vstack([P, P[:1]]) if closed else P
    d = np.linalg.norm(np.diff(Q, axis=0), axis=1); cum = np.concatenate([[0], np.cumsum(d)]); L = cum[-1]
    N = int(round(L / step)); s = np.arange(N) * L / N if closed else np.linspace(0, L, N + 1)
    out = np.empty((len(s), P.shape[1]))
    for k in range(P.shape[1]): out[:, k] = np.interp(s, cum, Q[:, k])
    return out, L

def heights(p2, keys, smooth=20):
    """linear between the keys (matched to their nearest path point), then a box smooth: the Mt Airy / Calder recipe"""
    n = len(p2); idx = []
    for (x, z, y, *rest) in keys:
        i = int(np.argmin((p2[:, 0] - x) ** 2 + (p2[:, 1] - z) ** 2)); idx.append((i, y, rest[0] if rest else smooth))
    idx.sort()
    raw = np.zeros(n)
    for i in range(n):
        j = next((k for k, v in enumerate(idx) if v[0] > i), -1)
        a = idx[-1] if j <= 0 else idx[j - 1]; b = idx[0] if j < 0 else idx[j]
        span = b[0] - a[0]; span += n if span <= 0 else 0
        u = i - a[0]; u += n if u < 0 else 0
        raw[i] = a[1] + (b[1] - a[1]) * u / span
    # per-key smoothing width, eased from one key's width to the next so the window never jumps (a jump in the window
    # is a step in the road); then a short box pass to round off what is left
    win = np.zeros(n)
    for i in range(n):
        j = next((k for k, v in enumerate(idx) if v[0] > i), -1)
        a = idx[-1] if j <= 0 else idx[j - 1]; b = idx[0] if j < 0 else idx[j]
        span = b[0] - a[0]; span += n if span <= 0 else 0
        u = i - a[0]; u += n if u < 0 else 0
        win[i] = a[2] + (b[2] - a[2]) * u / span
    cs = np.concatenate([[0], np.cumsum(np.r_[raw, raw, raw])])
    y = np.empty(n)
    for i in range(n):
        w = int(round(win[i])); a0 = n + i - w; b0 = n + i + w + 1; y[i] = (cs[b0] - cs[a0]) / (b0 - a0)
    for _ in range(3):
        y = (np.roll(y, 2) + np.roll(y, 1) + y + np.roll(y, -1) + np.roll(y, -2)) / 5
    return y

def loop_points(p0, t0, u0, spec):
    """one vertical loop, clothoid-style: pitch rate k(s) = 2pi/Ll * (1 - cos(2pi s/Ll)) so it eases in, is tightest at
    the crown and eases out; the road drifts sideways by spec['drift'] over the loop so the exit clears the entry."""
    Ll = spec['len']; n = int(Ll); side = spec['side']
    r0 = np.cross(t0, u0)
    pts = []; phi = 0.0; pos = np.array(p0, float); ds = Ll / n
    for i in range(n):
        s = i * ds
        k = 2 * math.pi / Ll * (1 - math.cos(2 * math.pi * s / Ll))
        phi += k * ds
        t = math.cos(phi) * t0 + math.sin(phi) * u0
        lat = side * spec['drift'] * (0.5 - 0.5 * math.cos(math.pi * (s + ds) / Ll))
        lat0 = side * spec['drift'] * (0.5 - 0.5 * math.cos(math.pi * s / Ll))
        pos = pos + t * ds + r0 * (lat - lat0)
        pts.append(pos.copy())
    return np.array(pts)

def build():
    p2 = fillet_path(START, CORNERS)
    p2, L2 = resample(p2)
    y = heights(p2, KEYS)
    P = np.c_[p2[:, 0], y, p2[:, 1]]          # game space x, y, z
    # loops: the plan path jogs sideways around each loop station (in by -drift/2, out at +drift/2, eased over JOG m),
    # then the 3D loop is spliced in at the station, drifting across by `drift` so it lands on the exit road
    out = []; i = 0; n = len(P); JOG = 140
    stations = []
    for spec in LOOPS:
        k = int(np.argmin((P[:, 0] - spec['at'][0]) ** 2 + (P[:, 2] - spec['at'][1]) ** 2)); stations.append((k, spec))
    stations.sort(key=lambda t: t[0])
    sm = lambda u: u * u * (3 - 2 * u)
    plan = []
    for k, spec in stations:
        t0 = P[k] - P[k - 4]; t0[1] = 0; t0 /= np.linalg.norm(t0)
        lp = loop_points(P[k], t0, np.array([0, 1., 0]), dict(spec, drift=0))
        fwd = int(round(float(np.dot(lp[-1] - P[k], t0))))   # the eased loop lands ~0.44 x its length ahead of where it began
        plan.append((k, spec, t0, fwd))
    for k, spec, t, fwd in plan:
        r = np.array([-t[2], 0, t[0]]); D = spec['drift'] * spec['side']
        for j in range(k - JOG, k + 1):
            P[j % n] = P[j % n] - r * D / 2 * sm((j - (k - JOG)) / JOG)
        for j in range(k + fwd, k + fwd + JOG + 1):
            P[j % n] = P[j % n] + r * D / 2 * sm(1 - (j - k - fwd) / JOG)
    marks = []
    for k, spec, t0, fwd in plan:
        out.extend(P[i:k + 1])
        lp = loop_points(P[k], t0, np.array([0, 1., 0]), spec)
        a = len(out); out.extend(lp[1:]); marks.append({'name': spec['name'], 'i0': a, 'i1': len(out), 'k': k, 'jog': JOG, 'fwd': fwd})
        i = k + fwd + 1
    out.extend(P[i:])
    Q = np.array(out)
    # the loop's sideways drift: the road after a loop runs offset by `drift`, so the plan path has a built-in jog;
    # check how far the spliced path's end lands from where the plan expected it (must be the jog, nothing else)
    P3, L = resample(Q)
    return p2, P, P3, L, marks

def curvature_xz(P, ds=1.0):
    n = len(P); T = np.roll(P, -1, 0) - np.roll(P, 1, 0); T[:, 1] = 0
    T /= np.maximum(1e-9, np.linalg.norm(T, axis=1))[:, None]
    a = np.roll(T, 1, 0); b = np.roll(T, -1, 0)
    raw = -np.arctan2(a[:, 0] * b[:, 2] - a[:, 2] * b[:, 0], a[:, 0] * b[:, 0] + a[:, 2] * b[:, 2]) / (2 * ds)
    w = max(4, round(12 / ds)); K = np.convolve(np.r_[raw[-w:], raw, raw[:w]], np.ones(2 * w + 1) / (2 * w + 1), 'valid')
    return K

def analyse(P, marks, W):
    n = len(P); K = curvature_xz(P)
    inloop = np.zeros(n, bool); injog = np.zeros(n, bool)
    for m in marks: inloop[m['i0']:m['i1']] = True; injog[max(0, m['i0'] - m['jog'] - 10):m['i1'] + m['jog'] + 10] = True
    Kp = np.where(injog, 0, K)
    # corners / straights like trackReport
    corners = []; i = 0
    while i < n:
        if abs(Kp[i]) > .006:
            j = i
            while j < n and abs(Kp[j]) > .006: j += 1
            if j - i >= 6:
                seg = Kp[i:j]; ap = i + int(np.argmax(np.abs(seg)))
                corners.append({'s': i, 'len': j - i, 'R': round(1 / abs(Kp[ap])), 'dir': 'L' if Kp[ap] > 0 else 'R'})
            i = j
        else: i += 1
    straights = []; i = 0
    while i < n:
        if abs(Kp[i]) < .0025:
            j = i
            while j < n and abs(Kp[j]) < .0025: j += 1
            if j - i >= 120: straights.append({'s': i, 'len': j - i})
            i = j
        else: i += 1
    # self clearance in plan: parts > 60 m apart along the lap that come within 2W + 4 m; > 5 m apart in height = crossing
    sub = P[::4]; idx = np.arange(0, n, 4); warn = []; cross = []
    need = 2 * W + 4
    for a in range(len(sub)):
        d = np.hypot(sub[:, 0] - sub[a, 0], sub[:, 2] - sub[a, 2])
        sep = np.abs(idx - idx[a]); sep = np.minimum(sep, n - sep)
        for b in np.where((d < need) & (sep > 60) & (np.arange(len(sub)) > a))[0]:
            if injog[idx[a]] and injog[idx[b]]: continue
            (cross if abs(sub[a, 1] - sub[b, 1]) > 5 else warn).append((int(idx[a]), int(idx[b]), round(float(d[b]), 1), round(float(sub[a, 1] - sub[b, 1]), 1)))
    return K, inloop, injog, corners, straights, warn, cross

def build_shortcut(sc, P):
    p2 = fillet_path(sc['start'], sc['corners'] + [[*sc['end'], 0]], closed=False)
    p2, Ls = resample(p2, closed=False)
    keys = sc.get('keys')
    if keys:
        dd = np.r_[0, np.cumsum(np.linalg.norm(np.diff(p2, axis=0), axis=1))]
        y = np.interp(dd / dd[-1], [k[0] for k in keys], [k[1] for k in keys])
    else: y = np.zeros(len(p2))
    i0 = int(np.argmin((P[:, 0] - sc['start'][0]) ** 2 + (P[:, 2] - sc['start'][1]) ** 2))
    i1 = int(np.argmin((P[:, 0] - sc['end'][0]) ** 2 + (P[:, 2] - sc['end'][1]) ** 2))
    main = (i1 - i0) % len(P)
    return np.c_[p2[:, 0], y, p2[:, 1]], Ls, i0, i1, main

def main():
    p2, P0, P, L, marks = build()
    # re-find loop marks on the resampled path (resample keeps 1 m spacing; positions shift slightly)
    for m in marks:
        pass
    n = len(P)
    # loop zones on the resampled path: highest-pitch stretch near each splice
    T = np.roll(P, -1, 0) - P; pitch = np.degrees(np.arctan2(T[:, 1], np.hypot(T[:, 0], T[:, 2])))
    marks2 = []
    for m in marks:
        c = m['i0'] + (m['i1'] - m['i0']) // 2
        marks2.append({'name': m['name'], 'i0': m['i0'], 'i1': m['i1'], 'jog': m['jog']})
    W = ROAD_W
    K, inloop, injog, corners, straights, warn, cross = analyse(P, marks2, W)
    sc_out = []
    for sc in SHORTCUTS:
        Q, Ls, i0, i1, main_len = build_shortcut(sc, P)
        # clearance of the branch from the main road away from its fork and merge
        bad = 0
        for q in Q[30:-30]:
            d = np.hypot(P[:, 0] - q[0], P[:, 2] - q[2]); far = np.abs(P[:, 1] - q[1]) < 5
            d[max(0, i0 - 140):i0 + 140] = 1e9; d[max(0, i1 - 140):i1 + 140] = 1e9
            if np.any((d < W + sc['w'] + 2) & far): bad += 1
        sc_out.append({'name': sc['name'], 'Q': Q, 'L': round(Ls), 'i0': i0, 'i1': i1, 'main': main_len, 'save': round(main_len - Ls), 'clash': bad})
    # sector table
    def s_of(x, z): return int(np.argmin((P[:, 0] - x) ** 2 + (P[:, 2] - z) ** 2))
    secs = [(name, s_of(*at)) for name, at, *_ in SECTORS]
    secs.sort(key=lambda t: t[1])
    sec_rows = []
    for i, (name, s0) in enumerate(secs):
        s1 = secs[(i + 1) % len(secs)][1]; ln = (s1 - s0) % n; sec_rows.append((name, s0, ln))

    print(f'lap {L:.0f} m  ({n} pts), 3 laps = {3 * L / 1000:.1f} km')
    for nm, s0, ln in sec_rows: print(f'  {nm:<28} s={s0:>6} m  {ln:>5} m')
    print('loops:', [(m['name'], m['i0'], m['i1'] - m['i0'], round(float(P[m['i0']:m['i1'], 1].max() - P[m['i0'], 1]), 1)) for m in marks2])
    print('climb', round(float(P[:, 1].max() - P[:, 1].min()), 1), 'm  (max', round(float(P[:, 1].max()), 1), 'min', round(float(P[:, 1].min()), 1), ')')
    print('corners', [(c['s'], c['R'], c['dir']) for c in corners]); print(f'{len(corners)} corners, tightest R {min(c["R"] for c in corners)} m; {len(straights)} straights, longest {max(s["len"] for s in straights)} m')
    print('clearance warnings', len(warn), warn[:12])
    print('crossings', len(cross), sorted(set((a // 50 * 50, b // 50 * 50) for a, b, *_ in cross))[:20])
    for s in sc_out: print(f'shortcut {s["name"]}: {s["L"]} m vs main {s["main"]} m -> saves {s["save"]} m; fork s={s["i0"]} merge s={s["i1"]}; clashes {s["clash"]}')
    # max grade outside loops
    g = np.degrees(np.arctan2(np.diff(P[:, 1]), 1.0)); g[injog[:-1]] = 0
    print('steepest grade', round(float(np.abs(g).max()), 1), 'deg at', int(np.argmax(np.abs(g))))

    # ------------------------------------------------------------ plan
    fig, ax = plt.subplots(figsize=(13, 13), dpi=110); fig.patch.set_facecolor('#0b0c10'); ax.set_facecolor('#0b0c10')
    cols = {'Center City': '#f0c040', 'Ben Franklin Bridge': '#ff5a3a', 'Camden': '#ff9a3a', 'Harbor Line Tunnel': '#5fe6ff',
            'Port Richmond': '#7fa6c8', 'Roosevelt Blvd': '#b6ff3c', 'Hunting Park': '#ff2fb4', 'Mt Airy': '#c79bff',
            'Wissahickon': '#4fd17a', 'Kelly Drive': '#5f9dff', 'Parkway': '#f4f0e6'}
    # river band
    ax.axvspan(1030, 1730, color='#10233a', zorder=0); ax.text(1380, -2300, 'DELAWARE', color='#2f5a86', ha='center', fontsize=11, rotation=90)
    seg_col = np.empty(n, object)
    for i, (nm, s0, ln) in enumerate(sec_rows):
        for k in range(ln): seg_col[(s0 + k) % n] = cols.get(nm.split(' ·')[0], '#888')
    pts = P[:, [0, 2]]
    segs = np.stack([pts, np.roll(pts, -1, 0)], 1)
    widths = np.where(inloop, 6, 2.6)
    under = P[:, 1] < -3
    lc = LineCollection(segs, colors=list(seg_col), linewidths=widths, zorder=3, alpha=1.0)
    lc.set_linestyles(['dotted' if u else 'solid' for u in under])
    ax.add_collection(lc)
    for s in sc_out:
        ax.plot(s['Q'][:, 0], s['Q'][:, 2], color='#ffffff', lw=1.6, ls=(0, (4, 3)), zorder=4)
        m = s['Q'][len(s['Q']) // 2]; ax.text(m[0] + 30, m[2], f"{s['name']}\n-{s['save']} m", color='#ffffff', fontsize=8, zorder=6)
    for m in marks2:
        c = P[m['i0']]; ax.add_patch(plt.Circle((c[0], c[2]), 45, fill=False, ec='#ff2fb4', lw=2.2, zorder=6))
        ax.text(c[0] + 55, c[2] - 20, m['name'], color='#ff2fb4', fontsize=9, weight='bold', zorder=6)
    for c in corners: ax.text(P[c['s'], 0], P[c['s'], 2], f"{c['R']}", color='#9aa3ad', fontsize=6, zorder=5)
    ax.plot(*START, 'o', color='#3cff8a', ms=9, zorder=7); ax.text(START[0] - 40, START[1] + 70, 'START / FINISH', color='#3cff8a', fontsize=9, weight='bold')
    for nm, s0, ln in sec_rows:
        p = P[s0]; ax.plot(p[0], p[2], 's', color=cols.get(nm.split(' ·')[0], '#888'), ms=6, zorder=7)
    for w in warn: ax.plot([P[w[0], 0], P[w[1], 0]], [P[w[0], 2], P[w[1], 2]], color='red', lw=1, zorder=8)
    ax.set_aspect('equal'); ax.invert_yaxis()
    ax.tick_params(colors='#556'); [sp.set_color('#223') for sp in ax.spines.values()]
    ax.set_title(f'EVENT 16 · LAST CALL — {L / 1000:.2f} km lap, 3 laps', color='#f4f0e6', fontsize=14, loc='left')
    handles = [plt.Line2D([], [], color=c, lw=3, label=k) for k, c in cols.items()]
    handles += [plt.Line2D([], [], color='#fff', lw=1.6, ls='--', label='shortcut'), plt.Line2D([], [], color='#aaa', lw=2, ls=':', label='underground')]
    ax.legend(handles=handles, loc='lower left', facecolor='#11131a', edgecolor='#223', labelcolor='#ccd', fontsize=8)
    ax.text(0, 1.0, '', transform=ax.transAxes)
    fig.savefig(os.path.join(OUT, 'plan.png'), facecolor=fig.get_facecolor(), bbox_inches='tight'); plt.close(fig)

    # ------------------------------------------------------------ elevation profile
    fig, ax = plt.subplots(figsize=(15, 4), dpi=110); fig.patch.set_facecolor('#0b0c10'); ax.set_facecolor('#0b0c10')
    s = np.arange(n)
    for i, (nm, s0, ln) in enumerate(sec_rows):
        ss = (s0 + np.arange(ln)) % n; ss = ss[ss >= s0] if s0 + ln <= n else ss
        ax.fill_between(np.sort(ss), -40, 80, color=cols.get(nm.split(' ·')[0], '#888'), alpha=.08)
        ax.text(s0 + 10, 72, nm, color=cols.get(nm.split(' ·')[0], '#888'), fontsize=7, rotation=0)
    ax.plot(s, P[:, 1], color='#f4f0e6', lw=1.4)
    for m in marks2: ax.annotate(m['name'], (m['i0'], P[m['i0']:m['i1'], 1].max()), color='#ff2fb4', fontsize=8)
    for sc in sc_out: ax.plot([sc['i0'], sc['i1']], [-30, -30], color='#fff', lw=2); ax.text(sc['i0'], -37, sc['name'], color='#fff', fontsize=7)
    ax.set_ylim(-40, 80); ax.set_xlim(0, n); ax.tick_params(colors='#556'); ax.set_xlabel('metres from the line', color='#889'); ax.set_ylabel('height m', color='#889')
    [sp.set_color('#223') for sp in ax.spines.values()]
    fig.savefig(os.path.join(OUT, 'profile.png'), facecolor=fig.get_facecolor(), bbox_inches='tight'); plt.close(fig)

    json.dump({'L': round(L), 'sectors': [{'name': a, 's': b, 'len': c} for a, b, c in sec_rows],
               'loops': [{'name': m['name'], 's0': m['i0'], 's1': m['i1'], 'h': round(float(P[m['i0']:m['i1'], 1].max() - P[m['i0'], 1]), 1)} for m in marks2],
               'shortcuts': [{k: v for k, v in s.items() if k != 'Q'} for s in sc_out],
               'corners': corners, 'straights': straights, 'warn': warn,
               'plan': [[round(float(p[0]), 1), round(float(p[1]), 2), round(float(p[2]), 1)] for p in P[::6]],
               'branches': [{'name': s['name'], 'pts': [[round(float(q[0]), 1), round(float(q[1]), 2), round(float(q[2]), 1)] for q in s['Q'][::6]]} for s in sc_out]},
              open(os.path.join(OUT, 'layout.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
