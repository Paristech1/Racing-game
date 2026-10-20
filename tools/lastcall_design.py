"""AFTERHOURS — Event 16 "Last Call" course drawings.

The game is the source of truth: tools/lastcall_export.cjs builds the lap, loops and shortcut branches with the same code
as js/afterhours.js and writes docs/lastcall/layout.json. This script draws that file (docs/lastcall/plan.png and
profile.png) and prints the numbers; tools/lastcall_sheet.py turns it into docs/lastcall/course-sheet.html.

usage: node tools/lastcall_export.cjs && python3 tools/lastcall_design.py && python3 tools/lastcall_sheet.py
"""
import json, os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'docs', 'lastcall')
COLS = {'Center City': '#f0c040', 'Ben Franklin Bridge': '#ff5a3a', 'Camden': '#ff9a3a', 'Harbor Line Tunnel': '#5fe6ff',
        'Port Richmond': '#7fa6c8', 'Roosevelt Blvd': '#b6ff3c', 'Hunting Park': '#ff2fb4', 'Mt Airy': '#c79bff',
        'Wissahickon': '#4fd17a', 'Kelly Drive': '#5f9dff', 'Parkway': '#f4f0e6'}
BG = '#0b0c10'


def main():
    d = json.load(open(os.path.join(OUT, 'layout.json')))
    L, P = d['L'], np.array(d['plan'])  # plan rows: x, y, z, curvature, every 6 m
    s = np.arange(len(P)) * 6
    sec_of = np.empty(len(P), object)
    for sc in d['sectors']:
        for i in range(len(P)):
            if (s[i] - sc['s']) % L < sc['len']: sec_of[i] = sc['name']
    inloop = np.zeros(len(P), bool)
    for lp in d['loops']: inloop |= (s >= lp['s0']) & (s <= lp['s1'])

    print(f"lap {L} m, 3 laps = {3 * L / 1000:.1f} km; climb {P[~inloop, 1].max() - P[:, 1].min():.1f} m (low {P[:, 1].min():.1f} m)")
    for sc in d['sectors']: print(f"  {sc['name']:<22} {sc['s']:>6} m  {sc['len']:>5} m")
    for lp in d['loops']: print(f"  {lp['name']:<22} {lp['s0']:>6} m  {lp['s1'] - lp['s0']:>5} m  {lp['h']} m high")
    for b in d['branches']:
        print(f"  {b['name']:<22} {b['L']} m vs {b['main']} m: saves {b['save']} m, min R {b['minR']} m, clearance {b['clearance']} m, ends {b['endAngles']} deg")

    # ---- plan
    fig, ax = plt.subplots(figsize=(13, 13), dpi=110); fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
    ax.axvspan(1030, 1730, color='#10233a', zorder=0); ax.text(1380, -2300, 'DELAWARE', color='#2f5a86', ha='center', fontsize=11, rotation=90)
    xz = P[:, [0, 2]]; segs = np.stack([xz, np.roll(xz, -1, 0)], 1)
    lc = LineCollection(segs, colors=[COLS.get(n, '#888') for n in sec_of], linewidths=np.where(inloop, 6, 2.6), zorder=3)
    lc.set_linestyles(['dotted' if y < -3 else 'solid' for y in P[:, 1]]); ax.add_collection(lc)
    for b in d['branches']:
        Q = np.array(b['pts']); ax.plot(Q[:, 0], Q[:, 2], color='#fff', lw=1.6, ls=(0, (4, 3)), zorder=4)
        m = Q[len(Q) // 2]; ax.text(m[0] + 30, m[2], f"{b['name']}\n-{b['save']} m", color='#fff', fontsize=8, zorder=6)
    for lp in d['loops']:
        c = P[lp['s0'] // 6]; ax.add_patch(plt.Circle((c[0], c[2]), 45, fill=False, ec='#ff2fb4', lw=2.2, zorder=6))
        ax.text(c[0] + 55, c[2] - 20, lp['name'], color='#ff2fb4', fontsize=9, weight='bold', zorder=6)
    ax.plot(P[0, 0], P[0, 2], 'o', color='#3cff8a', ms=9, zorder=7); ax.text(P[0, 0] - 40, P[0, 2] + 70, 'START / FINISH', color='#3cff8a', fontsize=9, weight='bold')
    for dr in d['drops']:
        p = P[(dr['s'] // 6) % len(P)]; ax.plot(p[0], p[2], 'D', color='#ffd23c', ms=4, zorder=7)
    ax.set_aspect('equal'); ax.invert_yaxis(); ax.tick_params(colors='#556'); [sp.set_color('#223') for sp in ax.spines.values()]
    ax.set_title(f'EVENT 16 · LAST CALL — {L / 1000:.2f} km lap, 3 laps', color='#f4f0e6', fontsize=14, loc='left')
    h = [plt.Line2D([], [], color=c, lw=3, label=k) for k, c in COLS.items()]
    h += [plt.Line2D([], [], color='#fff', lw=1.6, ls='--', label='shortcut'), plt.Line2D([], [], color='#aaa', lw=2, ls=':', label='underground'),
          plt.Line2D([], [], color='#ffd23c', marker='D', lw=0, label='drop')]
    ax.legend(handles=h, loc='lower left', facecolor='#11131a', edgecolor='#223', labelcolor='#ccd', fontsize=8)
    fig.savefig(os.path.join(OUT, 'plan.png'), facecolor=BG, bbox_inches='tight'); plt.close(fig)

    # ---- profile
    fig, ax = plt.subplots(figsize=(15, 4), dpi=110); fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
    for sc in d['sectors']:
        c = COLS.get(sc['name'], '#888'); ax.axvspan(sc['s'], sc['s'] + sc['len'], color=c, alpha=.08); ax.text(sc['s'] + 10, 72, sc['name'], color=c, fontsize=7)
    y = np.where(inloop, np.nan, P[:, 1]); ax.plot(s, y, color='#f4f0e6', lw=1.4)
    for lp in d['loops']:
        ax.plot([lp['s0'], lp['s0']], [P[lp['s0'] // 6, 1], P[lp['s0'] // 6, 1] + lp['h']], color='#ff2fb4', lw=3)
        ax.text(lp['s0'] + 20, min(70, P[lp['s0'] // 6, 1] + lp['h'] - 6), f"{lp['name']} {lp['h']:.0f} m", color='#ff2fb4', fontsize=8)
    for b in d['branches']: ax.plot([b['s0'], b['s1']], [-30, -30], color='#fff', lw=2); ax.text(b['s0'], -37, b['name'], color='#fff', fontsize=7)
    ax.set_ylim(-40, 80); ax.set_xlim(0, L); ax.tick_params(colors='#556'); ax.set_xlabel('metres from the line', color='#889'); ax.set_ylabel('height m', color='#889')
    [sp.set_color('#223') for sp in ax.spines.values()]
    fig.savefig(os.path.join(OUT, 'profile.png'), facecolor=BG, bbox_inches='tight'); plt.close(fig)


if __name__ == '__main__':
    main()
