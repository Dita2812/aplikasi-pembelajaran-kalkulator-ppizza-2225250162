# PRD: Pizza Lingkaran

## Latar belakang
Siswa SMP sering menghafal rumus keliling dan luas lingkaran tanpa memahami kapan dan mengapa dipakai. Akibatnya mereka salah memakai diameter sebagai jari-jari, dan sulit menyelesaikan soal cerita. Aplikasi ini membantu siswa memahami konsep lewat konteks sehari-hari (pizza) dan melatih Mathematical Literacy.

## Tujuan
1. Siswa memahami keliling dan luas lingkaran, serta hubungan jari-jari dan diameter.
2. Siswa meningkat pada empat indikator Mathematical Literacy: Reasoning, Formulating, Employing, Interpreting & Evaluating.
3. Beban kognitif siswa terkendali (lihat `design.md`).

## Pengguna
Siswa SMP kelas 8 semester 2 (Bab Lingkaran). Memakai smartphone Android. Guru atau dosen sebagai penilai dan pengelola daftar siswa.

## Ruang lingkup
Dalam lingkup:
- Login dengan nama siswa.
- Halaman awal dengan tiga kegiatan.
- Materi 5 langkah dengan cek paham.
- Kalkulator perbandingan dua pizza dengan ilustrasi 3D.
- Permainan Tantangan Pizza Hemat (6 ronde).
- Latihan 8 soal dengan petunjuk dan pembahasan.
- Penyimpanan hasil (Supabase atau perangkat).

Di luar lingkup (versi ini): materi selain Keliling dan Luas Lingkaran, dashboard guru, login dengan kata sandi, mode luring penuh.

## Kebutuhan fungsional
| Kode | Kebutuhan |
|---|---|
| F1 | Siswa masuk dengan namanya. Nama tidak valid ditolak dengan pesan jelas. |
| F2 | Beranda menampilkan tiga kegiatan dan skor terbaik. |
| F3 | Materi tampil bertahap. Tombol Lanjut aktif setelah cek paham dijawab benar. |
| F4 | Kalkulator menghitung jari-jari, keliling, luas, harga per cm² untuk dua pizza, dan menyimpulkan yang lebih hemat. |
| F5 | Ilustrasi 3D pizza berubah ukuran mengikuti diameter. |
| F6 | Tantangan: 6 ronde acak, umpan balik dengan langkah hitung, skor akhir. |
| F7 | Latihan: soal pilihan dan angka (koma desimal diterima), petunjuk bertahap, pembahasan, ringkasan per indikator. |
| F8 | Hasil materi, tantangan, latihan, dan tes disimpan per siswa. |
| F9 | Tes Literasi: 4 soal bertahap sesuai kisi-kisi, dinilai otomatis, skor maksimal 24, tanpa petunjuk. |
| F10 | Musik latar dan efek suara, dengan tombol untuk mematikan. Level bintang di beranda. |

## Kebutuhan non-fungsional
- Mobile-first, nyaman di layar 360 px ke atas, target sentuh minimal 48 px.
- Bahasa Indonesia.
- Tetap berfungsi tanpa 3D dan tanpa Supabase.
- Menghormati preferensi gerak berkurang dan mode gelap.

## Ukuran keberhasilan
- Selisih skor pre-test dan post-test Mathematical Literacy (soal tes dibuat terpisah dari soal latihan).
- Siswa menyelesaikan 5 langkah materi dan minimal satu latihan.
- Masukan dari wawancara siswa (`hasil-wawancara.md`).

## Risiko
- Internet dibutuhkan untuk memuat three.js dan Supabase dari CDN.
- Login hanya dengan nama, bukan autentikasi kuat. Dua siswa dengan nama sama akan berbagi hasil. Cukup untuk prototipe kelas, bukan untuk produksi.
