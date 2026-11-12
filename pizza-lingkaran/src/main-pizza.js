// Halaman Main: kalkulator perbandingan dua pizza (3D) dan Tantangan Pizza Hemat.
import { createPizzaScene } from './pizza3d.js';
import { fmt, rp, PI, pick } from './util.js';
import { saveResult } from './store.js';
import * as audio from './audio.js';
import { confetti } from './confetti.js';
import { mascot, speech } from './mascot.js';

const area = (d) => PI * (d / 2) * (d / 2);
const per = (d, price) => price / area(d);

function kalkulator(el) {
  el.innerHTML = `
    <div class="stage3d" id="stage"></div>
    <div class="duo">
      <div class="pz a">
        <h2>Pizza A</h2>
        <label for="dA">Diameter: <strong id="vA"></strong> cm</label>
        <input type="range" id="dA" min="10" max="50" step="1" value="20" />
        <label for="pA">Harga (Rp)</label>
        <input type="number" id="pA" inputmode="numeric" min="1000" step="1000" value="40000" />
      </div>
      <div class="pz b">
        <h2>Pizza B</h2>
        <label for="dB">Diameter: <strong id="vB"></strong> cm</label>
        <input type="range" id="dB" min="10" max="50" step="1" value="30" />
        <label for="pB">Harga (Rp)</label>
        <input type="number" id="pB" inputmode="numeric" min="1000" step="1000" value="80000" />
      </div>
    </div>
    <div class="verdict" id="verdict" aria-live="polite"></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th></th><th class="ca">Pizza A</th><th class="cb">Pizza B</th></tr></thead>
        <tbody>
          <tr><th scope="row">Jari-jari</th><td id="rA"></td><td id="rB"></td></tr>
          <tr><th scope="row">Keliling (kerak)</th><td id="kA"></td><td id="kB"></td></tr>
          <tr><th scope="row">Luas (isi)</th><td id="lA"></td><td id="lB"></td></tr>
          <tr class="hl"><th scope="row">Harga per cm²</th><td id="hA"></td><td id="hB"></td></tr>
        </tbody>
      </table>
    </div>
    <p class="muted small">Pakai π = 3,14. K = 2 × π × r dan L = π × r × r.</p>`;
  const scene = createPizzaScene(el.querySelector('#stage'), { count: 2 });
  const $ = (id) => el.querySelector('#' + id);
  const render = () => {
    const dA = Number($('dA').value), dB = Number($('dB').value);
    const pA = Math.max(1, Number($('pA').value) || 1), pB = Math.max(1, Number($('pB').value) || 1);
    scene.setDiameters(dA, dB);
    $('vA').textContent = dA;
    $('vB').textContent = dB;
    $('rA').textContent = fmt(dA / 2) + ' cm';
    $('rB').textContent = fmt(dB / 2) + ' cm';
    $('kA').textContent = fmt(PI * dA) + ' cm';
    $('kB').textContent = fmt(PI * dB) + ' cm';
    $('lA').textContent = fmt(area(dA)) + ' cm²';
    $('lB').textContent = fmt(area(dB)) + ' cm²';
    const cA = per(dA, pA), cB = per(dB, pB);
    $('hA').textContent = 'Rp' + fmt(cA, 1);
    $('hB').textContent = 'Rp' + fmt(cB, 1);
    const hi = Math.max(cA, cB), lo = Math.min(cA, cB);
    $('verdict').innerHTML =
      (hi - lo) / hi < 0.005
        ? '<strong>Harganya hampir sama per cm²</strong><span>Pilih sesuai jumlah orang yang makan.</span>'
        : `<strong>Pizza ${cA < cB ? 'A' : 'B'} lebih hemat</strong><span>Lebih murah Rp${fmt(hi - lo, 1)} per cm² (sekitar ${Math.round(((hi - lo) / hi) * 100)}%).</span>`;
  };
  el.querySelectorAll('input').forEach((x) => x.addEventListener('input', render));
  render();
  return () => scene.dispose();
}

const DIAMS = [14, 18, 20, 24, 28, 30, 35, 40];
function newRound() {
  for (;;) {
    const dA = pick(DIAMS);
    const dB = pick(DIAMS.filter((x) => x !== dA));
    const base = 100 + Math.random() * 60;
    const mk = (d) => Math.max(1000, Math.round((base * area(d) * (0.85 + Math.random() * 0.3)) / 1000) * 1000);
    const pa = mk(dA), pb = mk(dB);
    const ca = per(dA, pa), cb = per(dB, pb);
    if (Math.abs(ca - cb) / Math.max(ca, cb) >= 0.06) return { dA, dB, pa, pb, ca, cb };
  }
}

const ROUNDS = 6;

function tantangan(el, ctx) {
  let n = 0, score = 0, streak = 0, round = null;

  const pizzaSvg = (d, color) => {
    const r = (d / 40) * 48;
    return `<svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="${r}" style="fill:var(--crust);stroke:var(--${color})" stroke-width="3"/><circle cx="55" cy="55" r="${r * 0.9}" style="fill:var(--cheese)"/></svg>`;
  };

  function intro() {
    el.innerHTML = `
      <section class="stack">
        <div class="center">${mascot('cheer', 104)}</div>
        <p class="eyebrow">Tantangan Pizza Hemat</p>
        <h2>Siap pilih pizza paling hemat?</h2>
        <div class="kakdit-message kakdit-banner">
          <span class="kakdit-mark" aria-hidden="true">✦</span>
          <p>Tarik napas dulu! Baca soalnya pelan-pelan, cek jari-jari (r) atau diameternya (d). Kak Dit yakin kamu bisa!</p>
        </div>
        <p class="muted">Ada ${ROUNDS} ronde. Bandingkan ukuran dan harga per cm² untuk memilih pizza paling hemat.</p>
        <button type="button" class="btn big" id="start-challenge">Mulai tantangan</button>
      </section>`;
    el.querySelector('#start-challenge').addEventListener('click', draw);
  }

  function draw() {
    if (n >= ROUNDS) return end();
    round = newRound();
    el.innerHTML = `
      <section class="stack">
        <p class="eyebrow">Ronde ${n + 1} dari ${ROUNDS} · Skor ${score}${streak >= 2 ? ` · <span class="streak">Beruntun x${streak}</span>` : ''}</p>
        <h2>Pilih pizza yang paling hemat per cm²</h2>
        <div class="duo">
          <div class="pz a"><h3>Pizza A</h3>${pizzaSvg(round.dA, 'a')}<p><strong>${round.dA} cm</strong><br>${rp(round.pa)}</p></div>
          <div class="pz b"><h3>Pizza B</h3>${pizzaSvg(round.dB, 'b')}<p><strong>${round.dB} cm</strong><br>${rp(round.pb)}</p></div>
        </div>
        <div class="nav-row">
          <button type="button" class="btn" data-pick="A">Pilih A</button>
          <button type="button" class="btn" data-pick="B">Pilih B</button>
        </div>
        <p class="muted small">Gambar menunjukkan perbandingan ukuran. Pakai π = 3,14.</p>
        <div id="fb" aria-live="polite"></div>
      </section>`;
    el.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => answer(b.dataset.pick)));
  }

  function answer(p) {
    const win = round.ca < round.cb ? 'A' : 'B';
    const ok = p === win;
    if (ok) {
      score += 1;
      streak += 1;
      audio.sfx('correct');
      confetti();
    } else {
      streak = 0;
      audio.sfx('wrong');
    }
    n += 1;
    el.querySelectorAll('[data-pick]').forEach((b) => (b.disabled = true));
    const line = (k, d, price, c) =>
      `<li>Pizza ${k}: L = 3,14 × ${fmt(d / 2)} × ${fmt(d / 2)} = ${fmt(area(d))} cm². ${rp(price)} : ${fmt(area(d))} ≈ Rp${fmt(c, 1)} per cm²</li>`;
    el.querySelector('#fb').innerHTML = `
      <div class="verdict ${ok ? '' : 'bad'}">
        ${speech(ok ? 'cheer' : 'oops', `<strong>${ok ? 'Tepat.' : 'Belum tepat.'} Pizza ${win} lebih hemat.</strong>`)}
        <ul class="calc">${line('A', round.dA, round.pa, round.ca)}${line('B', round.dB, round.pb, round.cb)}</ul>
      </div>
      <button type="button" class="btn" id="nx">${n >= ROUNDS ? 'Lihat skor' : 'Ronde berikutnya'}</button>`;
    el.querySelector('#nx').addEventListener('click', draw);
    el.querySelector('#nx').focus();
  }

  async function end() {
    el.innerHTML = `
      <section class="stack">
        <div class="login-mascot">${mascot(score >= 5 ? 'cheer' : 'happy', 100)}</div>
        <p class="eyebrow">Tantangan selesai</p>
        <h2>Skormu ${score} dari ${ROUNDS}</h2>
        <div class="kakdit-message kakdit-appreciation">
          <span class="kakdit-mark" aria-hidden="true">★</span>
          <p>Yeay, tantangan selesai! Keren banget sudah berjuang sampai akhir. Kamu resmi jadi jagoan Pizza Lingkaran bareng Kak Dit!</p>
        </div>
        <p>${score >= 5 ? 'Hebat. Kamu sudah pandai membandingkan harga per cm².' : 'Coba lagi. Ingat: hitung luas dulu, lalu bagi harga dengan luas.'}</p>
        <div class="nav-row">
          <button type="button" class="btn" id="again">Main lagi</button>
          <a class="btn ghost" href="#latihan">Ke latihan soal</a>
        </div>
      </section>`;
    el.querySelector('#again').addEventListener('click', () => {
      n = 0;
      score = 0;
      streak = 0;
      intro();
    });
    if (score >= 5) {
      audio.sfx('win');
      confetti(undefined, undefined, 120);
    }
    try {
      await saveResult(ctx.user.code, { kind: 'game', score, total: ROUNDS });
    } catch {
      /* abaikan */
    }
  }

  intro();
  return () => {};
}

export function mainPizza(container, ctx) {
  let tab = 'kalkulator';
  let cleanup = null;
  function draw() {
    cleanup?.();
    container.innerHTML = `
      <section class="stack">
        <h1>Main pizza</h1>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" class="tab" aria-selected="${tab === 'kalkulator'}" data-tab="kalkulator">Kalkulator</button>
          <button type="button" role="tab" class="tab" aria-selected="${tab === 'tantangan'}" data-tab="tantangan">Tantangan</button>
        </div>
        <div id="tabview" class="stack"></div>
      </section>`;
    container.querySelectorAll('.tab').forEach((b) =>
      b.addEventListener('click', () => {
        tab = b.dataset.tab;
        draw();
      })
    );
    const v = container.querySelector('#tabview');
    cleanup = (tab === 'kalkulator' ? kalkulator(v) : tantangan(v, ctx)) || null;
  }
  draw();
  return () => cleanup?.();
}
