# Pizza Lingkaran

Aplikasi web untuk siswa SMP kelas 8 belajar **keliling dan luas lingkaran** lewat konteks pizza. Dibuat untuk tugas mata kuliah Algoritma dan Pemrograman (Pendidikan Matematika). Kemampuan yang ingin ditingkatkan: **Mathematical Literacy**.

## Fitur
- **Login dengan nama** siswa (contoh: Dita Ayu).
- **Seru**: maskot Piko, musik latar dan efek suara (bisa dimatikan dengan tombol speaker), konfeti, dan level bintang di beranda.
- **Belajar**: 5 langkah pendek, satu gagasan per layar, dengan contoh bertahap dan cek paham.
- **Main pizza**: kalkulator perbandingan dua pizza dengan ilustrasi **3D (three.js)**, dan Tantangan Pizza Hemat 6 ronde.
- **Latihan**: 8 soal cerita (2 per indikator Mathematical Literacy) dengan petunjuk, umpan balik langsung, dan pembahasan.
- **Tes Literasi**: 4 soal cerita sesuai file Kisi-Kisi (Reasoning, Formulating, Employing, Interpreting & Evaluating), dinilai per tahap, skor maksimal 24. Bisa dimatikan lewat `TES_AKTIF` di `src/config.js`.
- **Mode demo** (tanpa server) dan **mode Supabase** (opsional, gratis) untuk menyimpan hasil siswa.
- Tampilan mobile-first, nyaman di smartphone Android, bahasa Indonesia.

## Teknologi
JavaScript (ES modules), HTML, CSS. Tanpa tahap build. three.js dan supabase-js dimuat dari CDN (lihat import map di `index.html`), jadi perangkat butuh internet saat membuka aplikasi.

## Menjalankan di komputer
Prasyarat: Node.js dan npm.

```bash
cd pizza-lingkaran
npm start
```
Buka `http://localhost:3000`. Alternatif tanpa npm: `python -m http.server 3000`. Jangan buka `index.html` dengan klik dua kali (file://), karena browser memblokir ES modules.

Login di mode demo: ketik namamu (huruf saja, 2 sampai 30 karakter), misalnya `Dita Ayu`.

## Mengaktifkan Supabase (opsional)
1. Buat akun dan proyek gratis di supabase.com.
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`, lalu **Run**. Ubah daftar siswa di bagian akhir file. Kolom `code` diisi nama dalam HURUF BESAR.
3. Buka **Project Settings > API**, salin **Project URL** dan kunci **anon public**.
4. Isi keduanya di `src/config.js`. Jangan pernah memasukkan kunci `service_role`.
5. Muat ulang aplikasi. Catatan "Mode demo" akan hilang dan login hanya menerima nama yang ada di tabel `students`.

## Deploy gratis (mendapat link)
- **Netlify Drop**: buka app.netlify.com/drop lalu seret seluruh folder proyek ini. Link langsung jadi.
- **GitHub Pages**: unggah proyek ke GitHub, buka **Settings > Pages**, pilih branch `main` dan folder `/ (root)`. Link: `https://<username>.github.io/<nama-repo>/`.

## Struktur folder
```
index.html            halaman tunggal + import map
src/main.js           router, login, beranda
src/belajar.js        materi bertahap
src/main-pizza.js     kalkulator dan tantangan
src/latihan.js        latihan soal
src/tes.js            tes literasi (skor 24)
src/audio.js          musik latar dan efek suara (Web Audio)
src/mascot.js         maskot Piko
src/confetti.js       konfeti
src/data.js           isi materi dan soal (edit di sini)
src/pizza3d.js        ilustrasi 3D three.js
src/store.js          penyimpanan (Supabase atau localStorage)
src/config.js         pengaturan Supabase
supabase/schema.sql   skema database
docs/                 prd, architecture, design, api, task, hasil wawancara
agents.md             panduan untuk AI coding agent
```

## Dokumen
Lihat folder `docs/` dan `agents.md`.
