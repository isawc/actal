// ═══════════════════════════════════════════════
// STRAB — ROBOT SIMULATION
// ═══════════════════════════════════════════════
const robotGrid = document.getElementById('robotGrid');
const robotFeed = document.getElementById('robotFeed');

const robots = [
  { id: 'TOMI-A', task: 'Entrega de medicamentos', battery: 78, emoji: '🤖', floor: 1, bid: 0 },
  { id: 'Limpeza-01', task: 'Coleta de lixo programada', battery: 45, emoji: '🧹', floor: 5, bid: 0 },
  { id: 'Segurança-02', task: 'Ronda de segurança', battery: 92, emoji: '🛡️', floor: 3, bid: 0 },
  { id: 'Entrega-03', task: 'Entrega de encomenda', battery: 33, emoji: '📦', floor: 2, bid: 0 }
];

function renderRobots() {
  robotGrid.innerHTML = '';
  robots.forEach((r, i) => {
    const batColor = r.battery > 50 ? 'var(--c-emerald)' : r.battery > 20 ? 'var(--c-amber)' : 'var(--c-rose)';
    robotGrid.innerHTML += `
      <div class="robot-card" id="rc${i}">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="robot-avatar">${r.emoji}</div>
          <div>
            <h6 class="fw-bold mb-0 small">${r.id}</h6>
            <p class="small text-muted mb-0">${r.task}</p>
          </div>
        </div>
        <div class="d-flex justify-content-between small mb-1">
          <span class="text-muted">Bateria</span>
          <span class="fw-bold" style="font-family:var(--font-mono);color:${batColor}">${r.battery}%</span>
        </div>
        <div class="battery-bar"><div class="battery-fill" style="width:${r.battery}%;background:${batColor}"></div></div>
        <div class="d-flex justify-content-between small mt-2">
          <span class="text-muted">Andar</span>
          <span class="fw-bold" style="font-family:var(--font-mono)">${r.floor}F</span>
        </div>
        ${r.bid > 0 ? `<div class="d-flex justify-content-between small mt-1"><span class="text-muted">Lance</span><span class="fw-bold" style="font-family:var(--font-mono);color:var(--c-emerald)">B=${r.bid.toFixed(3)}</span></div>` : ''}
      </div>
    `;
  });
}
renderRobots();

function addFeed(type, msg) {
  const el = document.createElement('div');
  el.className = `feed-entry ${type}`;
  el.innerHTML = `<div class="feed-time">${new Date().toLocaleTimeString('pt-BR',{hour12:false})}</div><div class="feed-msg">${msg}</div>`;
  robotFeed.appendChild(el);
  robotFeed.scrollTop = robotFeed.scrollHeight;
}

function updateOccGauge(val) {
  const gauge = document.getElementById('occGauge');
  const label = document.getElementById('occLabel');
  const badge = document.getElementById('yieldBadge');
  const off = 314 - (314 * val / 100);
  gauge.style.strokeDashoffset = off;
  label.textContent = val + '%';

  if (val > 75) {
    gauge.style.stroke = 'var(--c-rose)';
    badge.style.background = 'rgba(244,63,94,0.12)'; badge.style.color = 'var(--c-rose)';
    badge.textContent = '🚫 Embarque BLOQUEADO';
  } else if (val > 50) {
    gauge.style.stroke = 'var(--c-amber)';
    badge.style.background = 'rgba(245,158,11,0.12)'; badge.style.color = 'var(--c-amber)';
    badge.textContent = '⏳ Embarque PARCIAL';
  } else {
    gauge.style.stroke = 'var(--c-emerald)';
    badge.style.background = 'rgba(16,185,129,0.12)'; badge.style.color = 'var(--c-emerald)';
    badge.textContent = '✓ Embarque LIBERADO';
  }
}
updateOccGauge(35);

let robotInterval = null;
const taskNames = ['entrega de remédios', 'coleta de lixo', 'ronda noturna', 'entrega expressa', 'inspeção de corredor'];

function startRobotSim() {
  if (robotInterval) return;
  document.getElementById('btnRobotStart').textContent = '⏸️ Simulação Ativa';

  const events = [
    () => {
      const r = robots[Math.floor(Math.random()*robots.length)];
      r.bid = Math.random() * 0.8 + 0.2;
      r.battery = Math.max(5, r.battery - Math.floor(Math.random()*5));
      renderRobots();
      document.getElementById(`rc${robots.indexOf(r)}`).classList.add('bidding');
      setTimeout(() => document.getElementById(`rc${robots.indexOf(r)}`)?.classList.remove('bidding'), 1200);
      addFeed('bid', `<strong>${r.id}</strong> submeteu lance B=${r.bid.toFixed(3)} | Bateria: ${r.battery}% | Tarefa: ${r.task}`);
    },
    () => {
      const occ = Math.floor(Math.random()*100);
      updateOccGauge(occ);
      const action = occ > 75 ? 'ADIAMENTO' : 'LIBERAÇÃO';
      addFeed(occ > 75 ? 'alert' : 'yield', `<strong>Human-Yield:</strong> Ocupação ${occ}% → ${action} de embarque robótico`);
    },
    () => {
      const r = robots[Math.floor(Math.random()*robots.length)];
      r.floor = Math.floor(Math.random()*6)+1;
      renderRobots();
      addFeed('move', `<strong>${r.id}</strong> moveu-se para <strong>${r.floor}F</strong> — Tempo de porta ajustado +2.8s`);
    },
    () => {
      const r = robots[Math.floor(Math.random()*robots.length)];
      addFeed('yield', `<strong>${r.id}</strong> cedeu prioridade — passageiros humanos embarcando no ${Math.floor(Math.random()*6)+1}F`);
    },
    () => {
      const r = robots[Math.floor(Math.random()*robots.length)];
      if (r.battery < 20) {
        addFeed('alert', `<strong>${r.id}</strong> bateria crítica (${r.battery}%) — retornando ao posto de carregamento`);
        r.battery = Math.min(100, r.battery + 40);
        renderRobots();
      } else {
        const dest = Math.floor(Math.random()*6)+1;
        addFeed('move', `<strong>Leilão vencido!</strong> ${r.id} embarca → destino ${dest}F | Perfil de aceleração suavizado`);
      }
    }
  ];

  robotInterval = setInterval(() => {
    events[Math.floor(Math.random()*events.length)]();
  }, 2000);
}

function addNewRobot() {
  const id = 'Bot-' + Math.random().toString(36).substring(2,5).toUpperCase();
  robots.push({ id, task: taskNames[Math.floor(Math.random()*taskNames.length)], battery: 60+Math.floor(Math.random()*40), emoji: '🤖', floor: Math.floor(Math.random()*6)+1, bid: 0 });
  renderRobots();
  addFeed('bid', `<strong>${id}</strong> (NOVO) registrado na frota STRAB. Aguardando atribuição de tarefa.`);
}

function resetRobots() {
  clearInterval(robotInterval); robotInterval = null;
  document.getElementById('btnRobotStart').textContent = '▶️ Iniciar Simulação';
  robots.length = 4;
  robots[0] = { id: 'TOMI-A', task: 'Entrega de medicamentos', battery: 78, emoji: '🤖', floor: 1, bid: 0 };
  robots[1] = { id: 'Limpeza-01', task: 'Coleta de lixo', battery: 45, emoji: '🧹', floor: 5, bid: 0 };
  robots[2] = { id: 'Segurança-02', task: 'Ronda de segurança', battery: 92, emoji: '🛡️', floor: 3, bid: 0 };
  robots[3] = { id: 'Entrega-03', task: 'Entrega de encomenda', battery: 33, emoji: '📦', floor: 2, bid: 0 };
  renderRobots();
  robotFeed.innerHTML = '<div class="feed-entry move"><div class="feed-time">' + new Date().toLocaleTimeString('pt-BR',{hour12:false}) + '</div><div class="feed-msg"><strong>STRAB Reinicializado</strong></div></div>';
  updateOccGauge(35);
}

document.getElementById('btnRobotStart').addEventListener('click', startRobotSim);
document.getElementById('btnRobotAdd').addEventListener('click', addNewRobot);
document.getElementById('btnRobotReset').addEventListener('click', resetRobots);
