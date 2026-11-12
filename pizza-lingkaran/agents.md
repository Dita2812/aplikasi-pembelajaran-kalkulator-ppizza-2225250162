# Panduan untuk AI coding agent

Proyek: Pizza Lingkaran. Aplikasi belajar keliling dan luas lingkaran untuk siswa SMP kelas 8. Baca `README.md` dan `docs/` sebelum mengubah kode.

## Aturan umum
- Bahasa antarmuka, teks soal, dan komentar: **Bahasa Indonesia** yang sederhana untuk siswa SMP.
- Tanpa tahap build. Jangan menambahkan bundler atau framework. Pakai JavaScript ES modules.
- Pustaka luar hanya lewat import map di `index.html`, dengan versi yang dikunci. Muat dengan `import()` dinamis supaya kegagalan jaringan tidak merusak aplikasi.
- Mobile-first. Uji di lebar 360 sampai 400 px. Target sentuh minimal 48 px.
- Setiap warna memakai variabel CSS di `src/style.css`. Dukung mode terang dan gelap.
- Hormati `prefers-reduced-motion`.
- Musik dan efek suara hanya lewat `src/audio.js`. Selalu sediakan cara mematikannya.
- Soal tes di `TES` (`src/data.js`) harus tetap sama dengan file Kisi-Kisi. Jangan mengubahnya tanpa mengubah kisi-kisi.

## Struktur kode
- Setiap layar adalah fungsi `(container, ctx) => cleanup`. `cleanup` wajib menghentikan animasi dan listener.
- Isi materi dan soal hanya di `src/data.js`.
- Penyimpanan hanya lewat `src/store.js`. Jangan memanggil Supabase dari layar.
- Ilustrasi 3D hanya lewat `createPizzaScene` di `src/pizza3d.js`.

## Aturan pedagogis (jangan dilanggar)
- Satu gagasan per layar. Jangan menambah teks panjang.
- Setiap jawaban diikuti umpan balik dan pembahasan langkah.
- Tidak ada timer.
- Soal latihan harus berbeda dari soal tes Mathematical Literacy (pre/post-test). Jangan menyalin soal tes ke aplikasi.
- Nilai π: 3,14 atau 22/7, dan selalu disebutkan di soal.
- Pembahasan harus bisa diperiksa. Hitung ulang setiap angka sebelum menyimpan soal baru.

## Keamanan
- Jangan memasukkan kunci `service_role` atau rahasia apa pun ke repositori.
- Kunci `anon` boleh di `src/config.js`.

## Cara menguji manual
1. `npm start`, buka `http://localhost:3000`.
2. Login dengan nama, misalnya `Dita Ayu`.
3. Selesaikan 5 langkah Belajar, mainkan Kalkulator dan Tantangan, kerjakan 8 soal Latihan.
4. Pastikan tidak ada error di konsol browser dan tidak ada scroll horizontal di lebar 390 px.
