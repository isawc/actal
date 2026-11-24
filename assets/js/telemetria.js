// ═══════════════════════════════════════════════
// DTL — BLOCKCHAIN
// ═══════════════════════════════════════════════
let bCount = 0;
const chain = document.getElementById('chain');
const sensors = [
  { s: 'Acelerômetro', ch: 'Auditoria Mecânica' },
  { s: 'Op. Porta', ch: 'Falha de Portas' },
  { s: 'Cinto Flexível', ch: 'Aud. Construtora' },
  { s: 'Interfone', ch: 'Proteção de Vida' }
];

function rHash() { return '0x' + Array.from({length:16}, () => Math.floor(Math.random()*16).toString(16)).join(''); }

function mintBlock() {
  bCount++;
  const sn = sensors[Math.floor(Math.random()*sensors.length)];
  const val = Math.random();
  const cls = val > 0.7 ? 'v-crit' : val > 0.4 ? 'v-warn' : 'v-ok';
  const lbl = val > 0.7 ? 'ALERTA' : val > 0.4 ? 'ATENÇÃO' : 'NORMAL';

  const item = document.createElement('div');
  item.className = 'block-item';
  item.innerHTML = `
    ${bCount > 1 ? '<div class="chain-link"><div class="spark"></div></div>' : ''}
    <div class="block-cube" id="bc${bCount}">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="block-id">BLOCO #${String(bCount).padStart(4,'0')}</span>
        <span style="width:8px;height:8px;border-radius:50%;background:var(--c-emerald)"></span>
      </div>
      <div class="block-hash-display">${rHash()}</div>
      <div class="block-row"><span class="k">Sensor</span><span class="v">${sn.s}</span></div>
      <div class="block-row"><span class="k">Canal</span><span class="v">${sn.ch}</span></div>
      <div class="block-row"><span class="k">Status</span><span class="v ${cls}">${lbl}</span></div>
      <div class="block-row"><span class="k">MTBF</span><span class="v">${(Math.random()*2000+500).toFixed(0)}h</span></div>
    </div>
  `;
  chain.appendChild(item);
  requestAnimationFrame(() => {
    const cube = document.getElementById(`bc${bCount}`);
    cube.classList.add('minting');
    setTimeout(() => cube.classList.add('minted'), 50);
  });
  chain.scrollTo({ left: chain.scrollWidth, behavior: 'smooth' });
}

function mintSmartContract() {
  bCount++;
  const item = document.createElement('div');
  item.className = 'block-item';
  item.innerHTML = `
    ${bCount > 1 ? '<div class="chain-link"><div class="spark"></div></div>' : ''}
    <div class="block-cube minted smart-contract" id="bc${bCount}">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="block-id" style="color:var(--c-rose)">SC #${String(bCount).padStart(4,'0')}</span>
        <span style="width:8px;height:8px;border-radius:50%;background:var(--c-rose);box-shadow:0 0 8px var(--c-rose)"></span>
      </div>
      <div class="block-hash-display">${rHash()}</div>
      <div class="block-row"><span class="k">Tipo</span><span class="v v-crit">SMART CONTRACT</span></div>
      <div class="block-row"><span class="k">Ação</span><span class="v v-crit">INTERDIÇÃO</span></div>
      <div class="block-row"><span class="k">RIA Online</span><span class="v v-warn">ENVIADO ✓</span></div>
      <div class="block-row"><span class="k">Jurídico</span><span class="v v-ok">AUTENTICADO</span></div>
    </div>
  `;
  chain.appendChild(item);
  chain.scrollTo({ left: chain.scrollWidth, behavior: 'smooth' });
}

let autoInterval = null;
function autoMine() {
  if (autoInterval) { clearInterval(autoInterval); autoInterval = null; return; }
  autoInterval = setInterval(() => { Math.random() > 0.8 ? mintSmartContract() : mintBlock(); }, 1800);
}

// Init blocks
setTimeout(mintBlock, 400);
setTimeout(mintBlock, 900);
setTimeout(mintBlock, 1400);

// ═══════════════════════════════════════════════
// TELEMETRY
// ═══════════════════════════════════════════════
const teleData = [
  { icon: '📳', name: 'Vibração & Desaceleração', desc: 'Acelerômetro → Auditoria Mecânica', color: '#6366f1' },
  { icon: '🚪', name: 'Corrente de Travamento', desc: 'Op. Porta → Falha de Portas', color: '#06b6d4' },
  { icon: '🔩', name: 'Tensão Cintas Planas', desc: 'Cinto Flexível → Aud. Construtora', color: '#10b981' },
  { icon: '📞', name: 'Continuidade Interfone', desc: 'Loop Analógico → Proteção de Vida', color: '#f59e0b' }
];

const teleGrid = document.getElementById('teleGrid');
teleData.forEach((t, i) => {
  teleGrid.innerHTML += `
    <div class="col-sm-6 col-lg-3">
      <div class="tele-card">
        <div class="tele-icon" style="background:${t.color}18">${t.icon}</div>
        <h6 class="fw-bold small">${t.name}</h6>
        <p class="small text-muted mb-0">${t.desc}</p>
        <div class="tele-bar"><div class="tele-bar-fill" id="tb${i}" style="width:0%;background:${t.color}"></div></div>
      </div>
    </div>
  `;
});

function animTele() {
  teleData.forEach((_, i) => {
    document.getElementById(`tb${i}`).style.width = (25 + Math.random() * 70) + '%';
  });
}
setInterval(animTele, 2000);
setTimeout(animTele, 800);

document.getElementById('btnMintBlock').addEventListener('click', mintBlock);
document.getElementById('btnMintSmartContract').addEventListener('click', mintSmartContract);
document.getElementById('btnAutoMine').addEventListener('click', autoMine);
