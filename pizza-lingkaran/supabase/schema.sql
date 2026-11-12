-- Skema Supabase untuk Pizza Lingkaran.
-- Cara pakai: Supabase > SQL Editor > New query > tempel semua isi file ini > Run.

create table if not exists students (
  code  text primary key,          -- nama siswa dalam HURUF BESAR, persis seperti yang diketik siswa, contoh DITA AYU
  name  text not null,
  kelas text
);

create table if not exists results (
  id           bigint generated always as identity primary key,
  student_code text not null references students(code) on delete cascade,
  kind         text not null check (kind in ('materi', 'game', 'latihan', 'tes')),
  score        int  not null,
  total        int  not null,
  detail       jsonb default '{}'::jsonb,
  created_at   timestamptz default now()
);

alter table students enable row level security;
alter table results  enable row level security;

-- Tabel students tidak bisa dibaca langsung oleh publik (tidak ada policy select).
-- Siswa hanya boleh menambah hasil. Nama siswa yang tidak ada ditolak oleh foreign key.
drop policy if exists "anon boleh tambah hasil" on results;
create policy "anon boleh tambah hasil" on results for insert to anon with check (true);

-- Login: daftarkan nama baru otomatis, lalu kembalikan data siswa.
create or replace function cek_kode(kode text)
returns table (code text, name text)
language plpgsql security definer set search_path = public as $$
begin
  insert into public.students (code, name)
  values (upper(trim(kode)), initcap(lower(trim(kode))))
  on conflict on constraint students_pkey do nothing;

  return query
  select s.code, s.name
  from public.students s
  where s.code = upper(trim(kode));
end;
$$;

-- Ambil hasil milik satu siswa.
create or replace function hasil_siswa(kode text)
returns setof results
language sql security definer set search_path = public as $$
  select * from results where student_code = upper(trim(kode)) order by created_at desc;
$$;

grant execute on function cek_kode(text)    to anon;
grant execute on function hasil_siswa(text) to anon;

-- Contoh data siswa. Ganti dengan nama siswa sebenarnya. Kolom code = nama dalam huruf besar.
insert into students (code, name, kelas) values
  ('DITA AYU', 'Dita Ayu', '8A'),
  ('BUDI SANTOSO', 'Budi Santoso', '8A'),
  ('RINA', 'Rina', '8A')
on conflict (code) do nothing;
