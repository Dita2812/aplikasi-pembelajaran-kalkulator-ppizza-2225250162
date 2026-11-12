// Halaman Belajar: materi bertahap, satu ide per layar, dengan cek paham di setiap langkah.
import { MATERI } from './data.js';
import { createPizzaScene } from './pizza3d.js';
import { fmt, PI } from './util.js';
import { saveResult } from './store.js';
import * as audio from './audio.js';
import { confetti } from './confetti.js';
import { mascot, speech } from './mascot.js';

const diagram = () => `
<svg viewBox="0 0 320 240" role="img" aria-label="Lingkaran dengan pusat O, jari-jari r, dan diameter d">
  <circle cx="160" cy="120" r="95" style="fill:var(--soft);stroke:var(--a)" stroke-width="5"/>
  <line x1="65" y1="120" x2="255" y2="120" style="stroke:var(--b)" stroke-width="3" stroke-dasharray="7 5"/>
  <line x1="160" y1="120" x2="227.2" y2="52.8" style="stroke:var(--fg)" stroke-width="3"/>
  <circle cx="160" cy="120" r="4.5" style="fill:var(--fg)"/>
  <text x="150" y="141" text-anchor="end">O</text>
  <text x="204" y="106">r</text>
  <text x="108" y="112" text-anchor="middle">d</text>
</svg>`;

const keliling = () => {
  const d = 72, x0 = 110, y = 62;
  const bar = (i, c) =>
    `<line x1="${x0 + i * d}" y1="${y}" x2="${x0 + (i + 1) * d}" y2="${y}" style="stroke:var(${c})" stroke-width="9"/>
     <text x="${x0 + i * d + d / 2}" y="${y - 14}" text-anchor="middle">d</text>`;
  const rest = x0 + 3 * d;
  return `
<svg viewBox="0 0 360 140" role="img" aria-label="Keliling lingkaran dibentangkan sepanjang tiga kali diameter ditambah sedikit">
  <circle cx="52" cy="${y}" r="36" style="fill:var(--soft);stroke:var(--a)" stroke-width="5"/>
  <line x1="16" y1="${y}" x2="88" y2="${y}" style="stroke:var(--b)" stroke-width="3" stroke-dasharray="6 4"/>
  ${bar(0, '--b')}${bar(1, '--fg')}${bar(2, '--b')}
  <line x1="${rest}" y1="${y}" x2="${rest + 0.14 * d}" y2="${y}" style="stroke:var(--a)" stroke-width="9"/>
  <text x="${rest + 8}" y="${y + 26}" text-anchor="middle">0,14 d</text>
  <text x="${x0}" y="124" style="font-size:13px">Keliling ≈ 3,14 × d</text>
</svg>`;
};

function mountPizza(el) {
  el.innerHTML = `
    <div class="stage3d" id="stage"></div>
    <div class="field">
      <label for="dd">Diameter pizza: <strong id="dv"></strong> cm</label>
      <input type="range" id="dd" min="10" max="50" step="1" value="30" />
    </div>
    <dl class="stats">
      <div><dt>Jari-jari</dt><dd id="sr"></dd></div>
      <div><dt>Keliling</dt><dd id="sk"></dd></div>
      <div><dt>Luas</dt><dd id="sl"></dd></div>
    </dl>
    <p class="muted small">Pakai π = 3,14. Coba geser dari 20 ke 40 cm. Diameter jadi 2 kali, tetapi luas jadi 4 kali.</p>`;
  const scene = createPizzaScene(el.querySelector('#stage'), { count: 1 });
  const range = el.querySelector('#dd');
  const update = () => {
    const d = Number(range.value);
    const r = d / 2;
    scene.setDiameters(d);
    el.querySelector('#dv').textContent = d;
    el.querySelector('#sr').textContent = fmt(r) + ' cm';
    el.querySelector('#sk').textContent = fmt(PI * d) + ' cm';
    el.querySelector('#sl').textContent = fmt(PI * r * r) + ' cm²';
  };
  range.addEventListener('input', update);
  update();
  return () => scene.dispose();
}

const VISUALS = {
  diagram: (el) => {
    el.innerHTML = `<div class="figure">${diagram()}</div>`;
  },
  keliling: (el) => {
    el.innerHTML = `<div class="figure">${keliling()}</div>`;
  },
  pizza3d: mountPizza,
};

export function belajar(container, ctx) {
  let i = 0;
  let cleanup = null;
  const N = MATERI.length;

  function draw() {
    cleanup?.();
    cleanup = null;
    const s = MATERI[i];
    const dots = MATERI.map(
      (_, k) => `<span class="dot ${k < i ? 'done' : k === i ? 'now' : ''}"></span>`
    ).join('');
    container.innerHTML = `
      <section class="stack">
        <div class="dots" role="img" aria-label="Langkah ${i + 1} dari ${N}">${dots}</div>
        <p class="eyebrow">Langkah ${i + 1} dari ${N}</p>
        <h1>${s.judul}</h1>
        <p class="muted">Kak Dit bantu kamu memahami konsep keliling dan luas lingkaran lewat pizza, garis tengah, dan jari-jari.</p>
        ${s.visual ? '<div class="visual" id="visual"></div>' : ''}
        <ul class="poin">${s.poin.map((p) => `<li>${p}</li>`).join('')}</ul>
        ${
          s.contoh
            ? `<div class="contoh"><h2>${s.contoh.judul}</h2><ol>${s.contoh.langkah
                .map((l) => `<li>${l}</li>`)
                .join('')}</ol></div>`
            : ''
        }
        <div class="card cek">
          <h2>Cek paham</h2>
          <p>${s.cek.tanya}</p>
          <div class="opts" id="opts">
            ${s.cek.opsi.map((o, k) => `<button type="button" class="opt" data-k="${k}">${o}</button>`).join('')}
          </div>
          <div class="fb" id="fb" aria-live="polite"></div>
        </div>
        <div class="nav-row">
          <button type="button" class="btn ghost" id="prev" ${i === 0 ? 'disabled' : ''}>Sebelumnya</button>
          <button type="button" class="btn" id="next" disabled>${i === N - 1 ? 'Selesai' : 'Lanjut'}</button>
        </div>
      </section>`;

    if (s.visual) cleanup = VISUALS[s.visual](container.querySelector('#visual')) || null;

    const fb = container.querySelector('#fb');
    const next = container.querySelector('#next');
    container.querySelector('#opts').addEventListener('click', (e) => {
      const btn = e.target.closest('.opt');
      if (!btn || btn.disabled) return;
      if (Number(btn.dataset.k) === s.cek.benar) {
        btn.classList.add('ok');
        container.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        fb.className = 'fb good';
        fb.innerHTML = speech('cheer', '<strong>Benar.</strong> ' + s.cek.jelas);
        audio.sfx('correct');
        confetti();
        next.disabled = false;
        next.focus();
      } else {
        btn.classList.add('bad');
        btn.disabled = true;
        fb.className = 'fb bad';
        fb.innerHTML = speech('oops', 'Belum tepat. Petunjuk: ' + s.cek.petunjuk);
        audio.sfx('wrong');
      }
    });
    container.querySelector('#prev').addEventListener('click', () => {
      i -= 1;
      draw();
    });
    next.addEventListener('click', () => {
      if (i < N - 1) {
        i += 1;
        draw();
        window.scrollTo(0, 0);
      } else {
        finish();
      }
    });
  }

  async function finish() {
    cleanup?.();
    cleanup = null;
    container.innerHTML = `
      <section class="stack">
        <div class="login-mascot">${mascot('cheer', 110)}</div>
        <p class="eyebrow">Materi selesai</p>
        <h1>Kamu sudah menyelesaikan 5 langkah</h1>
        <p>Sekarang uji pemahamanmu dengan soal cerita, atau main dulu dengan pizza.</p>
        <div class="nav-row">
          <a class="btn" href="#latihan">Kerjakan latihan</a>
          <a class="btn ghost" href="#main">Main pizza</a>
        </div>
      </section>`;
    audio.sfx('win');
    confetti(undefined, undefined, 120);
    try {
      await saveResult(ctx.user.code, { kind: 'materi', score: N, total: N });
    } catch {
      /* gagal simpan tidak mengganggu belajar */
    }
  }

  draw();
  return () => cleanup?.();
}
