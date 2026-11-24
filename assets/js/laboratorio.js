// ═══════════════════════════════════════════════
// ACTAL — LABORATÓRIO DE TELEMETRIA / PROVA DO MODELO
// Dataset sintético: demonstra pipeline sensor -> biometria -> hash -> bloco -> CEO -> ação.
// Não representa mineração real de criptomoeda nem dados biométricos reais.
// ═══════════════════════════════════════════════
const actalLabData = [
  {id:'EVT-001',sensor:'Acelerômetro',vibration:0.32,door:'OK',belt:92,intercom:true,occupancy:18,people:1,biometric:'BIO-SIM-A1',panic:0.05,severity:'NORMAL'},
  {id:'EVT-002',sensor:'Porta',vibration:0.48,door:'ATRASO',belt:88,intercom:true,occupancy:52,people:3,biometric:'BIO-SIM-B7',panic:0.18,severity:'ATENÇÃO'},
  {id:'EVT-003',sensor:'Cinta',vibration:1.12,door:'OK',belt:61,intercom:true,occupancy:68,people:4,biometric:'BIO-SIM-C4',panic:0.42,severity:'ALERTA'},
  {id:'EVT-004',sensor:'Acelerômetro',vibration:2.80,door:'TRAVADA',belt:54,intercom:true,occupancy:85,people:3,biometric:'BIO-SIM-PANIC',panic:0.97,severity:'CRÍTICO'}
];
let actalLabIndex = 0;

function actalLabHash(text) {
  // Hash didático determinístico para visualização. Produção deve usar SHA-256/assinatura real.
  let h1 = 0x811c9dc5, h2 = 0x9e3779b9;
  for (let i=0;i<text.length;i++) { h1 = Math.imul(h1 ^ text.charCodeAt(i), 16777619); h2 = Math.imul(h2 ^ text.charCodeAt(i), 2246822519); }
  return '0x' + (h1>>>0).toString(16).padStart(8,'0') + (h2>>>0).toString(16).padStart(8,'0');
}

function runActalLab() {
  const e = actalLabData[actalLabIndex++ % actalLabData.length];
  const payload = JSON.stringify(e);
  const hash = actalLabHash(payload);
  const bioHash = actalLabHash(e.biometric + ':' + e.id);
  const u = Math.min(1, e.vibration / 3);
  const p = e.people > 0 ? 1 : 0;
  const context = Math.min(1, (e.occupancy/100 + e.panic)/2);
  const history = e.severity === 'CRÍTICO' ? .9 : e.severity === 'ALERTA' ? .65 : .2;
  const pi = .35*u + .30*p + .20*context + .15*history;
  const action = pi >= .75 ? 'INTERDIÇÃO + DESPACHO IMEDIATO' : pi >= .5 ? 'ATENDIMENTO URGENTE' : pi >= .25 ? 'INSPEÇÃO / AGENDAMENTO' : 'MONITORAMENTO';
  const box = document.getElementById('actalLabOutput');
  if (box) box.innerHTML =
    '<div><b>1. TELEMETRIA RECEBIDA</b> · '+e.id+' · '+e.sensor+' · vibração '+e.vibration.toFixed(2)+'g · porta '+e.door+' · ocupação '+e.occupancy+'%</div>'+
    '<div><b>2. BIOMETRIA SINTÉTICA</b> · '+e.biometric+' → hash '+bioHash+'</div>'+
    '<div><b>3. “MINERAÇÃO” DIDÁTICA</b> · payload serializado → hash '+hash+' → bloco candidato criado</div>'+
    '<div><b>4. DTL</b> · registro encadeado/auditável representado no ledger</div>'+
    '<div><b>5. CEO</b> · Pᵢ='+pi.toFixed(3)+' · '+e.severity+'</div>'+
    '<div><b>6. RESULTADO</b> · '+action+'</div>';
  // Alimenta as visualizações existentes
  mintBlock();
  document.getElementById('sU').value = Math.round(u*100);
  document.getElementById('sP').value = p;
  document.getElementById('sC').value = Math.round(context*100);
  document.getElementById('sL').value = Math.round(history*100);
  recalc();
  updateOccGauge(e.occupancy);
  if (e.severity === 'CRÍTICO') setTimeout(startPanicSim, 500);
}

// Injeta laboratório imediatamente antes da seção DTL, sem remover nenhuma função existente.
const dtlSection = document.getElementById('dtl');
if (dtlSection) {
  const lab = document.createElement('section');
  lab.id = 'actal-lab';
  lab.className = 'py-5';
  lab.innerHTML = '<div class="container"><div class="glass-card p-4 p-lg-5"><span class="badge rounded-pill mb-3" style="background:rgba(6,182,212,.15);color:#67e8f9">SIMULAÇÃO COM DADOS SINTÉTICOS</span><h2 class="fw-bold">Laboratório ACTAL: telemetria → biometria → bloco → decisão</h2><p class="text-muted">Use dados fictícios para colocar o modelo à prova. A biometria abaixo é sintética e o termo “mineração” demonstra visualmente a criação/validação de registros. O ACTAL não minera criptomoeda real.</p><button class="btn btn-primary mb-4">▶ Executar próximo cenário</button><div id="actalLabOutput" class="p-3 rounded-4" style="background:rgba(2,6,23,.65);font-family:var(--font-mono);line-height:1.9"><div>Aguardando telemetria sintética...</div></div><div class="small text-muted mt-3"><b>Como ler:</b> o dado entra, a identidade biométrica fictícia é transformada em hash, um bloco demonstrativo é criado no DTL, o CEO calcula a prioridade e o ACTAL produz uma ação. Em uma rede permissionada real, a etapa equivalente seria validação/ordenação/commit, não Proof of Work de Bitcoin.</div></div></div>';
  lab.querySelector('button').addEventListener('click', runActalLab);
  dtlSection.parentNode.insertBefore(lab, dtlSection);
}

// Auto-start robot sim
setTimeout(startRobotSim, 2000);
