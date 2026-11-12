// Fungsi bantu: format angka Indonesia, escape HTML, baca jawaban siswa.

export const PI = 3.14;

export const fmt = (n, d = 2) =>
  new Intl.NumberFormat('id-ID', { maximumFractionDigits: d }).format(n);

export const rp = (n) =>
  'Rp' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(n));

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "24,5" -> 24.5, "22.000" -> 22000, "24.5" -> 24.5
export function parseNum(raw) {
  let t = String(raw).trim().replace(/\s/g, '');
  if (!t) return NaN;
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '');
  t = t.replace(',', '.');
  return Number(t);
}

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
