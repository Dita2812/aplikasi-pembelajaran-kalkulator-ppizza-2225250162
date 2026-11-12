// Titik masuk: router berbasis hash, halaman login (nama siswa), dan beranda.
import { getSession, login, logout, isDemo, getResults, best } from './store.js';
import { esc } from './util.js';
import { belajar } from './belajar.js';
import { mainPizza } from './main-pizza.js?v=3';
import { latihan } from './latihan.js?v=3';
import { tes } from './tes.js?v=3';
import { TES_AKTIF } from './config.js';
import * as audio from './audio.js';
import { mascot } from './mascot.js';

const app = document.getElementById('app');

const ICON = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zM4 19V5"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
  pencil: '<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  speakerOff: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
};
const icon = (k, size = 22) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

const NAV = [
  ['/', 'Beranda', 'home'],
  ['/belajar', 'Belajar', 'book'],
  ['/main', 'Main', 'play'],
  ['/latihan', 'Latihan', 'pencil'],
  ...(TES_AKTIF ? [['/tes', 'Tes', 'flag']] : []),
];

function shell(user, path) {
  const on = audio.isEnabled();
  return `
    <header class="top">
      <a class="brand" href="#"><span class="brand-m">${mascot('happy', 30)}</span>Pizza Lingkaran</a>
      <div class="who">
        <button type="button" id="snd" class="icon-btn" aria-pressed="${on}" aria-label="Musik dan suara">${icon(on ? 'speaker' : 'speakerOff', 20)}</button>
        <span>${esc(user.name)}</span>
        <button type="button" id="logout" class="link">Keluar</button>
      </div>
    </header>
    <main id="view" class="view" tabindex="-1"></main>
    <nav class="bottom" aria-label="Menu utama">
      ${NAV.map(
        ([p, label, ic]) =>
          `<a href="#${p.slice(1)}" ${p === path ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></a>`
      ).join('')}
    </nav>`;
}

function introView(el, user, onContinue) {
  el.innerHTML = `
    <main class="login">
      <div class="login-card intro-card">
        <div class="float-scene" aria-hidden="true">
          <span class="float-orb orb-one">π</span>
          <span class="float-orb orb-two">r²</span>
          <span class="float-orb orb-three">K = 2πr</span>
        </div>
        <div class="login-mascot">${mascot('cheer', 110)}</div>
        <div class="stack" style="text-align:left">
          <p class="eyebrow">Halo, ${esc(user.name)}!</p>
          <h1>Materi hari ini</h1>
          <p class="muted">Hari ini kita akan belajar tentang lingkaran, mulai dari tepi sampai isi di dalamnya.</p>
          <ul class="mini-list">
            <li><strong>Keliling lingkaran</strong> adalah panjang garis tepi lingkaran, seperti pinggiran pizza.</li>
            <li><strong>Luas lingkaran</strong> adalah luas seluruh bagian di dalam lingkaran, seperti isi pizza.</li>
            <li>Rumus penting: <strong>K = 2 × π × r</strong> dan <strong>L = π × r²</strong>.</li>
          </ul>
          <button class="btn" type="button" id="start-learn">Mulai belajar</button>
        </div>
      </div>
    </main>`;

  el.querySelector('#start-learn').addEventListener('click', () => {
    audio.sfx('win');
    onContinue();
  });
}

function loginView(el, onLogin) {
  el.innerHTML = `
    <main class="login">
      <div class="login-card">
        <div class="login-mascot">${mascot('cheer', 120)}</div>
        <div class="kakdit-message login-message">
          <span class="kakdit-mark" aria-hidden="true">✦</span>
          <p>Halo! Siap meracik rumus keliling dan luas lingkaran bareng Kak Dit? Tulis namamu dulu, yuk!</p>
        </div>
        <div class="stack" style="text-align:center">
          <p class="eyebrow">Matematika SMP · Kelas 8</p>
          <h1>Pizza Lingkaran</h1>
          <p class="muted">Belajar keliling dan luas lingkaran bareng Kak Dit. Tulis namamu untuk mulai.</p>
        </div>
        <form id="f" class="stack" novalidate>
          <label for="nama">Nama kamu</label>
          <input id="nama" name="nama" autocomplete="name" autocapitalize="words" placeholder="Contoh: Dita Ayu" />
          <p id="err" class="fb bad" role="alert"></p>
          <button class="btn" type="submit" id="go">Ayo mulai</button>
        </form>
        <p class="muted small" style="text-align:center">Ada musik dan efek suara. Kamu bisa mematikannya dengan tombol speaker di atas setelah masuk.</p>
        ${isDemo ? '<p class="demo">Mode demo: tulis namamu saja. Hasil belajar tersimpan di perangkat ini saja.</p>' : ''}
      </div>
    </main>`;
  const f = el.querySelector('#f');
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const go = el.querySelector('#go');
    const err = el.querySelector('#err');
    err.textContent = '';
    go.disabled = true;
    go.textContent = 'Memeriksa...';
    try {
      const user = await login(f.nama.value);
      audio.startMusic();
      introView(el, user, () => onLogin(user));
    } catch (ex) {
      err.textContent = ex.message;
      go.disabled = false;
      go.textContent = 'Ayo mulai';
    }
  });
  el.querySelector('#nama').focus();
}

// Bintang: materi selesai = 5, skor terbaik tantangan (maks 6), skor terbaik latihan (maks 8).
const MAX_STARS = TES_AKTIF ? 24 : 19; // tes literasi menambah maksimal 5 bintang
const LEVELS = [
  { min: 0, name: 'Pemula' },
  { min: Math.round(MAX_STARS * 0.25), name: 'Juru Masak' },
  { min: Math.round(MAX_STARS * 0.5), name: 'Koki Pizza' },
  { min: Math.round(MAX_STARS * 0.75), name: 'Master Lingkaran' },
];

function levelOf(res) {
  const m = best(res, 'materi');
  const g = best(res, 'game');
  const l = best(res, 'latihan');
  const t = TES_AKTIF ? best(res, 'tes') : null;
  const stars = Math.min(MAX_STARS, (m ? 5 : 0) + (g ? g.score : 0) + (l ? l.score : 0) + (t ? Math.round((t.score / t.total) * 5) : 0));
  let idx = 0;
  LEVELS.forEach((lv, i) => {
    if (stars >= lv.min) idx = i;
  });
  const next = LEVELS[idx + 1];
  return {
    stars,
    name: LEVELS[idx].name,
    hint: next
      ? `Kurang ${next.min - stars} bintang lagi menuju ${next.name}.`
      : 'Kamu sudah jadi Master Lingkaran. Hebat!',
  };
}

const TILE = (c, ic) => `<span class="tile" style="--c:var(${c})">${icon(ic, 26)}</span>`;

function beranda(el, ctx) {
  let alive = true;
  const pepTalks = [
    'Nggak harus langsung jago. Berani mencoba satu langkah saja sudah hebat!',
    'Kalau salah, kita belajar lagi. Kamu pasti makin dekat dengan jawabannya!',
    'Pelan-pelan saja, setiap latihan bikin kamu makin jago!',
    'Kamu bisa! Yuk, mulai dari satu tantangan kecil hari ini.',
  ];
  const pepTalk = pepTalks[Math.floor(Math.random() * pepTalks.length)];
  el.innerHTML = `
    <section class="stack">
      <div class="hero">
        <div class="hero-m">${mascot('cheer', 84)}</div>
        <div>
          <p class="eyebrow">Halo</p>
          <h1>${esc(ctx.user.name)}</h1>
        </div>
      </div>
      <div class="pep-talk">
        <span class="pep-symbol" aria-hidden="true">✦</span>
        <div>
          <p class="eyebrow">Pesan Kak Dit</p>
          <p>${pepTalk}</p>
        </div>
      </div>
      <div class="levelcard">
        <div class="lv-top"><strong id="lvname">Pemula</strong><span id="lvstars">0 dari ${MAX_STARS} bintang</span></div>
        <div class="bar" role="img" aria-label="Kemajuan bintang"><span id="lvbar" style="width:0%"></span></div>
        <p class="small muted" id="lvhint">Selesaikan materi untuk mendapat bintang pertama.</p>
      </div>
      <div class="home-note">
        <p class="eyebrow">Materi cepat</p>
        <h2>Keliling dan luas lingkaran</h2>
        <div class="mini-grid">
          <div class="mini-box">
            <span>Keliling</span>
            <strong>K = 2 × π × r</strong>
            <small>mengukur panjang tepi lingkaran</small>
          </div>
          <div class="mini-box">
            <span>Luas</span>
            <strong>L = π × r²</strong>
            <small>mengukur luas seluruh bagian dalam lingkaran</small>
          </div>
        </div>
        <p class="small muted">Jari-jari = jarak dari pusat ke tepi. Diameter = dua kali jari-jari, dan π ≈ 3,14.</p>
      </div>
      ${isDemo ? '<p class="demo">Mode demo: hasilmu tersimpan di perangkat ini saja.</p>' : ''}
      <div class="menu">
        <a class="menu-card" href="#belajar" style="--c:var(--b)">
          ${TILE('--b', 'book')}
          <span class="mc-body"><h2>Belajar</h2><p>5 langkah pendek tentang keliling dan luas lingkaran.</p><span class="prog" id="p-materi">Belum dimulai</span></span>
        </a>
        <a class="menu-card" href="#main" style="--c:var(--a)">
          ${TILE('--a', 'play')}
          <span class="mc-body"><h2>Main pizza</h2><p>Bandingkan dua pizza, lalu ikut tantangan 6 ronde.</p><span class="prog" id="p-game">Belum dimainkan</span></span>
        </a>
        <a class="menu-card" href="#latihan" style="--c:var(--ok)">
          ${TILE('--ok', 'pencil')}
          <span class="mc-body"><h2>Latihan soal</h2><p>8 soal cerita dengan petunjuk dan pembahasan.</p><span class="prog" id="p-latihan">Belum dikerjakan</span></span>
        </a>
        ${
          TES_AKTIF
            ? `<a class="menu-card" href="#tes" style="--c:var(--a)">
          ${TILE('--a', 'flag')}
          <span class="mc-body"><h2>Tes literasi</h2><p>4 soal cerita bertahap. Skor maksimal 24.</p><span class="prog" id="p-tes">Belum dikerjakan</span></span>
        </a>`
            : ''
        }
      </div>
    </section>`;
  getResults(ctx.user.code).then((res) => {
    if (!alive) return;
    const m = best(res, 'materi');
    const g = best(res, 'game');
    const l = best(res, 'latihan');
    if (m) el.querySelector('#p-materi').textContent = 'Selesai';
    if (g) el.querySelector('#p-game').textContent = `Skor terbaik ${g.score} dari ${g.total}`;
    if (l) el.querySelector('#p-latihan').textContent = `Skor terbaik ${l.score} dari ${l.total}`;
    const tt = best(res, 'tes');
    if (tt && el.querySelector('#p-tes')) el.querySelector('#p-tes').textContent = `Skor terbaik ${tt.score} dari ${tt.total}`;
    const lv = levelOf(res);
    el.querySelector('#lvname').textContent = 'Level: ' + lv.name;
    el.querySelector('#lvstars').textContent = `${lv.stars} dari ${MAX_STARS} bintang`;
    el.querySelector('#lvbar').style.width = (lv.stars / MAX_STARS) * 100 + '%';
    el.querySelector('#lvhint').textContent = lv.hint;
  });
  return () => {
    alive = false;
  };
}

const routes = { '/': beranda, '/belajar': belajar, '/main': mainPizza, '/latihan': latihan, ...(TES_AKTIF ? { '/tes': tes } : {}) };
let cleanup = null;

function currentPath() {
  return '/' + location.hash.replace(/^#\/?/, '');
}

function render() {
  cleanup?.();
  cleanup = null;
  const user = getSession();
  if (!user) {
    loginView(app, () => {
      if (currentPath() !== '/') location.hash = '';
      else render();
    });
    return;
  }
  const path = routes[currentPath()] ? currentPath() : '/';
  app.innerHTML = shell(user, path);
  const view = app.querySelector('#view');
  cleanup = routes[path](view, { user }) || null;
  app.querySelector('#logout').addEventListener('click', () => {
    logout();
    location.hash = '';
    render();
  });
  const snd = app.querySelector('#snd');
  snd.addEventListener('click', () => {
    const on = audio.toggle();
    snd.setAttribute('aria-pressed', String(on));
    snd.innerHTML = icon(on ? 'speaker' : 'speakerOff', 20);
  });
  window.scrollTo(0, 0);
}

// Suara klik untuk tombol dan menu. Opsi jawaban punya suara sendiri (benar atau salah).
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn, .menu-card, .tab, .bottom a, .icon-btn')) audio.sfx('click');
});
// Kalau siswa sudah login sebelumnya, musik mulai saat layar pertama kali disentuh.
if (getSession()) document.addEventListener('pointerdown', () => audio.startMusic(), { once: true });

window.addEventListener('hashchange', render);
render();
