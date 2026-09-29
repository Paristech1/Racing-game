/** Minimal car / event data for rival-pick tests (subset of afterhours.js). */
export const TEST_CARS = [
  { id: 'kage', name: 'KAGE R', grip: 30, top: 90, nitro: 1.0, mass: 1, rival: 'note' },
  { id: 'vanta', name: 'VANTA LM', grip: 34, top: 86, nitro: 0.9, mass: 1, rival: 'note' },
  { id: 'hellbound', name: 'HELLBOUND', outlaw: true, grip: 25, top: 224, nitro: 0, mass: 1.5, rival: 'note' },
  { id: 'zephyr', name: 'ZEPHYR', grip: 31, top: 429, nitro: 1.45, mass: 0.22, rival: 'note' },
];

export const EVENT_CAR_BIAS = {
  tunnel: { gripW: 1.22, topW: 0.94, nitroW: 1.05 },
  blvd: { gripW: 0.9, topW: 1.12, nitroW: 1.08 },
};

export const RIVAL_CAR_PREF = {
  apex: { gripW: 1.18, topW: 0.98, ids: ['vanta', 'kage'] },
};

export const APEX_RIVAL = {
  id: 'apex',
  tag: 'APEX',
  color: '#9fd3ff',
  P: { line: 1, offScale: 0.15, wobble: 0, risk: 1, rubber: 0.5, gain: 0.3, mass: 1, seek: 0.35, nitro: 'exit' },
};

export const KO_MODS = [
  { id: 'clean', name: 'Clean Round' },
  { id: 'double', name: 'Double Knockout', min: 5 },
  { id: 'bomb', name: 'Time Bomb', min: 5 },
  { id: 'nitro', name: 'Nitro Rain' },
];

export const KO_FINAL = { id: 'final', name: 'Final Duel' };
