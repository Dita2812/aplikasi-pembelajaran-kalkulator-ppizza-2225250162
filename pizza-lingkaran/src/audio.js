// Musik latar dan efek suara, dibuat langsung di browser (Web Audio). Tanpa file audio, tanpa hak cipta.
// Browser baru boleh bersuara setelah pengguna menyentuh layar, jadi musik dimulai saat sentuhan pertama.

const KEY = 'pizza-lingkaran.suara';
let ctx = null;
let master = null;
let musicGain = null;
let timer = null;
let nextTime = 0;
let step = 0;
let running = false;
let soundOn = readPref();

function readPref() {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}
function writePref(v) {
  try {
    localStorage.setItem(KEY, v ? 'on' : 'off');
  } catch {
    /* abaikan */
  }
}

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.45;
    musicGain.connect(master);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return true;
}

function tone(freq, t, dur, { type = 'triangle', gain = 0.2, out = master } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(out);
  o.start(t);
  o.stop(t + dur + 0.03);
}

// Lagu latar sederhana (nada pentatonik, 4 birama). Angka = jarak setengah nada dari C5.
const EIGHTH = 0.26;
const MELODY = [
  0, null, 4, null, 7, null, 4, null,
  9, null, 7, null, 4, null, 2, null,
  0, null, 2, 4, 7, 4, 2, null,
  4, 2, 0, null, null, null, null, null,
];
const BASS = [0, -3, -7, -5];

function schedule() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + 0.4) {
    const s = step % 32;
    const bar = Math.floor(s / 8);
    const m = MELODY[s];
    if (m !== null) tone(mtof(72 + m), nextTime, EIGHTH * 1.6, { type: 'triangle', gain: 0.16, out: musicGain });
    if (s % 4 === 0) tone(mtof(48 + BASS[bar]), nextTime, EIGHTH * 3.2, { type: 'sine', gain: 0.22, out: musicGain });
    nextTime += EIGHTH;
    step += 1;
  }
}

export function startMusic() {
  if (!soundOn || running) return;
  if (!ensure()) return;
  running = true;
  nextTime = ctx.currentTime + 0.1;
  timer = setInterval(schedule, 120);
}

export function stopMusic() {
  running = false;
  clearInterval(timer);
}

export const isSoundOn = () => soundOn;
export const isEnabled = isSoundOn;

export function toggleSound() {
  soundOn = !soundOn;
  writePref(soundOn);
  if (soundOn) startMusic();
  else stopMusic();
  return soundOn;
}

export const toggle = () => toggleSound();

// Mulai musik pada sentuhan pertama, dan jeda saat tab disembunyikan.
export function arm() {
  const go = () => {
    document.removeEventListener('pointerdown', go);
    document.removeEventListener('keydown', go);
    if (soundOn) startMusic();
  };
  document.addEventListener('pointerdown', go);
  document.addEventListener('keydown', go);
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (soundOn) ctx.resume();
  });
}

export function sfx(raw) {
  const alias = { correct: 'benar', wrong: 'salah', win: 'menang', click: 'klik' };
  const name = alias[raw] || raw;
  if (!soundOn || !ensure()) return;
  const t = ctx.currentTime + 0.01;
  if (name === 'benar') {
    [72, 76, 79, 84].forEach((m, i) => tone(mtof(m), t + i * 0.08, 0.2, { type: 'square', gain: 0.1 }));
  } else if (name === 'salah') {
    tone(mtof(55), t, 0.22, { type: 'sawtooth', gain: 0.1 });
    tone(mtof(50), t + 0.16, 0.32, { type: 'sawtooth', gain: 0.1 });
  } else if (name === 'menang') {
    [72, 76, 79, 84, 88, 91, 96].forEach((m, i) => tone(mtof(m), t + i * 0.09, 0.28, { type: 'square', gain: 0.1 }));
  } else {
    tone(mtof(84), t, 0.06, { type: 'square', gain: 0.05 });
  }
}
