/** Track definitions: centerline waypoints in world space (x, z). */

export const EVENTS = {
  tunnel: {
    id: 'tunnel',
    name: 'Harbor Line — Tunnel 7',
    theme: 'cold',
    laps: 2,
    roadWidth: 14,
    wallOffset: 1.2,
    fog: 0.018,
    fogColor: 0x0a1520,
    ambient: 0x1a2840,
    ground: 0x0c1018,
    lineColor: 0x6eb5ff,
    buildScene: 'tunnel',
  },
  boulevard: {
    id: 'boulevard',
    name: 'Event 02 — The Boulevard',
    theme: 'cold',
    laps: 2,
    roadWidth: 28,
    wallOffset: 1.5,
    fog: 0.012,
    fogColor: 0x080c14,
    ambient: 0x1a2035,
    ground: 0x0a0c10,
    lineColor: 0xffcc66,
    buildScene: 'boulevard',
  },
};

/** Harbor Line tunnel loop ~900m */
export function getTunnelPoints() {
  const pts = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const r = 120 + Math.sin(t * 3) * 18;
    pts.push({
      x: Math.cos(t) * r,
      z: Math.sin(t) * r * 0.65,
      width: 14,
    });
  }
  return pts;
}

/** Roosevelt Blvd inspired stretch ~800m (half mile) */
export function getBoulevardPoints() {
  const pts = [];
  const len = 800;
  const step = 20;
  for (let d = 0; d <= len; d += step) {
    const t = d / len;
    const curve = Math.sin(t * Math.PI * 1.2) * 35 + Math.sin(t * Math.PI * 4) * 8;
    pts.push({
      x: curve,
      z: -d,
      width: 28,
      boulevard: true,
      intersection: d > 0 && d % 200 < step,
    });
  }
  // Return loop via connector
  for (let d = len; d >= 0; d -= step) {
    const t = d / len;
    const curve = Math.sin(t * Math.PI * 1.2) * 35 + Math.sin(t * Math.PI * 4) * 8 + 55;
    pts.push({
      x: curve,
      z: -d + 90,
      width: 28,
      boulevard: true,
    });
  }
  return pts;
}

export function getTrackPoints(eventId) {
  return eventId === 'boulevard' ? getBoulevardPoints() : getTunnelPoints();
}
