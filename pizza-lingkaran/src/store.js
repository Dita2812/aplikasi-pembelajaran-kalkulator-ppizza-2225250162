// Penyimpanan data. Kalau Supabase diisi di src/config.js, data ke Supabase.
// Kalau tidak, aplikasi jalan di MODE DEMO dan data disimpan di perangkat (localStorage).
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const isDemo = !(SUPABASE_URL && SUPABASE_ANON_KEY);

// Pustaka Supabase baru dimuat kalau memang dipakai, supaya mode demo tidak butuh internet.
let clientPromise = null;
function supabaseClient() {
  if (isDemo) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    );
  }
  return clientPromise;
}

const SESSION_KEY = 'pizza-lingkaran.session';
const RESULT_KEY = 'pizza-lingkaran.results';

const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* penyimpanan diblokir, abaikan */
  }
};

export const getSession = () => read(SESSION_KEY, null);

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* abaikan */
  }
}

// Siswa masuk dengan namanya. Nama dirapikan (spasi, huruf besar-kecil) dan dipakai sebagai kunci.
export async function login(raw) {
  const typed = String(raw).trim().replace(/\s+/g, ' ');
  if (!/^[A-Za-z][A-Za-z .'-]{1,29}$/.test(typed)) {
    throw new Error('Tulis namamu dengan huruf saja, 2 sampai 30 karakter.');
  }
  const code = typed.toUpperCase();
  const niceName = typed.toLowerCase().replace(/(^|[ .'-])([a-z])/g, (m, p, c) => p + c.toUpperCase());
  let user;
  const supabase = await supabaseClient().catch(() => null);
  if (!isDemo && !supabase) throw new Error('Tidak bisa terhubung ke server. Periksa internetmu lalu coba lagi.');
  if (supabase) {
    const { data, error } = await supabase.rpc('cek_kode', { kode: code });
    if (error) throw new Error('Tidak bisa terhubung ke server. Periksa internetmu lalu coba lagi.');
    if (!data || !data.length) throw new Error('Namamu belum terdaftar. Periksa tulisannya atau tanyakan ke gurumu.');
    user = { code: data[0].code, name: data[0].name };
  } else {
    user = { code, name: niceName };
  }
  write(SESSION_KEY, user);
  return user;
}

export async function saveResult(code, { kind, score, total, detail = {} }) {
  const supabase = await supabaseClient();
  if (supabase) {
    const { error } = await supabase.from('results').insert({ student_code: code, kind, score, total, detail });
    if (error) throw error;
    return;
  }
  const all = read(RESULT_KEY, []);
  all.push({ student_code: code, kind, score, total, detail, created_at: new Date().toISOString() });
  write(RESULT_KEY, all);
}

export async function getResults(code) {
  const supabase = await supabaseClient().catch(() => null);
  if (supabase) {
    const { data, error } = await supabase.rpc('hasil_siswa', { kode: code });
    return error ? [] : data || [];
  }
  return read(RESULT_KEY, [])
    .filter((r) => r.student_code === code)
    .reverse();
}

export function best(results, kind) {
  const list = results.filter((r) => r.kind === kind);
  if (!list.length) return null;
  return list.reduce((a, b) => (b.score / b.total > a.score / a.total ? b : a));
}
