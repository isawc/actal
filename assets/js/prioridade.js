// ═══════════════════════════════════════════════
// CEO — PRIORITY CALCULATOR
// ═══════════════════════════════════════════════
const W = { u: 0.35, p: 0.30, c: 0.20, l: 0.15 };
function recalc() {
  const u = document.getElementById('sU').value / 100;
  const p = parseInt(document.getElementById('sP').value);
  const c = document.getElementById('sC').value / 100;
  const l = document.getElementById('sL').value / 100;
  document.getElementById('vU').textContent = u.toFixed(2);
  document.getElementById('vP').textContent = p;
  document.getElementById('vC').textContent = c.toFixed(2);
  document.getElementById('vL').textContent = l.toFixed(2);

  const pi = W.u * u + W.p * p + W.c * c + W.l * l;
  const piNum = document.getElementById('piNum');
  const piLvl = document.getElementById('piLvl');
  piNum.textContent = pi.toFixed(2);

  if (pi >= 0.75) {
    piNum.style.background = 'linear-gradient(135deg,#f43f5e,#ec4899)';
    piNum.style.webkitBackgroundClip = 'text'; piNum.style.backgroundClip = 'text';
    piLvl.className = 'pi-level pi-critical'; piLvl.textContent = '🚨 Crítica — Despacho Imediato';
  } else if (pi >= 0.5) {
    piNum.style.background = 'linear-gradient(135deg,#f59e0b,#f97316)';
    piNum.style.webkitBackgroundClip = 'text'; piNum.style.backgroundClip = 'text';
    piLvl.className = 'pi-level pi-high'; piLvl.textContent = '⚠️ Alta — Urgente';
  } else if (pi >= 0.25) {
    piNum.style.background = 'var(--grad-ceo)';
    piNum.style.webkitBackgroundClip = 'text'; piNum.style.backgroundClip = 'text';
    piLvl.className = 'pi-level pi-medium'; piLvl.textContent = '📋 Média — Agendamento';
  } else {
    piNum.style.background = 'linear-gradient(135deg,#10b981,#22c55e)';
    piNum.style.webkitBackgroundClip = 'text'; piNum.style.backgroundClip = 'text';
    piLvl.className = 'pi-level pi-low'; piLvl.textContent = '✓ Baixa — Preventiva';
  }

  const eta = Math.max(5, Math.round(30 - pi * 25));
  document.getElementById('etaDisp').textContent = eta + ' min';
}
recalc();

document.querySelectorAll('#ceo input[type="range"]').forEach(input => {
  input.addEventListener('input', recalc);
});
