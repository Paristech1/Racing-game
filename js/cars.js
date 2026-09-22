export const CARS = [
  {
    id: 'kage',
    name: 'Kage R',
    tagline: 'Cold steel. Quiet violence.',
    theme: 'cold',
    copy:
      'Built for the tunnel crews who treat guardrails like suggestions. Light, sharp, and unforgiving on cold rubber.',
    stats: { power: 78, grip: 92, boost: 70 },
    color: 0x6eb5ff,
    accent: 0x224466,
    maxSpeed: 118,
    accel: 42,
    grip: 1.08,
    boostPower: 1.35,
  },
  {
    id: 'vanta',
    name: 'Vanta LM',
    tagline: 'Midnight balanced. Always on edge.',
    theme: 'cold',
    copy:
      'The magazine\'s pick for Harbor Line. Enough power to stay in the fight, enough grip to survive the kink at tunnel exit.',
    stats: { power: 85, grip: 85, boost: 80 },
    color: 0x8899aa,
    accent: 0x222830,
    maxSpeed: 122,
    accel: 38,
    grip: 1.0,
    boostPower: 1.4,
  },
  {
    id: 'noctis',
    name: 'Noctis GT',
    tagline: 'Warm asphalt. Flash bulbs. No rules.',
    theme: 'warm',
    copy:
      'Street-meet royalty. Wide tires, loud exhaust, and a paint job that still remembers every wall you kissed last winter.',
    stats: { power: 95, grip: 72, boost: 88 },
    color: 0xffb86a,
    accent: 0x442211,
    maxSpeed: 128,
    accel: 45,
    grip: 0.88,
    boostPower: 1.5,
  },
];

export function statBar(value) {
  return `<div class="bar"><span style="width:${value}%"></span></div>`;
}
