// Tes Literasi Matematis: 4 soal cerita (satu per indikator), dinilai per tahap, skor maksimal 24.
import { TES } from './data.js';
import { esc, parseNum } from './util.js';
import { saveResult } from './store.js';
import { sfx } from './audio.js';
import { confetti } from './confetti.js';
import { mascot } from './mascot.js';

const MAKS = TES.reduce((a, s) => a + s.tahap.reduce((b, t) => b + t.skor, 0), 0);

export function tes(container, ctx) {
  let q = 0;
  let t = 0;
  let nilai = []; // {indikator, soal, skor, maks}

  function intro() {
    container.innerHTML = `
      <section class="stack">
        <div class="center">${mascot('cheer', 104)}</div>
        <p class="eyebrow">Tes Literasi Matematis</p>
        <h1>Siap uji kemampuanmu?</h1>
        <div class="kakdit-message kakdit-banner">
          <span class="kakdit-mark" aria-hidden="true">✦</span>
          <p>Tarik napas dulu! Baca soalnya pelan-pelan, cek jari-jari (r) atau diameternya (d). Kak Dit yakin kamu bisa!</p>
        </div>
        <ul class="poin">
          <li>${TES.length} soal cerita. Setiap soal dibagi menjadi beberapa langkah.</li>
          <li>Skor maksimal ${MAKS}. Tiap soal bernilai 6.</li>
          <li>Tidak ada petunjuk, dan jawaban benar baru ditampilkan setelah tes selesai.</li>
          <li>Kerjakan setelah belajar materi, dengan tenang dan teliti.</li>
        </ul>
        <button type="button" class="btn big" id="mulai">Mulai tes</button>
      </section>`;
    container.querySelector('#mulai').addEventListener('click', () => {
      q = 0;
      t = 0;
      nilai = [];
      draw();
    });
  }

  function draw() {
    const s = TES[q];
    const th = s.tahap[t];
    const dots = TES.map((_, k) => `<span class="dot ${k < q ? 'done' : k === q ? 'now' : ''}"></span>`).join('');
    container.innerHTML = `
      <section class="stack">
        <div class="dots" role="img" aria-label="Soal ${q + 1} dari ${TES.length}">${dots}</div>
        <p class="eyebrow">Soal ${q + 1} dari ${TES.length} · Langkah ${t + 1} dari ${s.tahap.length}</p>
        <span class="chip">${esc(s.indikator)}</span>
        <div class="card story">${s.cerita.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <h2>${esc(th.tanya)}</h2>
        ${
          th.opsi
            ? `<div class="opts" id="opts">${th.opsi
                .map((o, k) => `<button type="button" class="opt" data-k="${k}">${esc(o)}</button>`)
                .join('')}</div>`
            : `<div class="row">
                 <label class="sr" for="ans">Jawabanmu</label>
                 <input id="ans" type="text" inputmode="decimal" autocomplete="off" placeholder="Ketik angka" />
                 <span class="unit-tag">${esc(th.satuan || '')}</span>
               </div>`
        }
        <button type="button" class="btn big" id="lanjut" disabled>${q === TES.length - 1 && t === s.tahap.length - 1 ? 'Selesai' : 'Lanjut'}</button>
      </section>`;

    const next = container.querySelector('#lanjut');
    let pilih = null;
    if (th.opsi) {
      container.querySelector('#opts').addEventListener('click', (e) => {
        const b = e.target.closest('.opt');
        if (!b) return;
        container.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
        pilih = Number(b.dataset.k);
        next.disabled = false;
      });
    } else {
      const input = container.querySelector('#ans');
      input.addEventListener('input', () => {
        next.disabled = Number.isNaN(parseNum(input.value));
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!next.disabled) next.click();
        }
      });
    }
    next.addEventListener('click', () => {
      let ok;
      if (th.opsi) ok = pilih === th.benar;
      else {
        const v = parseNum(container.querySelector('#ans').value);
        ok = Math.abs(v - th.jawaban) <= Math.max(0.01, th.jawaban * 0.005);
      }
      const last = nilai[nilai.length - 1];
      if (last && last.soal === q) {
        last.skor += ok ? th.skor : 0;
        last.maks += th.skor;
      } else {
        nilai.push({ indikator: s.indikator, soal: q, skor: ok ? th.skor : 0, maks: th.skor });
      }
      sfx('klik');
      if (t < s.tahap.length - 1) t += 1;
      else if (q < TES.length - 1) {
        q += 1;
        t = 0;
      } else return selesai();
      draw();
      window.scrollTo(0, 0);
    });
  }

  async function selesai() {
    const total = nilai.reduce((a, n) => a + n.skor, 0);
    const baris = nilai
      .map((n) => `<tr><th scope="row">${esc(n.indikator)}</th><td>${n.skor} dari ${n.maks}</td></tr>`)
      .join('');
    const pesan =
      total >= 18 ? 'Sangat baik. Kamu menguasai literasi matematis keliling dan luas lingkaran.' :
      total >= 12 ? 'Baik. Ulangi materi bagian yang masih salah, lalu coba lagi.' :
      'Ayo belajar lagi. Buka Belajar dan Latihan dulu, lalu ulangi tes ini.';
    sfx(total >= 12 ? 'menang' : 'salah');
    if (total >= 18) confetti(undefined, undefined, 100);
    container.innerHTML = `
      <section class="stack">
        <div class="center">${mascot(total >= 12 ? 'cheer' : 'oops', 110)}</div>
        <p class="eyebrow">Tes selesai</p>
        <h1>Skormu ${total} dari ${MAKS}</h1>
        <div class="kakdit-message kakdit-appreciation">
          <span class="kakdit-mark" aria-hidden="true">★</span>
          <p>Yeay, tantangan selesai! Keren banget sudah berjuang sampai akhir. Kamu resmi jadi jagoan Pizza Lingkaran bareng Kak Dit!</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Indikator</th><th>Skor</th></tr></thead>
            <tbody>${baris}</tbody>
          </table>
        </div>
        <p>${pesan}</p>
        <div class="nav-row">
          <button type="button" class="btn" id="ulang">Ulangi tes</button>
          <a class="btn ghost" href="#belajar">Buka materi</a>
        </div>
      </section>`;
    container.querySelector('#ulang').addEventListener('click', intro);
    try {
      await saveResult(ctx.user.code, { kind: 'tes', score: total, total: MAKS, detail: { nilai } });
    } catch {
      /* abaikan */
    }
  }

  intro();
  return () => {};
}
