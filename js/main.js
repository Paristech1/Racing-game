import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CARS, statBar } from './cars.js';
import { EVENTS, getTrackPoints } from './tracks.js';

const STORAGE_KEY = 'afterhours_issue01';

const screens = {
  cover: document.getElementById('screen-cover'),
  select: document.getElementById('screen-select'),
  loading: document.getElementById('screen-loading'),
  race: document.getElementById('screen-race'),
  results: document.getElementById('screen-results'),
};

const canvas = document.getElementById('game-canvas');
const hud = {
  lap: document.getElementById('hud-lap'),
  pos: document.getElementById('hud-pos'),
  time: document.getElementById('hud-time'),
  walls: document.getElementById('hud-walls'),
  boost: document.getElementById('boost-fill'),
  draft: document.getElementById('draft-indicator'),
};

let state = 'cover';
let carIndex = 0;
let eventId = 'tunnel';
let renderer, scene, camera, composer;
let track = null;
let eventConfig = EVENTS.tunnel;
let cars = [];
let playerIndex = 0;
let raceClock = 0;
let raceFinished = false;
let ghostLine = null;
let trafficMeshes = [];
let coverAnim = { t: 0 };

const input = {
  steer: 0,
  brake: false,
  boost: false,
  keys: {},
};

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle('active', k === name));
  state = name;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

function flashPage() {
  const page = document.getElementById('car-page');
  const overlay = document.getElementById('flash-overlay');
  page.classList.add('flash');
  overlay.classList.remove('hidden');
  overlay.classList.add('show');
  setTimeout(() => {
    page.classList.remove('flash');
    overlay.classList.remove('show');
    overlay.classList.add('hidden');
  }, 120);
}

function renderCarSelect() {
  const car = CARS[carIndex];
  const data = loadData();
  const history = data[car.id] || { races: 0, best: null, walls: 0, wins: 0 };

  document.getElementById('car-name').textContent = car.name;
  document.getElementById('car-tagline').textContent = car.tagline;
  document.getElementById('car-copy').textContent = car.copy;
  document.getElementById('select-page-num').textContent = `${String(carIndex + 1).padStart(2, '0')} / 03`;
  document.getElementById('car-page').classList.toggle('warm', car.theme === 'warm');

  document.getElementById('car-stats').innerHTML = `
    <div><dt>PWR</dt>${statBar(car.stats.power)}<dd>${car.stats.power}</dd></div>
    <div><dt>GRP</dt>${statBar(car.stats.grip)}<dd>${car.stats.grip}</dd></div>
    <div><dt>BST</dt>${statBar(car.stats.boost)}<dd>${car.stats.boost}</dd></div>
  `;

  document.getElementById('car-history').innerHTML = history.races
    ? `Raced ${history.races}× · Best ${history.best ? formatTime(history.best) : '—'} · Walls ${history.walls}${history.wins ? ' · <span style="color:var(--accent)">WIN stamp</span>' : ''}`
    : 'No races logged for this machine.';
}

function buildTrack(points) {
  const samples = [];
  const segLens = [];
  let total = 0;

  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    for (let s = 0; s < 8; s++) {
      const t = s / 8;
      const x = catmull(p0.x, p1.x, p2.x, p3.x, t);
      const z = catmull(p0.z, p1.z, p2.z, p3.z, t);
      const w = catmull(p0.width || 14, p1.width || 14, p2.width || 14, p3.width || 14, t);
      if (samples.length) {
        const prev = samples[samples.length - 1];
        const dx = x - prev.x;
        const dz = z - prev.z;
        const len = Math.hypot(dx, dz) || 0.001;
        segLens.push(len);
        total += len;
      }
      samples.push({ x, z, width: w, boulevard: p1.boulevard });
    }
  }

  return { points, samples, segLens, totalLength: total, closed: true };
}

function catmull(p0, p1, p2, p3, t) {
  return (
    0.5 *
    (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  );
}

function sampleAt(trackData, dist) {
  const { samples, segLens, totalLength, closed } = trackData;
  let d = dist;
  if (closed) d = ((d % totalLength) + totalLength) % totalLength;
  else d = Math.max(0, Math.min(totalLength - 0.001, d));

  let acc = 0;
  for (let i = 0; i < segLens.length; i++) {
    if (acc + segLens[i] >= d) {
      const t = (d - acc) / segLens[i];
      const a = samples[i];
      const b = samples[i + 1];
      const x = a.x + (b.x - a.x) * t;
      const z = a.z + (b.z - a.z) * t;
      const width = a.width + (b.width - a.width) * t;
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz) || 1;
      const tx = dx / len;
      const tz = dz / len;
      const nx = -tz;
      const nz = tx;
      const curvature = estimateCurvature(trackData, i, t);
      return { x, z, width, tx, tz, nx, nz, curvature };
    }
    acc += segLens[i];
  }
  const last = samples[samples.length - 1];
  return { x: last.x, z: last.z, width: last.width, tx: 0, tz: -1, nx: 1, nz: 0, curvature: 0 };
}

function estimateCurvature(trackData, segIndex, t) {
  const { samples } = trackData;
  const i0 = Math.max(0, segIndex - 2);
  const i1 = Math.min(samples.length - 1, segIndex + 3);
  const a = samples[i0];
  const b = samples[i1];
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  const tx = dx / len;
  const tz = dz / len;
  const iMid = segIndex;
  const c = samples[Math.min(samples.length - 1, iMid + 1)];
  const ddx = c.x - a.x;
  const ddz = c.z - a.z;
  const len2 = Math.hypot(ddx, ddz) || 1;
  const dot = (ddx / len2) * tx + (ddz / len2) * tz;
  return (1 - Math.max(-1, Math.min(1, dot))) * 2 + t * 0.01;
}

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 600);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.35, 0.88);
  composer.addPass(bloom);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });
}

function clearScene() {
  while (scene.children.length) scene.remove(scene.children[0]);
  trafficMeshes = [];
  ghostLine = null;
}

function buildEnvironment() {
  scene.fog = new THREE.FogExp2(eventConfig.fogColor, eventConfig.fog);
  scene.background = new THREE.Color(eventConfig.fogColor);

  const hemi = new THREE.HemisphereLight(eventConfig.ambient, 0x050508, 0.55);
  scene.add(hemi);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(800, 800),
    new THREE.MeshStandardMaterial({ color: eventConfig.ground, roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  if (eventConfig.buildScene === 'tunnel') buildTunnelScene();
  else buildBoulevardScene();
}

function buildRoadMesh() {
  const { samples } = track;
  const verts = [];
  const uvs = [];
  const indices = [];
  let idx = 0;

  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i];
    const b = samples[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = (-dz / len) * (a.width / 2);
    const nz = (dx / len) * (a.width / 2);
    const bx = (-dz / len) * (b.width / 2);
    const bz = (dx / len) * (b.width / 2);

    verts.push(a.x - nx, 0.02, a.z - nz, a.x + nx, 0.02, a.z + nz, b.x + bx, 0.02, b.z + bz, b.x - bx, 0.02, b.z - bz);
    uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
    indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
    idx += 4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const road = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: 0x151820, roughness: 0.85, metalness: 0.15 })
  );
  scene.add(road);

  // Center line
  const linePts = samples.map((s) => new THREE.Vector3(s.x, 0.04, s.z));
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const lineMat = new THREE.LineBasicMaterial({ color: eventConfig.lineColor, transparent: true, opacity: 0.35 });
  scene.add(new THREE.Line(lineGeo, lineMat));
}

function buildWalls() {
  const { samples } = track;
  const wallH = eventConfig.buildScene === 'tunnel' ? 6 : 0.8;
  for (let i = 0; i < samples.length; i += 4) {
    const s = samples[i];
    const n = sampleAt(track, (i / samples.length) * track.totalLength);
    const half = s.width / 2 + eventConfig.wallOffset;
    for (const side of [-1, 1]) {
      if (eventConfig.buildScene === 'tunnel') {
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, wallH, 8),
          new THREE.MeshStandardMaterial({
            color: 0x1a2535,
            emissive: 0x0a1525,
            emissiveIntensity: 0.3,
            roughness: 0.7,
          })
        );
        wall.position.set(s.x + n.nx * half * side, wallH / 2, s.z + n.nz * half * side);
        wall.lookAt(s.x + n.nx * side + n.tx, wallH / 2, s.z + n.nz * side + n.tz);
        scene.add(wall);
      } else {
        const curb = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.25, 10),
          new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })
        );
        curb.position.set(s.x + n.nx * half * side, 0.12, s.z + n.nz * half * side);
        curb.lookAt(s.x + n.nx * side + n.tx, 0.12, s.z + n.nz * side + n.tz);
        scene.add(curb);
      }
    }
  }
}

function buildTunnelScene() {
  buildRoadMesh();
  buildWalls();

  // Tunnel lights
  for (let d = 0; d < track.totalLength; d += 35) {
    const p = sampleAt(track, d);
    const light = new THREE.PointLight(0x6eb5ff, 12, 45);
    light.position.set(p.x, 4.5, p.z);
    scene.add(light);

    const fixture = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.15, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x334455, emissive: 0x6eb5ff, emissiveIntensity: 2 })
    );
    fixture.position.copy(light.position);
    scene.add(fixture);
  }

  // Ceiling segments
  for (let d = 0; d < track.totalLength; d += 20) {
    const p = sampleAt(track, d);
    const ceil = new THREE.Mesh(
      new THREE.BoxGeometry(p.width + 4, 0.5, 18),
      new THREE.MeshStandardMaterial({ color: 0x0c1218, roughness: 1 })
    );
    ceil.position.set(p.x, 7, p.z);
    ceil.lookAt(p.x + p.tx, 7, p.z + p.tz);
    scene.add(ceil);
  }
}

function buildBuilding(x, z, w, d, h, winColor) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.9 })
  );
  body.position.y = h / 2;
  group.add(body);

  for (let row = 1; row < h - 1; row += 2.2) {
    for (let col = 0; col < w - 1; col += 2) {
      if (Math.random() > 0.35) {
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(0.9, 1.2),
          new THREE.MeshStandardMaterial({
            color: winColor,
            emissive: winColor,
            emissiveIntensity: 0.6 + Math.random() * 0.8,
          })
        );
        win.position.set(-w / 2 + 1 + col, row, d / 2 + 0.01);
        group.add(win);
      }
    }
  }
  group.position.set(x, 0, z);
  scene.add(group);
}

function buildBoulevardScene() {
  buildRoadMesh();
  buildWalls();

  const { samples } = track;
  // Divided median
  for (let i = 0; i < samples.length - 1; i += 2) {
    const s = samples[i];
    const n = sampleAt(track, (i / samples.length) * track.totalLength);
    const median = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a3020, roughness: 0.95 })
    );
    median.position.set(s.x, 0.2, s.z);
    median.lookAt(s.x + n.tx, 0.2, s.z + n.tz);
    scene.add(median);

    // Trees on median
    if (i % 8 === 0) {
      const tree = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 3.5, 6),
        new THREE.MeshStandardMaterial({ color: 0x0f2818, roughness: 1 })
      );
      tree.position.set(s.x + n.nx * 0.5, 1.8, s.z + n.nz * 0.5);
      scene.add(tree);
    }
  }

  // Roadside buildings & lights
  for (let i = 0; i < samples.length; i += 6) {
    const s = samples[i];
    const n = sampleAt(track, (i / samples.length) * track.totalLength);
    const offset = s.width / 2 + 12;

    if (i % 18 === 0) {
      buildBuilding(s.x + n.nx * offset, s.z + n.nz * offset, 14 + Math.random() * 8, 10, 8 + Math.random() * 10, 0xffcc66);
    }
    if (i % 24 === 0) {
      // Traffic signal gantry
      const gantry = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      gantry.position.set(s.x + n.nx * (offset - 4), 2.5, s.z + n.nz * (offset - 4));
      scene.add(gantry);
      const signal = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.2, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x44ff44, emissiveIntensity: 1.5 })
      );
      signal.position.set(s.x + n.nx * (offset - 4), 4.5, s.z + n.nz * (offset - 4));
      scene.add(signal);
    }

    const pole = new THREE.PointLight(0xffaa55, 8, 35);
    pole.position.set(s.x + n.nx * (offset + 3), 5, s.z + n.nz * (offset + 3));
    scene.add(pole);
  }

  spawnTraffic();
}

function spawnTraffic() {
  for (let i = 0; i < 8; i++) {
    const mesh = createCarMesh(0x445566, 0x222833, 0.85);
    mesh.userData.traffic = true;
    mesh.userData.dist = (track.totalLength * i) / 8;
    mesh.userData.speed = 25 + Math.random() * 15;
    scene.add(mesh);
    trafficMeshes.push(mesh);
  }
}

function createCarMesh(color, accent, scale = 1) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8 * scale, 0.5 * scale, 4 * scale),
    new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.35 })
  );
  body.position.y = 0.45 * scale;
  g.add(body);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.4 * scale, 0.35 * scale, 1.8 * scale),
    new THREE.MeshStandardMaterial({ color: accent, metalness: 0.4, roughness: 0.4 })
  );
  cabin.position.set(0, 0.85 * scale, -0.2 * scale);
  g.add(cabin);
  const tail = new THREE.Mesh(
    new THREE.BoxGeometry(1.6 * scale, 0.08 * scale, 0.15 * scale),
    new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff2222, emissiveIntensity: 2 })
  );
  tail.position.set(0, 0.45 * scale, 2 * scale);
  g.add(tail);
  return g;
}

function createRaceCar(carDef, isPlayer) {
  const mesh = createCarMesh(carDef.color, carDef.accent);
  scene.add(mesh);
  return {
    def: carDef,
    mesh,
    isPlayer,
    dist: 0,
    lateral: 0,
    speed: 0,
    lap: 0,
    lapTimes: [],
    lapStart: 0,
    finished: false,
    finishTime: 0,
    wallHits: 0,
    boost: 0.4,
    boostActive: 0,
    place: 1,
    paintWear: loadData()[carDef.id]?.walls || 0,
    aiSkill: 0.85 + Math.random() * 0.12,
    aiOffset: (Math.random() - 0.5) * 0.35,
  };
}

function setupRace() {
  clearScene();
  eventConfig = EVENTS[eventId];
  track = buildTrack(getTrackPoints(eventId));
  buildEnvironment();

  cars = [];
  const playerCar = CARS[carIndex];
  cars.push(createRaceCar(playerCar, true));
  playerIndex = 0;

  const rivals = CARS.filter((_, i) => i !== carIndex).slice(0, 3);
  while (rivals.length < 3) rivals.push(CARS[Math.floor(Math.random() * CARS.length)]);

  rivals.forEach((r, i) => {
    const c = createRaceCar(r, false);
    c.dist = -15 * (i + 1);
    c.aiSkill = 0.82 + i * 0.04;
    cars.push(c);
  });

  // Ghost replay from best lap
  const data = loadData()[playerCar.id];
  if (data?.ghost?.length) {
    const pts = data.ghost.map((g) => new THREE.Vector3(g.x, 0.3, g.z));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    ghostLine = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
    );
    scene.add(ghostLine);
  }

  raceClock = 0;
  raceFinished = false;
  cars.forEach((c) => {
    c.lapStart = 0;
  });
}

function updateCarVisual(car) {
  const p = sampleAt(track, car.dist);
  const half = p.width / 2 - 1.2;
  car.lateral = THREE.MathUtils.clamp(car.lateral, -half, half);

  car.mesh.position.set(p.x + p.nx * car.lateral, 0, p.z + p.nz * car.lateral);
  car.mesh.lookAt(
    car.mesh.position.x + p.tx,
    car.mesh.position.y,
    car.mesh.position.z + p.tz
  );

  const wear = Math.min(0.6, car.paintWear * 0.04);
  car.mesh.children[0].material.color.setHex(car.def.color);
  car.mesh.children[0].material.color.offsetHSL(-wear * 0.02, -wear * 0.3, -wear * 0.15);
}

function updatePlayer(car, dt) {
  const p = sampleAt(track, car.dist);
  const targetSpeed = car.def.maxSpeed;
  const steerInput = input.steer;

  if (input.brake) car.speed -= 80 * dt;
  else car.speed += car.def.accel * dt;

  car.speed = THREE.MathUtils.clamp(car.speed, 0, targetSpeed);

  if (input.boost && car.boost > 0.15 && car.boostActive <= 0) {
    car.boostActive = 0.6;
  }
  if (car.boostActive > 0) {
    car.speed = Math.min(car.speed + 50 * dt, targetSpeed * car.def.boostPower);
    car.boost -= dt * 0.45;
    car.boostActive -= dt;
  }

  const cornerPush = p.curvature * car.speed * 0.0022;
  car.lateral += cornerPush * (car.lateral >= 0 ? 1 : -1) * dt * 60;
  car.lateral += steerInput * car.def.grip * 28 * dt;

  const drift = Math.abs(steerInput) > 0.4 && car.speed > 60;
  if (drift) car.boost = Math.min(1, car.boost + dt * 0.12);

  // Drafting
  let drafting = false;
  for (const other of cars) {
    if (other === car || other.finished) continue;
    const gap = other.dist - car.dist;
    if (gap > 0 && gap < 18 && Math.abs(other.lateral - car.lateral) < 3) {
      drafting = true;
      car.boost = Math.min(1, car.boost + dt * 0.18);
      car.speed = Math.min(car.speed + 8 * dt, targetSpeed * 1.05);
    }
  }
  hud.draft.classList.toggle('hidden', !drafting);

  const half = p.width / 2 - 1;
  if (Math.abs(car.lateral) > half) {
    car.wallHits++;
    car.paintWear++;
    car.speed *= 0.82;
    car.lateral = Math.sign(car.lateral) * half;
  }

  car.dist += car.speed * dt;

  if (!track.closed && car.dist >= track.totalLength) {
    car.lap++;
    if (car.lapTimes.length) car.lapTimes.push(raceClock - car.lapStart);
    car.lapStart = raceClock;
    if (car.lap >= eventConfig.laps) {
      car.finished = true;
      car.finishTime = raceClock;
    } else car.dist = 0;
  } else if (track.closed) {
    const prevLap = Math.floor((car.dist - car.speed * dt) / track.totalLength);
    const curLap = Math.floor(car.dist / track.totalLength);
    if (curLap > prevLap) {
      if (car.lapTimes.length || car.lap > 0) car.lapTimes.push(raceClock - car.lapStart);
      car.lap++;
      car.lapStart = raceClock;
      if (car.lap >= eventConfig.laps) {
        car.finished = true;
        car.finishTime = raceClock;
        car.dist = track.totalLength * eventConfig.laps - 0.01;
      }
    }
  }

  hud.boost.style.width = `${car.boost * 100}%`;
}

function updateAI(car, dt) {
  const p = sampleAt(track, car.dist);
  const targetSpeed = car.def.maxSpeed * car.aiSkill;
  car.speed += (targetSpeed - car.speed) * 2 * dt;
  car.speed = THREE.MathUtils.clamp(car.speed, 0, targetSpeed);

  const cornerPush = p.curvature * car.speed * 0.002;
  car.lateral += cornerPush * dt * 40 + car.aiOffset * dt * 2;
  car.lateral += (car.aiOffset - car.lateral * 0.1) * dt * 3;

  const half = p.width / 2 - 1.2;
  if (Math.abs(car.lateral) > half) {
    car.speed *= 0.88;
    car.lateral = Math.sign(car.lateral) * half;
  }

  car.dist += car.speed * dt;

  if (!track.closed && car.dist >= track.totalLength) {
    car.lap++;
    if (car.lap >= eventConfig.laps) {
      car.finished = true;
      car.finishTime = raceClock;
    } else car.dist = 0;
  } else if (track.closed) {
    const curLap = Math.floor(car.dist / track.totalLength);
    if (curLap >= eventConfig.laps) {
      car.finished = true;
      car.finishTime = raceClock;
      car.dist = track.totalLength * eventConfig.laps - 0.01;
    } else car.lap = curLap;
  }
}

function updateTraffic(dt) {
  trafficMeshes.forEach((m) => {
    m.userData.dist += m.userData.speed * dt;
    if (m.userData.dist > track.totalLength) m.userData.dist = 0;
    const p = sampleAt(track, m.userData.dist);
    m.position.set(p.x + p.nx * 6, 0, p.z + p.nz * 6);
    m.lookAt(m.position.x + p.tx, 0, m.position.z + p.tz);
  });
}

function updatePositions() {
  const sorted = [...cars].sort((a, b) => {
    const progA = a.lap * track.totalLength + a.dist;
    const progB = b.lap * track.totalLength + b.dist;
    return progB - progA;
  });
  sorted.forEach((c, i) => {
    c.place = i + 1;
  });
}

function updateCamera(player) {
  const p = sampleAt(track, player.dist);
  const camDist = 9;
  const camH = 4;
  const target = new THREE.Vector3(player.mesh.position.x, player.mesh.position.y + 1.2, player.mesh.position.z);
  const desired = new THREE.Vector3(
    player.mesh.position.x - p.tx * camDist,
    camH,
    player.mesh.position.z - p.tz * camDist
  );
  camera.position.lerp(desired, 0.08);
  camera.lookAt(target);
}

function updateHUD(player) {
  hud.lap.textContent = `${Math.min(player.lap + 1, eventConfig.laps)} / ${eventConfig.laps}`;
  hud.pos.textContent = `${player.place} / ${cars.length}`;
  hud.time.textContent = formatTime(raceClock);
  hud.walls.textContent = String(player.wallHits);
}

function recordGhost(player) {
  if (!player.isPlayer) return;
  const frames = player.ghostFrames || (player.ghostFrames = []);
  if (raceClock - (player.lastGhostT || 0) > 0.15) {
    frames.push({ x: player.mesh.position.x, z: player.mesh.position.z });
    player.lastGhostT = raceClock;
  }
}

function finishRace() {
  if (raceFinished) return;
  raceFinished = true;
  const player = cars[playerIndex];
  const data = loadData();
  const rec = data[player.def.id] || { races: 0, best: null, walls: 0, wins: 0 };
  rec.races++;
  rec.walls = Math.max(rec.walls, player.wallHits);
  if (!rec.best || player.finishTime < rec.best) {
    rec.best = player.finishTime;
    rec.ghost = player.ghostFrames?.filter((_, i) => i % 2 === 0).slice(0, 200);
  }
  if (player.place === 1) rec.wins++;
  data[player.def.id] = rec;
  saveData(data);

  const headlines = [
    'You took the line.',
    'Tunnel whispers your name.',
    'Boulevard remembers.',
    'Paint traded for position.',
    'Issue closed. You won.',
    'Close fight. Next issue.',
  ];

  document.getElementById('results-headline').textContent =
    player.place === 1 ? headlines[Math.floor(Math.random() * 2) + 3] : headlines[player.place % 3];
  document.getElementById('results-place').textContent = `P${player.place}`;
  document.getElementById('results-time').textContent = formatTime(player.finishTime);
  document.getElementById('results-best').textContent =
    player.lapTimes.length ? formatTime(Math.min(...player.lapTimes)) : formatTime(player.finishTime);
  document.getElementById('results-walls').textContent = String(player.wallHits);
  document.getElementById('results-event').textContent = eventConfig.name;
  document.getElementById('win-stamp').classList.toggle('hidden', player.place !== 1);

  setTimeout(() => showScreen('results'), 800);
}

function updateCover(dt) {
  coverAnim.t += dt;
  if (!scene.children.length) {
    eventConfig = EVENTS.tunnel;
    track = buildTrack(getTrackPoints('tunnel'));
    clearScene();
    buildEnvironment();
    const hero = createCarMesh(CARS[0].color, CARS[0].accent);
    scene.add(hero);
    coverAnim.hero = hero;
  }
  const hero = coverAnim.hero;
  if (hero) {
    const d = (coverAnim.t * 45) % track.totalLength;
    const p = sampleAt(track, d);
    hero.position.set(p.x, 0, p.z);
    hero.lookAt(p.x + p.tx * 10, 0, p.z + p.tz * 10);
  }
  camera.position.set(Math.sin(coverAnim.t * 0.4) * 20, 6, Math.cos(coverAnim.t * 0.3) * 20);
  camera.lookAt(0, 1, 0);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(0.033, clock.getDelta());

  if (state === 'cover') {
    updateCover(dt);
    composer.render();
    return;
  }

  if (state !== 'race' || !track) {
    composer.render();
    return;
  }

  raceClock += dt;
  const player = cars[playerIndex];

  if (!player.finished) {
    updatePlayer(player, dt);
    recordGhost(player);
  }
  cars.forEach((c) => {
    if (!c.isPlayer && !c.finished) updateAI(c, dt);
    updateCarVisual(c);
  });
  if (eventConfig.buildScene === 'boulevard') updateTraffic(dt);
  updatePositions();
  updateCamera(player);
  updateHUD(player);

  if (player.finished) finishRace();

  composer.render();
}

const clock = new THREE.Clock();

function bindInput() {
  window.addEventListener('keydown', (e) => {
    input.keys[e.code] = true;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') input.steer = -1;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') input.steer = 1;
    if (e.code === 'ArrowDown' || e.code === 'KeyS') input.brake = true;
    if (e.code === 'Space') input.boost = true;
  });
  window.addEventListener('keyup', (e) => {
    input.keys[e.code] = false;
    if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) input.steer = 0;
    if (['ArrowDown', 'KeyS'].includes(e.code)) input.brake = false;
    if (e.code === 'Space') input.boost = false;
  });

  const bindTouch = (id, on, off) => {
    const el = document.getElementById(id);
    el.addEventListener('touchstart', (e) => { e.preventDefault(); on(); });
    el.addEventListener('touchend', (e) => { e.preventDefault(); off(); });
    el.addEventListener('mousedown', (e) => { e.preventDefault(); on(); });
    el.addEventListener('mouseup', (e) => { e.preventDefault(); off(); });
  };
  bindTouch('touch-left', () => { input.steer = -1; }, () => { input.steer = 0; });
  bindTouch('touch-right', () => { input.steer = 1; }, () => { input.steer = 0; });
  bindTouch('touch-brake', () => { input.brake = true; }, () => { input.brake = false; });
  bindTouch('touch-boost', () => { input.boost = true; }, () => { input.boost = false; });
}

function bindUI() {
  document.getElementById('btn-open-issue').addEventListener('click', () => {
    renderCarSelect();
    showScreen('select');
  });

  document.getElementById('btn-prev-car').addEventListener('click', () => {
    carIndex = (carIndex - 1 + CARS.length) % CARS.length;
    flashPage();
    setTimeout(renderCarSelect, 60);
  });

  document.getElementById('btn-next-car').addEventListener('click', () => {
    carIndex = (carIndex + 1) % CARS.length;
    flashPage();
    setTimeout(renderCarSelect, 60);
  });

  document.getElementById('event-select').addEventListener('change', (e) => {
    eventId = e.target.value;
  });

  document.getElementById('btn-race').addEventListener('click', () => {
    eventId = document.getElementById('event-select').value;
    eventConfig = EVENTS[eventId];
    document.getElementById('loading-event').textContent = eventConfig.name;
    document.getElementById('loading-car').textContent = CARS[carIndex].name;
    showScreen('loading');

    let p = 0;
    const bar = document.getElementById('loading-bar');
    const iv = setInterval(() => {
      p += 4 + Math.random() * 8;
      bar.style.width = `${Math.min(100, p)}%`;
      if (p >= 100) {
        clearInterval(iv);
        setupRace();
        showScreen('race');
      }
    }, 80);
  });

  document.getElementById('btn-retry').addEventListener('click', () => {
    setupRace();
    showScreen('race');
  });

  document.getElementById('btn-menu').addEventListener('click', () => {
    renderCarSelect();
    showScreen('select');
  });
}

initThree();
bindInput();
bindUI();
showScreen('cover');
animate();
