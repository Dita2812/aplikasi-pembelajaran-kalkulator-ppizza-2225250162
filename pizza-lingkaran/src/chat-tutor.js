// src/chat-tutor.js
// Komponen Vanilla JS Tutor AI RMT (Rigorous Mathematical Thinking)
import { esc } from './util.js';

export function createChatTutor({ soal = '', tahapSekarang = 'Tahap 1 - Identifikasi Informasi & Konsep', kesulitan = '', onClose = null } = {}) {
  let pesan = [
    {
      role: 'assistant',
      content: 'Halo! Aku Kak Dit, Asisten Belajar AI-mu. 🍕✨\nYuk kita pelajari soal ini bersama secara bertahap. Menurutmu, informasi apa saja yang diketahui dari soal ini?'
    }
  ];
  let loading = false;

  const wrapper = document.createElement('div');
  wrapper.className = 'chat-tutor-container';

  function render() {
    wrapper.innerHTML = `
      <div class="chat-tutor-card">
        <div class="chat-tutor-header">
          <div class="chat-tutor-title">
            <span class="chat-tutor-badge">✦ Tutor RMT</span>
            <div>
              <strong>Tanya Kak Dit (Asisten Belajar)</strong>
              <p class="chat-tutor-sub">Membimbing proses berpikir matematis</p>
            </div>
          </div>
          ${onClose ? '<button type="button" class="chat-close-btn" aria-label="Tutup Chat">&times;</button>' : ''}
        </div>
        <div class="chat-tutor-body" id="chat-msgs">
          ${pesan.map(m => `
            <div class="chat-bubble-row ${m.role}">
              <div class="chat-bubble ${m.role}">
                ${esc(m.content).replace(/\n/g, '<br>')}
              </div>
            </div>
          `).join('')}
          ${loading ? '<div class="chat-loading"><span class="chat-spinner"></span> Kak Dit sedang mengetik...</div>' : ''}
        </div>
        <form class="chat-tutor-footer" id="chat-form">
          <input type="text" id="chat-input" placeholder="Tulis jawaban atau pertanyaanmu..." autocomplete="off" ${loading ? 'disabled' : ''} />
          <button type="submit" class="btn" ${loading ? 'disabled' : ''}>Kirim</button>
        </form>
      </div>
    `;

    if (onClose) {
      wrapper.querySelector('.chat-close-btn')?.addEventListener('click', onClose);
    }

    const form = wrapper.querySelector('#chat-form');
    const input = wrapper.querySelector('#chat-input');
    const msgs = wrapper.querySelector('#chat-msgs');

    msgs.scrollTop = msgs.scrollHeight;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || loading) return;

      pesan.push({ role: 'user', content: text });
      loading = true;
      render();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: pesan,
            context: { soal, tahapSekarang, kesulitan }
          })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || 'Layanan AI belum siap atau terjadi kendala jaringan.');
        }

        pesan.push({ role: 'assistant', content: data.reply || 'Ada kendala respon AI, coba tanyakan kembali ya!' });
      } catch (err) {
        pesan.push({
          role: 'assistant',
          content: err.message.includes('API key')
            ? 'Kunci API DeepSeek (DEEPSEEK_API_KEY) belum diisi di server/.env. Silakan isi API key kamu untuk menghubungkan model AI.'
            : 'Kak Dit kesulitan terhubung: ' + err.message + '. Kamu tetap bisa menggunakan tombol "Butuh petunjuk" di atas!'
        });
      } finally {
        loading = false;
        render();
      }
    });

    setTimeout(() => {
      wrapper.querySelector('#chat-input')?.focus();
    }, 100);
  }

  render();
  return wrapper;
}
