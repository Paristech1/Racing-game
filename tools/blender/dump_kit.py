"""Blender side of the kit GLB path over MCP: for every asset Empty in `roots`, dump its child meshes (already in the
asset's local frame) per material, in game space (y up). pack_glb.py --kit turns the JSON into a GLB with one node per
asset and one child mesh per material, which is what kitParts() in js/afterhours.js expects."""
import numpy as np, base64
def _enc(P, N, I):
    return {'p': base64.b64encode(P.astype(np.float32).tobytes()).decode(), 'n': base64.b64encode(N.astype(np.float32).tobytes()).decode(),
            'i': base64.b64encode(I.astype(np.uint32).tobytes()).decode()}
def dump(roots):
    out = {}
    for root in roots:
        A = out.setdefault(root.name, {})
        for ob in root.children:
            me = ob.data; me.calc_loop_triangles(); nt = len(me.loop_triangles)
            co = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
            tv = np.empty(nt * 3, np.int32); me.loop_triangles.foreach_get('vertices', tv)
            tn = np.empty(nt * 9, np.float32); me.loop_triangles.foreach_get('split_normals', tn)
            P = co[tv]; N = tn.reshape(-1, 3)
            g = np.stack([P[:, 0], P[:, 2], -P[:, 1]], 1); n = np.stack([N[:, 0], N[:, 2], -N[:, 1]], 1)
            n = n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-8)
            q = np.round(np.concatenate([g * 1e4, n * 1e3], 1)).astype(np.int64)
            _, idx, inv = np.unique(q, axis=0, return_index=True, return_inverse=True)
            A[me.materials[0].name.split('.')[0]] = _enc(g[idx], n[idx], inv.ravel())
    return out
