"""Pack mesh dumps from dump_mesh.py / dump_kit.py (Blender over MCP) into a GLB.
  python3 pack_glb.py dump.json out.glb          -> one node per material (car bodies)
  python3 pack_glb.py --kit dump.json out.glb    -> one node per asset, a child mesh per material (<asset>_<MAT>)"""
import json, base64, struct, sys, numpy as np
KIT = '--kit' in sys.argv; args = [a for a in sys.argv[1:] if a != '--kit']
d = json.load(open(args[0])); d = d.get('result', d); print(d.get('info', ''))
bin_ = b''; views = []; accs = []; meshes = []; nodes = []; mats = []; matIx = {}
def add(arr, target, comp, typ, mm=False):
    global bin_
    while len(bin_) % 4: bin_ += b'\0'
    off = len(bin_); b = arr.tobytes(); bin_ += b
    views.append({'buffer': 0, 'byteOffset': off, 'byteLength': len(b), 'target': target})
    a = {'bufferView': len(views) - 1, 'componentType': comp, 'count': len(arr), 'type': typ}
    if mm: a['min'] = arr.min(0).tolist(); a['max'] = arr.max(0).tolist()
    accs.append(a); return len(accs) - 1
def material(k):
    if k not in matIx:
        mats.append({'name': k, 'pbrMetallicRoughness': {'baseColorFactor': [.5, .5, .5, 1], 'metallicFactor': .2, 'roughnessFactor': .6}}); matIx[k] = len(mats) - 1
    return matIx[k]
def mesh_node(name, k, v):
    P = np.frombuffer(base64.b64decode(v['p']), np.float32).reshape(-1, 3); N = np.frombuffer(base64.b64decode(v['n']), np.float32).reshape(-1, 3)
    I = np.frombuffer(base64.b64decode(v['i']), np.uint32)
    pa = add(P, 34962, 5126, 'VEC3', True); na = add(N, 34962, 5126, 'VEC3'); ia = add(I, 34963, 5125, 'SCALAR')
    meshes.append({'name': name, 'primitives': [{'attributes': {'POSITION': pa, 'NORMAL': na}, 'indices': ia, 'material': material(k)}]})
    nodes.append({'name': name, 'mesh': len(meshes) - 1}); return len(nodes) - 1, len(I) // 3
stats = {}; top = []
if KIT:
    for asset, parts in sorted(d['assets'].items()):
        kids = []
        for k, v in sorted(parts.items()):
            ni, nt = mesh_node(f'{asset}_{k}', k, v); kids.append(ni); stats[asset] = stats.get(asset, 0) + nt
        nodes.append({'name': asset, 'children': kids}); top.append(len(nodes) - 1)
else:
    for k, v in sorted(d['mats'].items()):
        ni, nt = mesh_node(k, k, v); top.append(ni); stats[k] = nt
while len(bin_) % 4: bin_ += b'\0'
g = {'asset': {'version': '2.0', 'generator': 'AFTERHOURS tools/blender (Blender mesh data)'}, 'scene': 0, 'scenes': [{'nodes': top}],
     'nodes': nodes, 'meshes': meshes, 'materials': mats, 'accessors': accs, 'bufferViews': views, 'buffers': [{'byteLength': len(bin_)}]}
js = json.dumps(g, separators=(',', ':')).encode()
while len(js) % 4: js += b' '
out = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(bin_)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(bin_), 0x004E4942) + bin_
open(args[1], 'wb').write(out); print(len(out), 'bytes, tris:', stats)
