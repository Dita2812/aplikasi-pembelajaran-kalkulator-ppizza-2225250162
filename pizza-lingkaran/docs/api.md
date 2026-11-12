# API dan data

Aplikasi tidak punya server sendiri. Semua akses data lewat Supabase (mode Supabase) atau localStorage (mode demo). Fungsi di `src/store.js`:

| Fungsi | Keterangan |
|---|---|
| `login(nama)` | Merapikan nama, memvalidasi huruf 2 sampai 30 karakter, mengubahnya jadi huruf besar sebagai kunci, lalu memanggil `cek_kode`. Menyimpan sesi. |
| `getSession()` | Mengembalikan `{code, name}` atau `null`. |
| `logout()` | Menghapus sesi. |
| `saveResult(kode, {kind, score, total, detail})` | Menambah satu hasil. |
| `getResults(kode)` | Mengambil semua hasil satu siswa, terbaru dulu. |
| `best(results, kind)` | Hasil terbaik berdasarkan rasio skor per total. |

## Endpoint Supabase
Semua lewat supabase-js dengan kunci `anon`.

### `rpc('cek_kode', { kode })`
Mengembalikan baris `{ code, name }` bila kode ada, atau daftar kosong.

### `rpc('hasil_siswa', { kode })`
Mengembalikan semua baris `results` milik kode itu.

### `from('results').insert({...})`
| Kolom | Tipe | Isi |
|---|---|---|
| `student_code` | text | Nama siswa huruf besar. Harus ada di `students`. |
| `kind` | text | `materi`, `game`, `latihan`, atau `tes` |
| `score` | int | Skor |
| `total` | int | Skor maksimal |
| `detail` | jsonb | Rincian. Untuk latihan: `{ per: {indikator: {benar, total}}, hasil: [...] }` |

## Contoh data
```json
{ "student_code": "DITA AYU", "kind": "latihan", "score": 6, "total": 8,
  "detail": { "per": { "Reasoning": { "benar": 2, "total": 2 } } } }
```

## Melihat hasil kelas (untuk guru)
Di Supabase buka **Table Editor > results**, atau jalankan di SQL Editor:
```sql
select student_code, kind, max(score::float / total) as terbaik
from results group by student_code, kind order by student_code;
```
