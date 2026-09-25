"""Blender side of the GLB path used over MCP (Blender's own glTF exporter crashed Blender 5.2 when run through the MCP pipe).
After autobahn_63.py has built the car (its namespace in `ns`), this dumps each material's triangles in game space
(y up) as base64 float32/uint32 arrays; pack_glb.py turns the JSON into the .glb the game loads."""
import numpy as np, base64
def dump(objs):
    groups = {}
    for ob in objs:
        me = ob.data; me.calc_loop_triangles()
        mats = [(m.name.split('.')[0] if m else 'PAINT') for m in me.materials] or ['PAINT']
        co = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
        nt = len(me.loop_triangles)
        tv = np.empty(nt * 3, np.int32); me.loop_triangles.foreach_get('vertices', tv)
        tn = np.empty(nt * 9, np.float32); me.loop_triangles.foreach_get('split_normals', tn)
        tm = np.empty(nt, np.int32); me.loop_triangles.foreach_get('material_index', tm)
        mw = np.array(ob.matrix_world, np.float32)
        P = co[tv] @ mw[:3, :3].T + mw[:3, 3]; N = tn.reshape(-1, 3) @ mw[:3, :3].T
        for mi in np.unique(tm):
            sel = np.repeat(tm == mi, 3); groups.setdefault(mats[min(mi, len(mats) - 1)], []).append((P[sel], N[sel]))
    out = {}
    for k, lst in groups.items():
        P = np.concatenate([a for a, b in lst]); N = np.concatenate([b for a, b in lst])
        g = np.stack([P[:, 0], P[:, 2], -P[:, 1]], 1).astype(np.float32); n = np.stack([N[:, 0], N[:, 2], -N[:, 1]], 1)
        n = (n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-8)).astype(np.float32)
        q = np.round(np.concatenate([g * 1e5, n * 1e3], 1)).astype(np.int64)
        _, idx, inv = np.unique(q, axis=0, return_index=True, return_inverse=True)
        out[k] = {'p': base64.b64encode(g[idx].tobytes()).decode(), 'n': base64.b64encode(n[idx].tobytes()).decode(),
                  'i': base64.b64encode(inv.ravel().astype(np.uint32).tobytes()).decode()}
    return out
