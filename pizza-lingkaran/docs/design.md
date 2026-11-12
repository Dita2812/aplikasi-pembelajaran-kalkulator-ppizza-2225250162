# Desain

## Pengelolaan Cognitive Load
Tabel ini memetakan keputusan desain ke tiga jenis beban kognitif. Sesuaikan dengan temuan di `hasil-wawancara.md`.

| Jenis beban | Strategi | Wujud di aplikasi |
|---|---|---|
| Intrinsic (kesulitan materi) | Pecah materi (segmenting), urut dari mudah ke sulit | Materi 5 langkah, satu gagasan per layar. Bagian lingkaran, keliling, luas, memilih, mengecek kewajaran |
| Intrinsic | Contoh terpecahkan (worked example) | Kotak "Contoh" berisi langkah bernomor sebelum siswa mencoba |
| Extraneous (beban dari tampilan) | Hindari elemen yang tidak perlu, label menyatu dengan gambar | Satu tujuan per layar, label r, d, O langsung di diagram, navigasi bawah tetap |
| Extraneous | Hindari pembagian perhatian | Angka hasil tampil tepat di bawah gambar 3D dan slider |
| Extraneous | Tanpa batas waktu | Tantangan dan latihan tidak memakai timer |
| Germane (beban membangun pemahaman) | Umpan balik langsung dan pembahasan | Setiap jawaban diikuti penjelasan langkah |
| Germane | Petunjuk bertahap | Tombol "Butuh petunjuk" membuka petunjuk satu per satu |
| Germane | Kesalahan umum dijadikan pelajaran | Langkah 5 dan soal Interpreting membahas "diameter dipakai sebagai jari-jari" |

## Pemetaan Mathematical Literacy
| Indikator | Di materi | Di latihan | Di permainan |
|---|---|---|---|
| Reasoning | Langkah 4 (memilih yang hemat) | Soal 1 dan 5 | Tantangan Pizza Hemat |
| Formulating | Langkah 2 dan 3 (rumus dari konteks) | Soal 2 dan 6 | Kalkulator |
| Employing | Contoh bertahap | Soal 3 dan 7 | Langkah hitung di umpan balik |
| Interpreting & Evaluating | Langkah 5 | Soal 4 dan 8 | Kesimpulan "lebih hemat" |

Soal latihan sengaja berbeda dari soal tes Mathematical Literacy supaya hasil pre-test dan post-test tidak bias.

## Keterlibatan siswa (gamifikasi)
- Maskot Piko memberi umpan balik pada jawaban benar dan salah.
- Musik latar dan efek suara dibuat di browser. Ada tombol speaker untuk mematikan. Musik baru mulai setelah layar disentuh.
- Konfeti saat selesai. Dimatikan otomatis bila perangkat memakai "kurangi gerakan".
- Level bintang di beranda (Pemula sampai Master Lingkaran) memberi tujuan jangka pendek.

## Tes Literasi
Soal tes sama dengan file Kisi-Kisi Mathematical Literacy: Reasoning (pizza tiga ukuran), Formulating (renda taplak), Employing (putaran roda), Interpreting & Evaluating (koreksi hitungan piring). Tiap soal dipecah menjadi tahap sesuai kisi-kisi, skor 6 per soal, total 24. Siswa tidak melihat jawaban benar sampai tes selesai.

## Gaya visual
- Warna: biru (aksi utama), merah (pizza A), hijau (benar), kuning keju dan cokelat kerak untuk ilustrasi.
- Huruf: Bricolage Grotesque untuk judul, Nunito Sans untuk teks. Ada huruf cadangan sistem.
- Mode terang dan gelap mengikuti pengaturan perangkat.
- Target sentuh minimal 48 px. Teks gelap di atas latar terang (dan sebaliknya) untuk keterbacaan.
- Animasi 3D berhenti berputar bila perangkat memakai "kurangi gerakan".

## Layar
1. Login: satu kolom nama siswa.
2. Beranda: tiga kartu kegiatan dengan skor terbaik.
3. Belajar: indikator langkah, gambar, poin, contoh, cek paham, Sebelumnya dan Lanjut.
4. Main: tab Kalkulator dan Tantangan.
5. Latihan: satu soal per layar, ringkasan per indikator di akhir.
