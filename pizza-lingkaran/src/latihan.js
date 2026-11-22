// Halaman Latihan: 8 soal cerita (2 per indikator Mathematical Literacy), petunjuk bertahap, pembahasan.
import { SOAL, INDIKATOR } from './data.js';
import { esc, fmt, parseNum } from './util.js';
import { saveResult } from './store.js';
import * as audio from './audio.js';
import { confetti } from './confetti.js';
import { mascot, speech } from './mascot.js';
import { createChatTutor } from './chat-tutor.js?v=7';

export function latihan(container, ctx) {
  let i = 0;
  let hasil = [];
  const N = SOAL.length;

  function intro() {
    container.innerHTML = `
      <section class="stack">
        <div class="center">${mascot('cheer', 104)}</div>
        <p class="eyebrow">Latihan soal</p>
        <h1>Siap mencoba?</h1>
        <div class="kakdit-message kakdit-banner">
          <span class="kakdit-mark" aria-hidden="true">✦</span>
          <p>Tarik napas dulu! Baca soalnya pelan-pelan, cek jari-jari (r) atau diameternya (d). Kak Dit yakin kamu bisa!</p>
        </div>
        <p class="muted">Ada ${N} soal cerita. Kerjakan dengan tenang; kamu bisa memakai petunjuk jika diperlukan.</p>
        <button type="button" class="btn big" id="start-latihan">Mulai latihan</button>
      </section>`;
    container.querySelector('#start-latihan').addEventListener('click', () => {
      i = 0;
      hasil = [];
      draw();
    });
  }

  function draw() {
    if (i >= N) return selesai();
    const s = SOAL[i];
    let hintShown = 0;
    let done = false;
    const dots = SOAL.map(
      (_, k) => `<span class="dot ${k < i ? 'done' : k === i ? 'now' : ''}"></span>`
    ).join('');
    container.innerHTML = `
      <section class="stack">
        <div class="dots" role="img" aria-label="Soal ${i + 1} dari ${N}">${dots}</div>
        <p class="eyebrow">Soal ${i + 1} dari ${N}</p>
        <div><span class="chip">${esc(s.indikator)}</span><p class="muted small">${esc(INDIKATOR[s.indikator])}</p></div>
        <p class="soal">${esc(s.teks)}</p>
        ${
          s.tipe === 'pilihan'
            ? `<div class="opts" id="opts">${s.opsi
                .map((o, k) => `<button type="button" class="opt" data-k="${k}">${esc(o)}</button>`)
                .join('')}</div>`
            : `<div class="row">
                 <label class="sr" for="ans">Jawabanmu</label>
                 <input id="ans" type="text" inputmode="decimal" autocomplete="off" placeholder="Ketik angka" />
                 <span class="unit-tag">${esc(s.satuan)}</span>
               </div>
               <button type="button" class="btn" id="cek">Cek jawaban</button>`
        }
        <div id="hints" class="hints" aria-live="polite"></div>
        <div class="action-buttons-row">
          <button type="button" class="btn ghost" id="hint">Butuh petunjuk</button>
          <button type="button" class="btn ghost tutor-btn" id="tutor-btn">
            <span aria-hidden="true">💡</span> Tanya Kak Dit (Tutor RMT)
          </button>
        </div>
        <div id="tutor-slot"></div>
        <div id="fb" aria-live="polite"></div>
      </section>`;

    const fb = container.querySelector('#fb');
    const hintBtn = container.querySelector('#hint');
    const tutorBtn = container.querySelector('#tutor-btn');
    const tutorSlot = container.querySelector('#tutor-slot');
    let tutorOpen = false;

    tutorBtn.addEventListener('click', () => {
      tutorOpen = !tutorOpen;
      tutorBtn.classList.toggle('active', tutorOpen);
      if (tutorOpen) {
        tutorSlot.innerHTML = '';
        const tutor = createChatTutor({
          soal: s.teks,
          tahapSekarang: 'Tahap 1 - Pengembangan Kognitif (Identifikasi Informasi)',
          kesulitan: s.indikator,
          onClose: () => {
            tutorOpen = false;
            tutorBtn.classList.remove('active');
            tutorSlot.innerHTML = '';
          }
        });
        tutorSlot.appendChild(tutor);
      } else {
        tutorSlot.innerHTML = '';
      }
    });

    hintBtn.addEventListener('click', () => {
      if (done || hintShown >= s.hint.length) return;
      container.querySelector('#hints').insertAdjacentHTML(
        'beforeend',
        `<p class="hint">Petunjuk ${hintShown + 1}: ${esc(s.hint[hintShown])}</p>`
      );
      hintShown += 1;
      if (hintShown >= s.hint.length) hintBtn.disabled = true;
    });

    function finishQuestion(ok) {
      done = true;
      audio.sfx(ok ? 'correct' : 'wrong');
      if (ok) confetti();
      hasil.push({ indikator: s.indikator, benar: ok, petunjuk: hintShown });
      hintBtn.disabled = true;
      tutorBtn.disabled = true;
      container.querySelectorAll('.opt, #ans, #cek').forEach((x) => (x.disabled = true));
      fb.innerHTML = `
        <div class="verdict ${ok ? '' : 'bad'}">
          ${speech(ok ? 'cheer' : 'oops', `<strong>${ok ? 'Benar.' : 'Belum tepat.'}</strong> ${esc(s.bahas)}`)}
        </div>
        <button type="button" class="btn" id="nx">${i === N - 1 ? 'Lihat hasil' : 'Soal berikutnya'}</button>`;
      const nx = fb.querySelector('#nx');
      nx.addEventListener('click', () => {
        i += 1;
        draw();
        window.scrollTo(0, 0);
      });
      nx.focus();
    }

    if (s.tipe === 'pilihan') {
      container.querySelector('#opts').addEventListener('click', (e) => {
        const b = e.target.closest('.opt');
        if (!b || done) return;
        const k = Number(b.dataset.k);
        const ok = k === s.benar;
        b.classList.add(ok ? 'ok' : 'bad');
        if (!ok) container.querySelectorAll('.opt')[s.benar].classList.add('ok');
        finishQuestion(ok);
      });
    } else {
      const check = () => {
        const v = parseNum(container.querySelector('#ans').value);
        if (Number.isNaN(v)) {
          fb.innerHTML = '<p class="fb bad">Isi dengan angka dulu.</p>';
          return;
        }
        finishQuestion(Math.abs(v - s.jawaban) <= Math.max(0.01, s.jawaban * 0.005));
      };
      container.querySelector('#cek').addEventListener('click', check);
      container.querySelector('#ans').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // cegah Enter ikut menekan tombol "Soal berikutnya" yang baru muncul
          if (!done) check();
        }
      });
    }
  }

  async function selesai() {
    const benar = hasil.filter((h) => h.benar).length;
    if (benar >= 6) {
      audio.sfx('win');
      confetti(undefined, undefined, 120);
    }
    const per = {};
    hasil.forEach((h) => {
      per[h.indikator] = per[h.indikator] || { benar: 0, total: 0 };
      per[h.indikator].total += 1;
      if (h.benar) per[h.indikator].benar += 1;
    });
    container.innerHTML = `
      <section class="stack">
        <div class="login-mascot">${mascot(benar >= 6 ? 'cheer' : 'happy', 100)}</div>
        <p class="eyebrow">Latihan selesai</p>
        <h1>Skormu ${benar} dari ${N}</h1>
        <div class="kakdit-message kakdit-appreciation">
          <span class="kakdit-mark" aria-hidden="true">★</span>
          <p>Yeay, tantangan selesai! Keren banget sudah berjuang sampai akhir. Kamu resmi jadi jagoan Pizza Lingkaran bareng Kak Dit!</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Indikator</th><th>Benar</th></tr></thead>
            <tbody>${Object.entries(per)
              .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${v.benar} dari ${v.total}</td></tr>`)
              .join('')}</tbody>
          </table>
        </div>
        <p>${benar >= 6 ? 'Bagus. Pemahamanmu sudah kuat.' : 'Pelajari lagi materinya, lalu coba ulang latihan ini.'}</p>
        <div class="nav-row">
          <button type="button" class="btn" id="again">Ulangi latihan</button>
          <a class="btn ghost" href="#belajar">Buka materi</a>
        </div>
      </section>`;
    container.querySelector('#again').addEventListener('click', () => {
      i = 0;
      hasil = [];
      draw();
    });
    try {
      await saveResult(ctx.user.code, { kind: 'latihan', score: benar, total: N, detail: { per, hasil } });
    } catch {
      /* abaikan */
    }
  }

  intro();
  return () => {};
}

export { fmt };
