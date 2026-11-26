import { requireAulaUser } from '../../../lib/aulaServer';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });
  try {
    const result = await requireAulaUser(req);
    if (result.error) return res.status(result.status).json({ error: result.error });

    let query = result.supabase.from('courses').select('id, name').eq('active', true).order('name');
    if (result.profile.role === 'student') {
      if (!result.profile.course_id) return res.status(200).json({ courses: [] });
      query = query.eq('id', result.profile.course_id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return res.status(200).json({ courses: data || [] });
  } catch (error) {
    console.error('Aula courses:', error);
    return res.status(500).json({ error: 'No se pudieron cargar los cursos.' });
  }
}
