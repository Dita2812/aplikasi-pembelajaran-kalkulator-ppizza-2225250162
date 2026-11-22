# Integrasi AI DeepSeek & Rogorius Mathematical Thinking (RMT)

Dokumen ini menjelaskan implementasi teknis dan pedagogis integrasi AI DeepSeek dengan pendekatan **Rogorius Mathematical Thinking (RMT)** dan pengelolaan **Cognitive Load Theory (CLT)** pada aplikasi pembelajaran **Pizza Lingkaran**.

---

## 1. Landasan Pedagogis: Rogorius Mathematical Thinking (RMT)

Sesuai arahan dosen pengampu (Pak Aan), aplikasi ini tidak sekadar menggunakan AI sebagai mesin penjawab soal instan, melainkan sebagai **Tutor Pembimbing Berpikir Matematis (Socratic Tutor)** yang mengadaptasi 3 tahap RMT:

| Tahap RMT | Aktivitas Siswa | Peran Asisten AI (Kak Dit) | Pengelolaan Cognitive Load |
|---|---|---|---|
| **Tahap 1: Pengembangan Kognitif (*Cognitive Development*)** | Siswa mengenali konteks soal cerita pizza, mengidentifikasi data esensial (apa yang diketahui: diameter $d$ atau jari-jari $r$, harga pizza, dan apa yang ditanyakan). | Memberikan pertanyaan pemantik untuk membedakan diameter dan jari-jari, memusatkan perhatian siswa pada informasi penting tanpa langsung masuk ke rumus. | **Mereduksi Extraneous Load**: Informasi disajikan singkat, satu pertanyaan per respons, menghindari instruksi berbelit-belit. |
| **Tahap 2: Konten sebagai Proses Pengembangan (*Content as Process Development*)** | Siswa mengeksplorasi hubungan matematis, menentukan apakah masalah terkait keliling (pinggiran pizza) atau luas (seluruh permukaan pizza), serta memilih rumus yang sesuai ($K = \pi \times d$ atau $L = \pi \times r^2$). | Mengajak siswa bernalar mengapa rumus tertentu yang dipilih, mengaitkan bentuk fisik pizza dengan konsep matematika, dan memilih nilai $\pi$ (22/7 atau 3,14) yang efisien. | **Mengoptimalkan Germane Load**: Membantu siswa mengonstruksi skema pemahaman konsep lingkaran ke dalam memori jangka panjang (*schema acquisition*). |
| **Tahap 3: Praktik Konstruksi Kognitif Konseptual (*Cognitive Conceptual Construction Practice*)** | Siswa melakukan substitusi angka dan perhitungan bertahap, mengevaluasi kewajaran hasil, dan menyimpulkan jawaban. | Memandu verifikasi langkah hitung secara mandiri, memberikan petunjuk jika terjadi kekeliruan perhitungan, dan mengonfirmasi kesimpulan. | **Mengontrol Intrinsic Load**: Memecah soal cerita kompleks menjadi sub-tugas kecil yang mudah dicerna kapasitas *working memory* siswa. |

---

## 2. Aturan Bimbingan AI (System Prompt)

Model AI diatur dengan aturan pedagogis ketat di `netlify/functions/rmt-prompt.mjs`:
1. **Pantang Memberikan Jawaban Akhir**: Siswa yang meminta *"Berapa jawabannya?"* akan dibimbing dengan pertanyaan penuntun.
2. **Tiga Tingkat Bimbingan (*Scaffolding*)**:
   - *Petunjuk 1*: Pertanyaan pemantik konsep.
   - *Petunjuk 2*: Pengingat rumus dan hubungan matematis.
   - *Petunjuk 3*: Contoh serupa dengan angka lebih sederhana.
3. **Bahasa Ramah & Konstruktif**: Memakai persona Kak Dit, bahasa Indonesia komunikatif untuk siswa SMP kelas 8, serta memberikan apresiasi spesifik ketika siswa berhasil memahami konsep.

---

## 3. Arsitektur Teknis & Keamanan API Key

Sesuai ketentuan tugas, **kunci API DeepSeek tidak boleh bocor ke frontend atau GitHub**:

```
[ Frontend: Browser Siswa ]
       │
       ▼ (POST /api/chat dengan pesan & konteks soal)
[ Backend Serverless: Netlify Function (netlify/functions/chat.mjs) ]
       │  membaca process.env.DEEPSEEK_API_KEY (Aman, tidak terbaca publik)
       ▼ (System Prompt RMT + Chat History)
[ DeepSeek AI API: api.deepseek.com (model: deepseek-chat) ]
       │
       ▼ (Respons Sokratik)
[ Frontend Siswa: ChatTutor UI ]
```

- **File `.env`**: Hanya ada di lokal / server Netlify dan sudah masuk ke `.gitignore` agar tidak pernah terunggah ke repositori GitHub.
- **Komponen UI**:
  - `src/ChatTutor.jsx`: Komponen referensi standar React.
  - `src/chat-tutor.js`: Implementasi native Vanilla JS ES Module yang terintegrasi langsung pada tombol **"💡 Tanya Kak Dit (Tutor RMT)"** di layar `src/latihan.js`.
