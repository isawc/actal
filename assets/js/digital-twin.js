// ═══════════════════════════════════════════════
// DIGITAL TWIN 3D — THREE.JS
// ═══════════════════════════════════════════════
const twinModes = {
  normal: { label: 'Operação premium', occ: 42, pi: 0.28, ledger: 3, speed: 1, color: 0x67e8f9, alarm: false, people: 10 },
  rush: { label: 'Pico humano', occ: 88, pi: 0.63, ledger: 8, speed: 0.72, color: 0xfbbf24, alarm: false, people: 24 },
  robots: { label: 'Robôs via OID', occ: 55, pi: 0.41, ledger: 5, speed: 0.9, color: 0x34d399, alarm: false, people: 14 },
  emergency: { label: 'Emergência ACTAL', occ: 85, pi: 0.94, ledger: 16, speed: 0.38, color: 0xfb7185, alarm: true, people: 20 }
};

const twinState = { mode: 'normal' };
let twinScene = null;

function setTwinMode(mode, btn) {
  twinState.mode = mode;
  document.querySelectorAll('.twin-control').forEach(control => control.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateTwinHud();
  updateTwinVisuals();
}

function updateTwinHud() {
  const mode = twinModes[twinState.mode];
  const modeLabel = document.getElementById('twinModeLabel');
  if (!modeLabel) return;
  modeLabel.textContent = mode.label;
  document.getElementById('twinOccLabel').textContent = mode.occ + '%';
  document.getElementById('twinPiLabel').textContent = mode.pi.toFixed(2);
  document.getElementById('twinLedgerLabel').textContent = mode.ledger + ' blocos/min';
}

function updateTwinVisuals() {
  if (!twinScene) return;
  const mode = twinModes[twinState.mode];
  twinScene.cabins.forEach((cabin, i) => {
    cabin.material.color.setHex(mode.alarm && i === 1 ? 0xfb7185 : mode.color);
    cabin.material.emissive.setHex(mode.alarm && i === 1 ? 0x7f1d1d : 0x083344);
  });
  twinScene.pulses.forEach(pulse => {
    pulse.material.color.setHex(mode.color);
    pulse.material.emissive.setHex(mode.color);
  });
  twinScene.people.forEach((person, i) => {
    person.visible = i < mode.people;
    person.material.color.setHex(mode.alarm ? 0xfef3c7 : 0xdbeafe);
  });
  twinScene.robots.forEach(robot => {
    robot.visible = twinState.mode === 'robots' || twinState.mode === 'rush' || twinState.mode === 'emergency';
    robot.material.color.setHex(twinState.mode === 'emergency' ? 0xf59e0b : 0x34d399);
  });
  twinScene.beacon.material.color.setHex(mode.alarm ? 0xfb7185 : 0x67e8f9);
  twinScene.beacon.material.emissive.setHex(mode.alarm ? 0xfb7185 : 0x67e8f9);
}

function initDigitalTwin() {
  const canvas = document.getElementById('twinCanvas');
  if (!canvas) return;
  const fallback = document.getElementById('twinFallback');
  if (!window.THREE) {
    if (fallback) fallback.style.display = 'flex';
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08111f, 12, 34);

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  camera.position.set(7.8, 7.2, 12.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const ambient = new THREE.AmbientLight(0xffffff, 0.64);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0x9bdcff, 1.8);
  key.position.set(5, 9, 7);
  scene.add(key);
  const rim = new THREE.PointLight(0x67e8f9, 2.6, 22);
  rim.position.set(-5, 5, 6);
  scene.add(rim);

  const root = new THREE.Group();
  root.position.y = -2.2;
  scene.add(root);

  const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.12, roughness: 0.25, metalness: 0.3 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.35 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.2 });
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x083344, emissiveIntensity: 0.75, roughness: 0.28, metalness: 0.35 });
  const robotMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x052e1a, emissiveIntensity: 0.45, roughness: 0.4, metalness: 0.2 });
  const peopleMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, emissive: 0x111827, emissiveIntensity: 0.1 });
  const pulseMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x67e8f9, emissiveIntensity: 1.8 });

  const cabins = [];
  const cabinBases = [];
  const robots3d = [];
  const people3d = [];
  const pulses = [];

  for (let floor = 0; floor < 8; floor++) {
    const deck = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.035, 5.2), floorMat);
    deck.position.set(0, floor * 1.05, 0);
    deck.material.transparent = true;
    deck.material.opacity = floor % 2 === 0 ? 0.34 : 0.2;
    root.add(deck);
  }

  [-3, 0, 3].forEach((x, i) => {
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.55, 8.3, 1.65), glassMat);
    shaft.position.set(x, 3.65, 0);
    root.add(shaft);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(shaft.geometry), lineMat);
    edges.position.copy(shaft.position);
    root.add(edges);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.9, 1.18), cabinMat.clone());
    cabin.position.set(x, 0.8 + i * 1.8, 0);
    root.add(cabin);
    cabins.push(cabin);
    cabinBases.push(0.7 + i * 1.55);

    for (let j = 0; j < 3; j++) {
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.09, 18, 18), pulseMat.clone());
      pulse.position.set(x + 0.62, j * 2.1, 0.78);
      root.add(pulse);
      pulses.push(pulse);
    }
  });

  for (let i = 0; i < 4; i++) {
    const robot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.42), robotMat.clone());
    robot.position.set(-4 + i * 1.4, 0.25, 2.55);
    root.add(robot);
    robots3d.push(robot);
  }

  for (let i = 0; i < 28; i++) {
    const person = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), peopleMat.clone());
    const floor = i % 7;
    const lane = Math.floor(i / 7);
    person.position.set(-4.1 + lane * 2.65 + (i % 2) * 0.28, floor * 1.05 + 0.22, -2.25 + (i % 3) * 0.35);
    root.add(person);
    people3d.push(person);
  }

  const beacon = new THREE.Mesh(new THREE.TorusGeometry(4.9, 0.018, 8, 120), pulseMat.clone());
  beacon.rotation.x = Math.PI / 2;
  beacon.position.y = 3.7;
  root.add(beacon);

  const resizeTwin = () => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(420, rect.height || 560);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resizeTwin();
  window.addEventListener('resize', resizeTwin);

  twinScene = { scene, camera, renderer, root, cabins, cabinBases, robots: robots3d, people: people3d, pulses, beacon };
  updateTwinHud();
  updateTwinVisuals();

  const clock = new THREE.Clock();
  function animateTwin() {
    const t = clock.getElapsedTime();
    const mode = twinModes[twinState.mode];
    root.rotation.y = Math.sin(t * 0.18) * 0.08;
    cabins.forEach((cabin, i) => {
      const travel = (Math.sin(t * mode.speed * (0.65 + i * 0.08) + i * 1.9) + 1) * 3.15;
      cabin.position.y = 0.55 + travel;
      cabin.rotation.y = Math.sin(t + i) * 0.03;
    });
    robots3d.forEach((robot, i) => {
      robot.position.x = -4 + ((t * 0.6 + i * 1.6) % 8);
      robot.position.z = 2.25 + Math.sin(t * 1.2 + i) * 0.28;
      robot.rotation.y += 0.02;
    });
    pulses.forEach((pulse, i) => {
      pulse.position.y = ((t * (1.4 + mode.speed) + i * 0.9) % 7.5) + 0.15;
      pulse.scale.setScalar(0.75 + Math.sin(t * 4 + i) * 0.25);
    });
    people3d.forEach((person, i) => {
      person.position.y += Math.sin(t * 2.2 + i) * 0.0008;
    });
    beacon.scale.setScalar(mode.alarm ? 1 + Math.sin(t * 7) * 0.08 : 1 + Math.sin(t * 2) * 0.025);
    camera.lookAt(0, 2.3, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animateTwin);
  }
  animateTwin();
}

initDigitalTwin();

document.querySelectorAll('.twin-control[data-mode]').forEach(button => {
  button.addEventListener('click', () => setTwinMode(button.dataset.mode, button));
});
