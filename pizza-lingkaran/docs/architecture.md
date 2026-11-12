# Arsitektur

## Gambaran
Aplikasi satu halaman (SPA) statis. Tidak ada server sendiri dan tidak ada tahap build.

```
Browser (Android)
  index.html + import map
    src/main.js ──> router hash (#/, #/belajar, #/main, #/latihan)
      ├─ belajar.js      materi bertahap
      ├─ main-pizza.js   kalkulator + tantangan
      ├─ latihan.js      latihan soal
      └─ store.js ──> Supabase (RPC + insert)  atau  localStorage (mode demo)
    pizza3d.js ──> three.js (CDN)
```

## Keputusan utama
| Keputusan | Alasan |
|---|---|
| Situs statis tanpa build | Mudah di-host gratis (GitHub Pages, Netlify), tidak butuh `npm install`. |
| three.js dan supabase-js dari CDN (import map) | Tidak perlu bundler. Dimuat dengan `import()` dinamis, jadi kegagalan CDN tidak merusak aplikasi. |
| Router hash | Berjalan di hosting statis tanpa pengaturan server. |
| Dua mode penyimpanan | Mode demo untuk presentasi tanpa internet database. Mode Supabase untuk data kelas. |
| Setiap layar berupa fungsi `(container, ctx) => cleanup` | Sederhana. `cleanup` menghentikan animasi 3D saat pindah halaman. |

## Data
- `students(code, name, kelas)`: daftar siswa. `code` berisi nama dalam huruf besar. Tidak bisa dibaca langsung oleh publik.
- `results(id, student_code, kind, score, total, detail, created_at)`: hasil. `kind` salah satu dari `materi`, `game`, `latihan`.
- Fungsi `cek_kode(kode)` dan `hasil_siswa(kode)` berjalan dengan hak `security definer`, sehingga siswa hanya bisa memeriksa satu kode dan membaca hasil kode itu.

## Keamanan dan batasan
- Kunci `anon` Supabase memang publik. Row Level Security aktif.
- Nama bukan kata sandi. Siapa pun yang tahu nama siswa bisa melihat hasil siswa itu. Cukup untuk prototipe kelas. Untuk produksi, pakai Supabase Auth.
- Tidak ada data pribadi selain nama dan kelas yang diisi guru.

## Alur data
1. Login: `cek_kode` dengan nama huruf besar (Supabase) atau validasi format (demo). Sesi disimpan di localStorage.
2. Selesai materi, tantangan, atau latihan: `saveResult` menambah satu baris `results`.
3. Beranda: `getResults` mengambil hasil, lalu menampilkan skor terbaik.
