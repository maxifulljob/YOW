-- Ejecutar una sola vez en Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('teacher', 'student')),
  course_id uuid references public.courses(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint student_must_have_course check (role <> 'student' or course_id is not null)
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  class_date date not null,
  file_path text not null,
  file_name text not null,
  file_type text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists materials_course_date_idx on public.materials(course_id, class_date desc);

-- Bucket privado: los archivos solo se entregan mediante enlaces firmados temporales.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'materiales',
  'materiales',
  false,
  8388608,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 8388608,
  allowed_mime_types = excluded.allowed_mime_types;

-- La aplicación consulta/escribe usando la clave service role exclusivamente desde API routes.
-- No habilitar acceso público al bucket ni exponer SUPABASE_SERVICE_ROLE_KEY al navegador.
alter table public.courses enable row level security;
alter table public.profiles enable row level security;
alter table public.materials enable row level security;

-- Ejemplo para cargar cursos (editar nombres según la oferta vigente del instituto):
-- insert into public.courses (name) values
-- ('1st Children'), ('2nd Children'), ('3rd Children'),
-- ('2nd Teens'), ('3rd Teens'), ('Juniors 3/4')
-- on conflict (name) do nothing;

-- Después de crear cada usuario en Authentication > Users, obtener su UUID y asignar perfil:
-- DOCENTE (course_id NULL):
-- insert into public.profiles (id, full_name, role, course_id)
-- values ('UUID_DEL_USUARIO', 'Nombre del docente', 'teacher', null);
-- ALUMNO (usar el UUID del curso correspondiente):
-- insert into public.profiles (id, full_name, role, course_id)
-- values ('UUID_DEL_USUARIO', 'Nombre del alumno', 'student', 'UUID_DEL_CURSO');
