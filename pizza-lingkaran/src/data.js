// Isi materi dan soal latihan. Ubah di sini kalau mau mengganti konten.
// Catatan: soal latihan sengaja berbeda dari soal tes Mathematical Literacy (pre/post-test).

export const MATERI = [
  {
    id: 'bagian',
    judul: 'Kenali bagian lingkaran',
    visual: 'diagram',
    poin: [
      '<strong>Pusat (O)</strong> adalah titik tepat di tengah lingkaran.',
      '<strong>Jari-jari (r)</strong> adalah jarak dari pusat ke tepi.',
      '<strong>Diameter (d)</strong> membelah lingkaran lewat pusat. Panjangnya 2 kali jari-jari: <strong>d = 2 × r</strong>.',
    ],
    cek: {
      tanya: 'Sebuah pizza berdiameter 30 cm. Berapa jari-jarinya?',
      opsi: ['15 cm', '30 cm', '60 cm'],
      benar: 0,
      jelas: 'Jari-jari adalah setengah diameter: r = 30 : 2 = 15 cm.',
      petunjuk: 'Jari-jari adalah setengah dari diameter.',
    },
  },
  {
    id: 'keliling',
    judul: 'Keliling: panjang tepi lingkaran',
    visual: 'keliling',
    poin: [
      '<strong>Keliling</strong> adalah panjang garis di tepi lingkaran, misalnya panjang kerak pizza.',
      'Keliling selalu kira-kira <strong>3,14 kali diameter</strong>. Angka 3,14 disebut π (dibaca "pi").',
      'Rumus: <strong>K = π × d</strong>, atau <strong>K = 2 × π × r</strong>.',
    ],
    contoh: {
      judul: 'Contoh: panjang kerak pizza berdiameter 28 cm (π = 22/7)',
      langkah: ['Tulis rumus: K = π × d', 'Masukkan angka: K = 22/7 × 28', 'Hitung: K = 88 cm'],
    },
    cek: {
      tanya: 'Roda berdiameter 14 cm. Berapa kelilingnya? (π = 22/7)',
      opsi: ['28 cm', '44 cm', '154 cm'],
      benar: 1,
      jelas: 'K = π × d = 22/7 × 14 = 44 cm.',
      petunjuk: 'Pakai K = π × d, lalu masukkan d = 14.',
    },
  },
  {
    id: 'luas',
    judul: 'Luas: isi di dalam lingkaran',
    visual: 'pizza3d',
    poin: [
      '<strong>Luas</strong> adalah banyak ruang di dalam lingkaran, misalnya isi pizza.',
      'Rumus: <strong>L = π × r × r</strong>. Jari-jari dipakai dua kali.',
      'Satuannya persegi, misalnya <strong>cm²</strong>.',
    ],
    cek: {
      tanya: 'Jari-jari sebuah pizza 21 cm. Berapa luasnya? (π = 22/7)',
      opsi: ['132 cm²', '1.386 cm²', '2.772 cm²'],
      benar: 1,
      jelas: 'L = π × r × r = 22/7 × 21 × 21 = 1.386 cm².',
      petunjuk: 'Kalikan π dengan r dua kali: 22/7 × 21 × 21.',
    },
  },
  {
    id: 'hemat',
    judul: 'Memakai rumus untuk memilih',
    visual: null,
    poin: [
      'Pizza besar belum tentu lebih mahal per potongnya. Bandingkan <strong>harga per cm²</strong>.',
      'Hitung luas dulu, lalu bagi harga dengan luas.',
    ],
    contoh: {
      judul: 'Contoh: A (d 20 cm, Rp40.000) lawan B (d 30 cm, Rp80.000), π = 3,14',
      langkah: [
        'Jari-jari: A = 10 cm, B = 15 cm',
        'Luas: A = 3,14 × 10 × 10 = 314 cm². B = 3,14 × 15 × 15 = 706,5 cm²',
        'Harga per cm²: A = 40.000 : 314 ≈ Rp127. B = 80.000 : 706,5 ≈ Rp113',
        'Kesimpulan: B lebih hemat',
      ],
    },
    cek: {
      tanya: 'Pizza D berdiameter 40 cm, harga Rp120.000, luas 1.256 cm². Berapa harga per cm²?',
      opsi: ['Sekitar Rp95', 'Sekitar Rp150', 'Sekitar Rp300'],
      benar: 0,
      jelas: '120.000 : 1.256 ≈ Rp95,5 per cm².',
      petunjuk: 'Bagi harga dengan luasnya: 120.000 : 1.256.',
    },
  },
  {
    id: 'masukakal',
    judul: 'Cek apakah hasilnya masuk akal',
    visual: null,
    poin: [
      'Kesalahan paling sering: memakai <strong>diameter</strong> sebagai jari-jari.',
      'Cek cepat keliling: hasilnya harus sekitar <strong>3 kali diameter</strong>.',
      'Cek cepat luas: lingkaran muat di dalam persegi bersisi d, jadi <strong>luas harus kurang dari d × d</strong>.',
    ],
    contoh: {
      judul: 'Contoh: kolam berdiameter 10 m. Seseorang menulis L = 3,14 × 10 × 10 = 314 m²',
      langkah: [
        'Perkiraan: luas kolam kurang dari 10 × 10 = 100 m²',
        '314 m² lebih besar dari 100 m², jadi tidak masuk akal',
        'Kesalahan: 10 adalah diameter, bukan jari-jari',
        'Yang benar: r = 5 m, L = 3,14 × 5 × 5 = 78,5 m²',
      ],
    },
    cek: {
      tanya: 'Keliling roda berdiameter 40 cm dihitung dan hasilnya 12,56 cm. Masuk akal?',
      opsi: [
        'Masuk akal',
        'Tidak masuk akal. Kelilingnya harus sekitar 3 × 40 = 120 cm',
        'Tidak masuk akal. Kelilingnya harus sekitar 4 cm',
      ],
      benar: 1,
      jelas: 'K = 3,14 × 40 = 125,6 cm. Hasil 12,56 cm jauh lebih kecil dari diameternya, jadi pasti keliru.',
      petunjuk: 'Keliling harus sekitar 3 kali diameter.',
    },
  },
];

export const INDIKATOR = {
  Reasoning: 'Membandingkan pilihan, lalu memutuskan dengan alasan matematis.',
  Formulating: 'Mengubah cerita menjadi model matematika.',
  Employing: 'Memakai rumus untuk menghitung jawaban.',
  'Interpreting & Evaluating': 'Menilai apakah hasil hitungan masuk akal.',
};

// tipe 'pilihan' memakai opsi + benar (indeks). tipe 'angka' memakai jawaban + satuan.
export const SOAL = [
  {
    indikator: 'Reasoning',
    tipe: 'pilihan',
    teks: 'Dua toko menjual kue tart bundar. Tart A berdiameter 14 cm harganya Rp35.000. Tart B berdiameter 21 cm harganya Rp70.000. Tart mana yang lebih hemat per cm²? (π = 22/7)',
    opsi: ['Tart A', 'Tart B', 'Keduanya sama hemat'],
    benar: 1,
    hint: ['Hitung luas tiap tart dulu dengan L = π × r × r.', 'Bagi harga dengan luas untuk mendapat harga per cm².'],
    bahas: 'Luas A = 22/7 × 7 × 7 = 154 cm², harga per cm² ≈ Rp227. Luas B = 22/7 × 10,5 × 10,5 = 346,5 cm², harga per cm² ≈ Rp202. Tart B lebih hemat.',
  },
  {
    indikator: 'Formulating',
    tipe: 'pilihan',
    teks: 'Sebuah taman bundar berdiameter 28 m. Tepi taman akan dipagari kawat. Kawat dijual Rp8.000 per meter. Model matematika mana yang tepat untuk biaya kawat? (π = 22/7)',
    opsi: ['2 × 22/7 × 28 × 8.000', '22/7 × 14 × 14 × 8.000', '22/7 × 28 × 8.000'],
    benar: 2,
    hint: ['Kawat dipasang di tepi taman. Bagian lingkaran yang mana yang dihitung?'],
    bahas: 'Tepi taman adalah keliling. K = π × d = 22/7 × 28 = 88 m. Biaya = 88 × Rp8.000 = Rp704.000.',
  },
  {
    indikator: 'Employing',
    tipe: 'angka',
    teks: 'Ban sepeda motor berdiameter 56 cm. Sepeda motor itu menempuh jarak 880 meter. Berapa kali ban berputar penuh? (π = 22/7)',
    jawaban: 500,
    satuan: 'kali',
    hint: ['Cari keliling ban dulu: K = π × d.', 'Ubah cm ke meter, lalu bagi jarak dengan keliling.'],
    bahas: 'K = 22/7 × 56 = 176 cm = 1,76 m. Banyak putaran = 880 : 1,76 = 500 kali.',
  },
  {
    indikator: 'Interpreting & Evaluating',
    tipe: 'pilihan',
    teks: 'Sinta menghitung keliling pizza berdiameter 30 cm: K = 2 × 3,14 × 30 = 188,4 cm. Apakah hasil Sinta masuk akal?',
    opsi: [
      'Masuk akal karena rumusnya benar',
      'Tidak masuk akal. Sinta memakai diameter sebagai jari-jari. Seharusnya K = 94,2 cm',
      'Tidak masuk akal. Seharusnya K = 47,1 cm',
    ],
    benar: 1,
    hint: ['Keliling harus sekitar 3 kali diameter. Berapa 3 × 30?'],
    bahas: 'Rumus 2 × π × r butuh jari-jari. Sinta memasukkan diameter (30). Seharusnya r = 15, K = 2 × 3,14 × 15 = 94,2 cm.',
  },
  {
    indikator: 'Reasoning',
    tipe: 'pilihan',
    teks: 'Pak Budi punya dua kolam bundar. Jari-jari kolam kecil 7 m dan kolam besar 14 m. Pak Budi bilang, "Jari-jarinya 2 kali, jadi luas kolam besar juga 2 kali kolam kecil." Bagaimana pendapatmu? (π = 22/7)',
    opsi: [
      'Setuju, luasnya 2 kali',
      'Tidak setuju, luasnya 4 kali',
      'Tidak setuju, luasnya 3 kali',
    ],
    benar: 1,
    hint: ['Hitung luas kedua kolam, lalu bandingkan.'],
    bahas: 'Luas kecil = 22/7 × 7 × 7 = 154 m². Luas besar = 22/7 × 14 × 14 = 616 m². 616 : 154 = 4. Jari-jari 2 kali membuat luas 4 kali.',
  },
  {
    indikator: 'Formulating',
    tipe: 'pilihan',
    teks: 'Bu Ani membeli kain bundar berjari-jari 21 cm untuk alas meja. Kain dijual Rp50 per cm². Model matematika mana yang tepat untuk biaya kain? (π = 22/7)',
    opsi: ['2 × 22/7 × 21 × 50', '22/7 × 21 × 21 × 50', '22/7 × 42 × 42 × 50'],
    benar: 1,
    hint: ['Kain menutupi seluruh permukaan alas. Yang dihitung keliling atau luas?'],
    bahas: 'Kain menutupi permukaan, jadi pakai luas. L = 22/7 × 21 × 21 = 1.386 cm². Biaya = 1.386 × Rp50 = Rp69.300.',
  },
  {
    indikator: 'Employing',
    tipe: 'angka',
    teks: 'Keliling sebuah lapangan bundar adalah 154 m. Berapa meter jari-jari lapangan itu? (π = 22/7)',
    jawaban: 24.5,
    satuan: 'm',
    hint: ['Pakai K = 2 × π × r, lalu cari r.', 'r = K : (2 × π) = 154 : (2 × 22/7).'],
    bahas: 'r = 154 : (2 × 22/7) = 154 : 44/7 = 154 × 7/44 = 24,5 m.',
  },
  {
    indikator: 'Interpreting & Evaluating',
    tipe: 'pilihan',
    teks: 'Eko menghitung luas kolam bundar berjari-jari 10 m dengan cara: L = 2 × 3,14 × 10 = 62,8 m². Apakah hasil Eko benar?',
    opsi: [
      'Benar, kolamnya memang kecil',
      'Salah. Seharusnya 31,4 m²',
      'Salah. Eko memakai rumus keliling. Luas yang benar 314 m²',
    ],
    benar: 2,
    hint: ['Rumus 2 × π × r adalah rumus untuk apa?'],
    bahas: '2 × π × r adalah rumus keliling. Luas = π × r × r = 3,14 × 10 × 10 = 314 m². Cek: kolam muat di persegi 20 m × 20 m = 400 m², jadi 314 m² masuk akal.',
  },
];

// Soal tes Mathematical Literacy (sesuai file Kisi-Kisi). Tiap soal 6 poin, total 24.
// Soal dipecah per tahap agar bisa dinilai otomatis. Jangan ubah tanpa mengubah kisi-kisi di Word.
export const TES = [
  {
    indikator: 'Reasoning',
    cerita: [
      'Pizzeria Lumbung menjual pizza berbentuk lingkaran dalam tiga ukuran: Kecil (diameter 14 cm) Rp28.000, Sedang (diameter 21 cm) Rp56.000, dan Besar (diameter 28 cm) Rp84.000.',
      'Rina ingin membeli pizza yang paling hemat, yaitu yang harga per cm² paling murah. Ukuran mana yang sebaiknya dipilih Rina? Jelaskan dengan perhitungan. (Gunakan π = 22/7)',
    ],
    tahap: [
      { tanya: 'Berapa jari-jari pizza Kecil, Sedang, dan Besar?', opsi: ['14 cm, 21 cm, 28 cm', '7 cm, 10,5 cm, 14 cm', '3,5 cm, 5,25 cm, 7 cm'], benar: 1, skor: 1 },
      { tanya: 'Berapa luas pizza Kecil, Sedang, dan Besar?', opsi: ['44 cm², 66 cm², 88 cm²', '308 cm², 693 cm², 1.232 cm²', '154 cm², 346,5 cm², 616 cm²'], benar: 2, skor: 2 },
      { tanya: 'Berapa harga per cm² pizza Kecil, Sedang, dan Besar?', opsi: ['Rp2.000, Rp2.667, Rp3.000', 'Rp181,8, Rp161,6, Rp136,4', 'Rp136,4, Rp161,6, Rp181,8'], benar: 1, skor: 2 },
      { tanya: 'Pizza ukuran mana yang paling hemat?', opsi: ['Kecil', 'Sedang', 'Besar'], benar: 2, skor: 1 },
    ],
  },
  {
    indikator: 'Formulating',
    cerita: [
      'Bu Sari membuat taplak meja bundar berdiameter 140 cm. Di sepanjang tepi taplak akan dipasang renda. Renda dijual Rp12.000 per meter.',
      'Tuliskan model matematika untuk menentukan (a) panjang renda yang dibutuhkan dan (b) biaya membeli renda. Belum perlu dihitung sampai hasil akhir. (Gunakan π = 22/7)',
    ],
    tahap: [
      { tanya: 'Berapa jari-jari taplak?', jawaban: 70, satuan: 'cm', skor: 1 },
      { tanya: 'Panjang renda sama dengan bagian lingkaran yang mana?', opsi: ['Luas', 'Keliling', 'Diameter'], benar: 1, skor: 1 },
      { tanya: 'Model matematika untuk panjang renda?', opsi: ['K = 22/7 × 70 × 70', 'K = 2 × 22/7 × 140', 'K = 2 × 22/7 × 70'], benar: 2, skor: 2 },
      { tanya: 'Model matematika untuk biaya renda?', opsi: ['Biaya = Luas × 12.000', 'Biaya = (K dalam meter) × 12.000, dengan 100 cm = 1 m', 'Biaya = K (dalam cm) × 12.000'], benar: 1, skor: 2 },
    ],
  },
  {
    indikator: 'Employing',
    cerita: [
      'Roda sepeda Budi berdiameter 70 cm. Jarak rumah Budi ke sekolah adalah 1.980 meter.',
      'Berapa kali roda berputar penuh sampai Budi tiba di sekolah? (Gunakan π = 22/7)',
    ],
    tahap: [
      { tanya: 'Rumus keliling roda dengan angka yang dimasukkan?', opsi: ['K = 22/7 × 70 × 70', 'K = 22/7 × 35', 'K = 22/7 × 70'], benar: 2, skor: 2 },
      { tanya: 'Berapa keliling roda?', jawaban: 220, satuan: 'cm', skor: 1 },
      { tanya: 'Berapa keliling roda dalam meter?', jawaban: 2.2, satuan: 'm', skor: 1 },
      { tanya: 'Cara menghitung banyak putaran?', opsi: ['1.980 × 2,2', '2,2 : 1.980', '1.980 : 2,2'], benar: 2, skor: 1 },
      { tanya: 'Berapa kali roda berputar?', jawaban: 900, satuan: 'kali', skor: 1 },
    ],
  },
  {
    indikator: 'Interpreting & Evaluating',
    cerita: [
      'Doni menghitung luas piring makan berdiameter 20 cm dengan cara berikut: L = 3,14 × 20 × 20 = 1.256 cm².',
      'Doni berkata, "Luas piringku 1.256 cm²." Apakah jawaban Doni masuk akal? Jelaskan, temukan kesalahannya, lalu tuliskan jawaban yang benar.',
    ],
    tahap: [
      { tanya: 'Apakah jawaban Doni masuk akal?', opsi: ['Masuk akal', 'Tidak masuk akal'], benar: 1, skor: 1 },
      { tanya: 'Mengapa?', opsi: ['Luas piring selalu sama dengan kelilingnya', 'Piring muat di dalam persegi 20 cm × 20 cm (400 cm²), jadi luasnya harus kurang dari 400 cm². Angka 1.256 cm² terlalu besar', 'Luas piring harus lebih besar dari 2.000 cm²'], benar: 1, skor: 2 },
      { tanya: 'Apa kesalahan Doni?', opsi: ['Memakai nilai π yang salah', 'Memakai diameter sebagai jari-jari', 'Salah mengalikan 3,14 × 20'], benar: 1, skor: 1 },
      { tanya: 'Perhitungan yang benar?', opsi: ['L = 3,14 × 20', 'L = 2 × 3,14 × 10', 'L = 3,14 × 10 × 10'], benar: 2, skor: 1 },
      { tanya: 'Berapa luas piring yang benar?', jawaban: 314, satuan: 'cm²', skor: 1 },
    ],
  },
];
