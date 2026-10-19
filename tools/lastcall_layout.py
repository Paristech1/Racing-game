"""Event 16 "Last Call" layout data, game metres (x east, -z north, y up). Mirrored in js/afterhours.js (LC_*).

The lap, clockwise from City Hall:
  Center City   Market St east from City Hall, left up 6th St past Independence Mall      (Bridge Run, outbound half)
  Bridge        right onto the Ben Franklin Bridge: 1.3 km over the Delaware, 30 m deck   (Bridge Run)
  Camden        left along the Camden waterfront to the tunnel portal
  Tunnel        Harbor Line: down under the river, sweeping bends, up into the Port Richmond vent tower and
                THE HALO (loop 1) inside it, out of the Philly portal                           (Event 01)
  Port Richmond north up the I-95 connector
  Blvd          left onto Roosevelt Blvd: the mile, live traffic, local lanes swing round the Cottman
                interchange, express lanes (shortcut) run straight under it                     (Event 02)
  Hunting Park  THE RING (loop 2) at the west end of the Boulevard, on the line of the straight
  Mt Airy       Germantown Ave cobbles uphill, Mt Airy Ave, Lincoln Drive S-bends down the gorge (Event 09)
  Wissahickon   the gorge to the Schuylkill; Forbidden Drive (shortcut) runs the creek bank
  Kelly Drive   down the Schuylkill past Boathouse Row to the Art Museum
  Parkway       the Benjamin Franklin Parkway to 15th St, past LOVE Park, round City Hall onto Market (Bridge Run, return half)
"""
START = (0, 20)
ROAD_W = 7.0          # half width (makeTrack W): 14 m of road

# Mt Airy block: the Event 09 corners turned 90 degrees (old north -> west) so Germantown Ave runs west off the end of
# the Boulevard, then translated into place. (x, z) -> (z, -x) + MA_T.
MA_T = (-850, -2492)
def ma(x, z, r): return [z + MA_T[0], -x + MA_T[1], r]

CORNERS = [
    # Center City: Market St -> 6th St -> the bridge
    [720, 20, 30], [720, -300, 40],
    # the Ben Franklin Bridge, then left onto the Camden waterfront
    [2140, -300, 50], [2140, -780, 90],
    # Harbor Line tunnel under the Delaware (portal ~x 2040), sweeping bends like Event 01 (R 70-150)
    [1760, -660, 180], [1480, -1000, 150], [1180, -740, 150], [920, -1040, 120],
    # up into the Port Richmond vent tower: THE HALO sits on the straight through it, then out of the Philly portal
    [880, -1640, 160],
    # I-95 connector north to the Boulevard
    [1010, -2050, 160], [960, -2500, 80],
    # Roosevelt Blvd west: the local lanes swing out round the Cottman interchange (the express lanes run straight)
    [620, -2500, 90], [450, -2640, 90], [70, -2640, 90], [-100, -2500, 90],
    # THE RING on the straight at Hunting Park, then onto Germantown Ave
    [-960, -2500, 60],
    # Mt Airy (Event 09 corners, turned): Germantown Ave west (cobbles, uphill), Mt Airy Ave south, Lincoln Dr east
    ma(40, -600, 40), ma(-60, -680, 50), ma(-300, -700, 60), ma(-450, -690, 60), ma(-560, -620, 55),
    # Lincoln Drive: the S-bends, deeper than Event 09's so the drive really snakes (apexes R 40-60, creek on the right)
    [-1330, -1950, 38], [-1225, -1835, 38], [-1105, -1950, 38], [-985, -1830, 38], [-860, -1925, 45],
    # the gorge opens onto the Schuylkill: Kelly Drive south-east past Boathouse Row
    [-660, -1720, 160], [-720, -1180, 220], [-470, -620, 150],
    # the Art Museum, down the Parkway, 15th St south past LOVE Park, round City Hall onto Market
    [-300, -470, 70], [-80, -340, 40], [-80, 20, 30],
]

# height keys [x, z, y(, smoothing half-window m)]
KEYS = [
    [0, 20, 0], [700, 20, 0], [720, -280, 0, 6], [790, -300, 0, 6], [1020, -300, 30, 30], [1380, -300, 31.5, 60], [1740, -300, 30, 30],
    [1960, -300, 0, 6], [2140, -500, 0], [2120, -780, 0, 6], [2040, -760, 0, 6],
    [1860, -680, -28, 30], [1480, -1000, -29], [1180, -740, -28.5], [1010, -930, -28, 30],
    [905, -1200, 0, 30], [890, -1330, 2, 10], [880, -1500, 2, 10], [885, -1700, 2, 25],
    # up onto the I-95 viaduct along the river; the expansion-joint crest throws you, then down the Cottman off-ramp
    [940, -1900, 12, 25], [1000, -2080, 13, 4], [1008, -2110, 15, 4], [1005, -2140, 13, 25], [985, -2340, 3, 20],
    [960, -2500, 0], [-960, -2500, 0, 10],
    ma(8, -150, 3)[:2] + [3], ma(20, -300, 6)[:2] + [6], ma(40, -600, 13)[:2] + [13], ma(-60, -680, 14)[:2] + [14],
    ma(-300, -700, 13)[:2] + [13], ma(-450, -690, 12)[:2] + [12], ma(-560, -620, 8)[:2] + [8],
    [-1330, -1950, -1], [-1225, -1835, -3], [-1105, -1950, -5], [-985, -1830, -6], [-860, -1925, -7],
    [-660, -1720, -4], [-720, -1180, -2], [-470, -620, 1], [-300, -470, 6], [-180, -400, 3], [-80, -340, 1], [-80, 20, 0],
]

# vertical loops: placed on a straight at `at`; `len` m of road, eased in and out (clothoid-style), the exit offset
# sideways by `drift` from the entry so the two roads pass side by side under the loop
LOOPS = [
    {'name': 'THE HALO', 'at': (886, -1420), 'len': 260, 'drift': 17, 'side': 1},
    {'name': 'THE RING', 'at': (-560, -2500), 'len': 300, 'drift': 17, 'side': 1},
]

# shortcuts: open fillet paths from a fork on the main line to a merge further on. w = half width
SHORTCUTS = [
    # cuts the 6th St corner diagonally through the park: paths and grass (less grip), round the fountain
    {'name': 'FRANKLIN SQUARE', 'w': 4.5, 'start': (480, 20), 'end': (720, -250),
     'corners': [[540, -40, 30], [580, -110, 25], [650, -150, 25], [690, -200, 25]]},
    # a narrow maintenance bore under the river, 10 m below the road tube: dark, wet, straight through both bends
    {'name': 'SERVICE BORE', 'w': 4.0, 'start': (1650, -790), 'end': (1010, -965),
     'corners': [[1540, -850, 50], [1330, -860, 50], [1250, -900, 40], [1110, -910, 40]], 'keys': [[0, -27], [.2, -39], [.8, -39], [1, -28]]},
    # Roosevelt Blvd's inner express lanes: straight down a trench under the Cottman Ave bridge, no traffic, no gems
    {'name': 'EXPRESS LANES', 'w': 5.0, 'start': (760, -2500), 'end': (-320, -2500), 'corners': [[660, -2482, 40], [-220, -2482, 40]],
     'keys': [[0, 0], [.2, -6.5], [.8, -6.5], [1, 0]]},
    # the gravel bridle path along the creek floor of the Wissahickon, under the S-bends, past the stone bridge
    {'name': 'FORBIDDEN DRIVE', 'w': 4.0, 'start': (-1400, -1945), 'end': (-690, -1765),
     'corners': [[-1335, -1800, 70], [-1150, -1775, 90], [-900, -1785, 90]], 'keys': [[0, 1], [.25, -9], [.75, -9.5], [1, -4]]},
]

# sector markers (name, (x, z)) — the start of each sector along the lap
SECTORS = [
    ('Center City', (0, 20)), ('Ben Franklin Bridge', (720, -260)), ('Camden', (2000, -300)),
    ('Harbor Line Tunnel', (2100, -780)), ('Port Richmond', (884, -1600)), ('Roosevelt Blvd', (900, -2500)),
    ('Hunting Park', (-500, -2500)), ('Mt Airy', ma(8, -150, 0)[:2]), ('Wissahickon', ma(-600, -480, 0)[:2]),
    ('Kelly Drive', (-760, -1800)), ('Parkway', (-300, -470)),
]

BRIDGE = {'deckY': 30, 'x0': 790, 'x1': 1960, 'river': (1030, 1730)}

# ---------------------------------------------------------------- power-up drops
# style: gate = three abreast (pick one), pair = two abreast, bait = one gem off the racing line, crown = at the top of a
# loop (on the line), stash = on a shortcut, air = floating over a crest (only a car in the air gets it), single = one gem.
# Types follow the lap's drop table (LAP_TABLES) unless the drop names its own. at = (x, z) on the plan, x = lateral m.
DROPS = [
    {'at': (300, 20),     'style': 'gate',  'x': [-4.5, 0, 4.5], 'slot': ['calm', 'speed', 'guard'], 'where': 'Market St, under the Reading Terminal sign'},
    {'at': (650, -150),   'style': 'stash', 'x': [0], 'slot': ['hit'], 'branch': 'FRANKLIN SQUARE', 'where': 'by the fountain'},
    {'at': (1380, -300),  'style': 'gate',  'x': [-4.5, 0, 4.5], 'slot': ['launch', 'calm', 'hit'], 'where': 'mid-span, between the towers'},
    {'at': (2140, -650),  'style': 'bait',  'x': [5.0], 'slot': ['grip'], 'where': 'outside of the portal corner, Camden'},
    {'at': (1600, -760),  'style': 'pair',  'x': [-3.2, 3.2], 'slot': ['calm', 'guard'], 'where': 'first bend under the river'},
    {'at': (1330, -860),  'style': 'stash', 'x': [0], 'slot': ['ghost'], 'branch': 'SERVICE BORE', 'where': 'halfway down the bore'},
    {'at': 'THE HALO',    'style': 'crown', 'x': [0], 'slot': ['speed'], 'where': 'top of the Halo'},
    {'at': (1008, -2110), 'style': 'air',   'x': [0], 'slot': ['launch'], 'y': 3.6, 'where': 'over the I-95 crest'},
    {'at': (500, -2620),  'style': 'single', 'x': [-2.5], 'slot': ['calm'], 'where': 'local lanes, in traffic'},
    {'at': (250, -2640),  'style': 'single', 'x': [2.5], 'slot': ['grip'], 'where': 'local lanes, under the Cottman bridge'},
    {'at': (20, -2620),   'style': 'single', 'x': [0], 'slot': ['ghost'], 'where': 'local lanes, past the gas station'},
    {'at': 'THE RING',    'style': 'crown', 'x': [0], 'slot': ['launch'], 'where': 'top of the Ring'},
    {'at': (-1150, -2512),'style': 'bait',  'x': [-4.2], 'slot': ['grip'], 'where': 'on the trolley rails, Germantown Ave'},
    {'at': (-1545, -2250),'style': 'pair',  'x': [-3.2, 3.2], 'slot': ['hit', 'speed'], 'where': 'Mt Airy Ave, under the street trees'},
    {'at': (-1150, -1775),'style': 'air',   'x': [0], 'slot': ['speed'], 'y': 3.2, 'branch': 'FORBIDDEN DRIVE', 'where': 'over the stone bridge at Valley Green'},
    {'at': (-985, -1830), 'style': 'single', 'x': [0], 'slot': ['calm'], 'where': 'Lincoln Dr, last S-bend'},
    {'at': (-690, -1300), 'style': 'gate',  'x': [-4.5, 0, 4.5], 'slot': ['calm', 'speed', 'guard'], 'where': 'Kelly Dr, Boathouse Row'},
    {'at': (-80, -150),   'style': 'single', 'x': [0], 'slot': ['catchup'], 'where': '15th St, LOVE Park: the last-call gem'},
]
# what each slot draws, by lap: Happy Hour (lap 1, friendly), Rush (lap 2, mixed), Last Call (lap 3, everything bites)
LAP_TABLES = {
    'Happy Hour': {'calm': 'refill', 'speed': 'long', 'guard': 'shield', 'launch': 'over', 'hit': 'shield', 'grip': 'grip', 'ghost': 'ghost', 'catchup': 'refill'},
    'Rush':       {'calm': 'refill', 'speed': 'over', 'guard': 'shield', 'launch': 'sling', 'hit': 'shock', 'grip': 'grip', 'ghost': 'ghost', 'catchup': 'payback'},
    'Last Call':  {'calm': 'long', 'speed': 'over', 'guard': 'payback', 'launch': 'sling', 'hit': 'shock', 'grip': 'jam', 'ghost': 'ghost', 'catchup': 'desperate'},
}

# ---------------------------------------------------------------- set pieces (Midjourney frames -> Blender kit)
SETPIECES = [
    ('Center City', 'City Hall and Market St (philly_kit), the Liberty Bell pavilion, Franklin Square fountain and carousel (new)'),
    ('Ben Franklin Bridge', 'BFB towers (philly_kit), blue cable light show, suspension cables'),
    ('Camden', 'Battleship New Jersey moored on the waterfront (new), the aquarium, the lens portal into the tunnel (new)'),
    ('Harbor Line Tunnel', 'white-tile immersed tube (Event 01), the Service Bore (new), THE HALO vent tower: a glass and steel shaft with the lit loop inside it (new, hero)'),
    ('Port Richmond', 'I-95 viaduct on white piers, casino tower neon, container cranes (calder kit)'),
    ('Roosevelt Blvd', 'blvd_kit medians, lamps, strip malls, gas station, the Cottman Ave bridge and the express trench'),
    ('Hunting Park', 'THE RING: an open-air steel loop on twin pylons, LED ring, the mile of the Boulevard pointing straight at it (new, hero)'),
    ('Mt Airy', 'mtairy_kit shops, theatre and stone twins, cobbles and trolley rails, overhead trolley wire'),
    ('Wissahickon', 'gorge woods, the Walnut Lane Bridge arch, Valley Green Inn and the stone bridge on Forbidden Drive (new), lanterns, fireflies'),
    ('Kelly Drive', 'Boathouse Row outline lights doubled in the Schuylkill (philly_kit)'),
    ('Parkway', 'the Art Museum (philly_kit), flags down the Parkway (new), LOVE Park, City Hall finish'),
]
