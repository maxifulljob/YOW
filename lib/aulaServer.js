import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function requireAulaUser(req) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return { error: 'Sesión no válida. Volvé a iniciar sesión.', status: 401 };

  const supabase = getSupabaseAdmin();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return { error: 'La sesión venció. Volvé a iniciar sesión.', status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role, course_id')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'Tu usuario todavía no tiene un perfil del aula asignado. Consultá al instituto.', status: 403 };
  }
  if (!['teacher', 'student'].includes(profile.role)) {
    return { error: 'Tu usuario no tiene permisos para ingresar al aula.', status: 403 };
  }

  return { supabase, user: authData.user, profile };
}
