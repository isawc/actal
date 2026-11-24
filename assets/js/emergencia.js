// ═══════════════════════════════════════════════
// PANIC SIMULATION
// ═══════════════════════════════════════════════
const panicShaft = document.getElementById('panicShaft');
const panicCabin = document.getElementById('panicCabin');
const panicTimeline = document.getElementById('panicTimeline');
const panicFloorCount = 6;

// Build shaft
for (let f = panicFloorCount; f >= 1; f--) {
  const people = f === 3 ? '👤👤👩' : (Math.random() > 0.6 ? '👤' : '');
  panicShaft.innerHTML += `
    <div class="shaft-floor" id="pf-${f}">
      <span class="floor-num">${f}F</span>
      <div class="floor-people" id="pfp-${f}">${people}</div>
    </div>
  `;
}

let panicRunning = false;
function movePanicCabin(floor) {
  const top = (panicFloorCount - floor) * 81 + 5;
  panicCabin.style.top = top + 'px';
  document.getElementById('panicCabinLabel').textContent = floor + 'F';
}

function addPanicEvent(color, icon, title, desc, isActive) {
  const ev = document.createElement('div');
  ev.className = 'status-event';
  ev.innerHTML = `
    <div class="event-dot-col">
      <div class="event-dot ${isActive ? 'active' : ''}" style="border-color:${color}"></div>
      <div class="event-line"></div>
    </div>
    <div class="event-content">
      <div class="event-time">${new Date().toLocaleTimeString('pt-BR',{hour12:false})}</div>
      <div class="event-text">${icon} ${title}</div>
      <div class="event-desc">${desc}</div>
    </div>
  `;
  panicTimeline.appendChild(ev);
  requestAnimationFrame(() => ev.classList.add('show'));
  panicTimeline.scrollTop = panicTimeline.scrollHeight;
}

function startPanicSim() {
  if (panicRunning) return;
  panicRunning = true;
  const badge = document.getElementById('panicStatus');

  // Clear timeline
  panicTimeline.innerHTML = '';

  // Step 1: Normal operation
  badge.textContent = 'ATIVO'; badge.className = 'badge bg-success rounded-pill px-3 py-2';
  movePanicCabin(1);
  addPanicEvent('var(--c-emerald)', '✅', 'Elevador em operação normal', 'Cabine no 1F, 2 passageiros embarcando.', false);

  // Step 2: Moving up
  setTimeout(() => {
    movePanicCabin(4);
    addPanicEvent('var(--c-cyan)', '🔼', 'Subindo para 4F', 'Chamado registrado no 4º andar. Velocidade nominal.', false);
  }, 2000);

  // Step 3: SENSOR ANOMALY
  setTimeout(() => {
    badge.textContent = '⚠️ ANOMALIA'; badge.className = 'badge bg-warning text-dark rounded-pill px-3 py-2';
    addPanicEvent('var(--c-amber)', '⚠️', 'Anomalia detectada — Sensor de Vibração', 'Acelerômetro registrou desaceleração anômala: 2.8g (limiar: 1.5g). DTL gravando bloco.', true);
  }, 4500);

  // Step 4: CABIN STOPS - PEOPLE TRAPPED
  setTimeout(() => {
    movePanicCabin(3);
    panicCabin.classList.add('panic-mode');
    badge.textContent = '🚨 EMERGÊNCIA'; badge.className = 'badge bg-danger rounded-pill px-3 py-2';
    document.getElementById('panicOcc').textContent = '85%';
    const fppl = document.getElementById('pfp-3');
    fppl.innerHTML = '<span class="person-icon trapped">😰</span><span class="person-icon trapped">😱</span><span class="person-icon trapped">👶</span>';
    addPanicEvent('var(--c-rose)', '🚨', 'PARADA DE EMERGÊNCIA — Passageiros Presos!', '3 passageiros (incluindo 1 criança) retidos entre 3F e 4F. Interfone ativado. Sensor ToF 3D confirma presença humana.', true);
  }, 7000);

  // Step 5: NLP Processing
  setTimeout(() => {
    addPanicEvent('var(--c-cyan)', '🧠', 'CEO → NLP processando chamado de socorro', 'Transcrição do interfone: "Socorro! Estamos presos com uma criança!" — Sentimento: PÂNICO (0.97). Urgência: MÁXIMA.', true);
  }, 9000);

  // Step 6: Priority Calculation
  setTimeout(() => {
    addPanicEvent('var(--c-indigo)', '📊', 'Índice de Prioridade calculado: Pᵢ = 0.94', 'U=0.95 (vibração extrema) · P=1 (passageiros confirmados) · C=0.80 (edifício classe A) · L=0.65 (histórico). → PRIORIDADE CRÍTICA', true);
    // Also update the calculator
    document.getElementById('sU').value = 95; document.getElementById('sP').value = 1;
    document.getElementById('sC').value = 80; document.getElementById('sL').value = 65;
    recalc();
  }, 11500);

  // Step 7: Smart Contract
  setTimeout(() => {
    addPanicEvent('var(--c-violet)', '📜', 'DTL → Smart Contract acionado', 'Bloco criptográfico imutável gerado. Estado do elevador alterado para "INTERDITADO". RIA Online da prefeitura notificada automaticamente.', true);
    mintSmartContract();
  }, 14000);

  // Step 8: Technician Dispatch
  setTimeout(() => {
    addPanicEvent('var(--c-emerald)', '🚗', 'Despacho Técnico — ETA 8 min', 'Técnico Carlos (cert. Otis Gen3™) despachado do furgão #12. Peça OP-4200 confirmada no inventário RFID. Rota otimizada: Av. Atlântica → Rua 3300.', false);
    document.getElementById('etaDisp').textContent = '8 min';
  }, 16500);

  // Step 9: Robot yields
  setTimeout(() => {
    addPanicEvent('var(--c-amber)', '🤖', 'STRAB → Human-Yield Protocol ativado', 'Robô TOMI-A (coleta de lixo, 3F) cancelou travessia vertical. Robô Entrega-03 recuou para zona de espera. Prioridade total para resgate humano.', false);
  }, 19000);

  // Step 10: Rescue
  setTimeout(() => {
    badge.textContent = '✅ RESOLVIDO'; badge.className = 'badge bg-success rounded-pill px-3 py-2';
    panicCabin.classList.remove('panic-mode');
    const fppl = document.getElementById('pfp-3');
    fppl.innerHTML = '<span class="person-icon">😮‍💨</span><span class="person-icon">😊</span><span class="person-icon">👶</span>';
    addPanicEvent('var(--c-emerald)', '✅', 'Passageiros resgatados com sucesso', 'Técnico chegou em 7 min 23s. Porta desbloqueada manualmente. 3 passageiros evacuados sem ferimentos. Elevador permanece interditado até auditoria completa.', true);
  }, 22000);

  // Reset after
  setTimeout(() => { panicRunning = false; }, 24000);
}

document.getElementById('btnPanicStart').addEventListener('click', startPanicSim);
