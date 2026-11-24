// ═══════════════════════════════════════════════
// INIT AOS
// ═══════════════════════════════════════════════
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

// ═══════════════════════════════════════════════
// PARTICLES BACKGROUND
// ═══════════════════════════════════════════════
tsParticles.load("particles-bg", {
  fullScreen: false,
  particles: {
    number: { value: 60, density: { enable: true, area: 1000 } },
    color: { value: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f43f5e", "#f59e0b"] },
    shape: { type: "circle" },
    opacity: { value: { min: 0.05, max: 0.15 }, animation: { enable: true, speed: 0.8, minimumValue: 0.03 } },
    size: { value: { min: 2, max: 6 }, animation: { enable: true, speed: 2, minimumValue: 1 } },
    move: { enable: true, speed: 0.6, direction: "none", outModes: "bounce" },
    links: { enable: true, distance: 130, color: "#6366f1", opacity: 0.06, width: 1 }
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "grab" } },
    modes: { grab: { distance: 180, links: { opacity: 0.15 } } }
  }
});

// ═══════════════════════════════════════════════
// FLOATING FORMULAS BACKGROUND
// ═══════════════════════════════════════════════
const formulas = [
  'MTBF = Σ(t_falha - t_reparo) / n',
  'Pᵢ = w₁·U + w₂·P + w₃·C + w₄·L',
  'B = (α·U_tarefa + β·ΔT) / (SoC + ε)',
  'Σwᵢ = 1.0',
  'Hash(n) = SHA256(Block_n-1)',
  'Ocupação > 75% → Yield',
  'ETA = f(trânsito, distância, Pᵢ)',
  'SmartContract.execute()',
  'DTL → CEO → STRAB',
  'ToF3D.scan() → volumetria'
];
const formulaColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#f97316', '#a855f7'];
const formulaBg = document.getElementById('formulaBg');

function spawnFormula() {
  const el = document.createElement('div');
  el.className = 'floating-formula';
  el.textContent = formulas[Math.floor(Math.random() * formulas.length)];
  el.style.left = Math.random() * 90 + '%';
  el.style.color = formulaColors[Math.floor(Math.random() * formulaColors.length)];
  el.style.fontSize = (12 + Math.random() * 8) + 'px';
  el.style.animationDuration = (18 + Math.random() * 20) + 's';
  el.style.animationDelay = '0s';
  formulaBg.appendChild(el);
  setTimeout(() => el.remove(), 40000);
}
setInterval(spawnFormula, 2500);
for (let i = 0; i < 8; i++) setTimeout(spawnFormula, i * 600);

// ═══════════════════════════════════════════════
// NAVBAR SCROLL
// ═══════════════════════════════════════════════
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
});

// ═══════════════════════════════════════════════
// GSAP ANIMATIONS
// ═══════════════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

// Pipeline cards glow cycle
const pipeCards = document.querySelectorAll('.pipeline-card');
let pipeStep = 0;
setInterval(() => {
  pipeCards.forEach((c, i) => {
    c.style.boxShadow = i === pipeStep ? '0 0 30px rgba(6,182,212,0.2)' : 'var(--shadow-card)';
    c.style.borderColor = i === pipeStep ? 'var(--c-cyan)' : 'var(--border-glass)';
  });
  pipeStep = (pipeStep + 1) % pipeCards.length;
}, 2500);
