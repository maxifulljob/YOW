import { randomUUID } from 'crypto';
import { requireAulaUser } from '../../../lib/aulaServer';

const BUCKET = 'materiales';
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]);

export const config = {
  api: { bodyParser: { sizeLimit: '12mb' } },
};

export default async function handler(req, res) {
  try {
    const result = await requireAulaUser(req);
    if (result.error) return res.status(result.status).json({ error: result.error });
    const { supabase, profile, user } = result;

    if (req.method === 'GET') {
      const courseId = typeof req.query.courseId === 'string' ? req.query.courseId : '';
      const classDate = typeof req.query.date === 'string' ? req.query.date : '';
      if (profile.role === 'student' && profile.course_id !== courseId) {
        return res.status(403).json({ error: 'No tenés acceso a ese curso.' });
      }
      if (!courseId) return res.status(400).json({ error: 'Seleccioná un curso.' });

      let query = supabase
        .from('materials')
        .select('id, course_id, title, description, class_date, file_path, file_name, file_type, created_at')
        .eq('course_id', courseId)
        .order('class_date', { ascending: false })
        .order('created_at', { ascending: false });
      if (classDate) query = query.eq('class_date', classDate);
      const { data, error } = await query;
      if (error) throw error;

      const materials = await Promise.all((data || []).map(async (item) => {
        const { data: signed, error: signedError } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(item.file_path, 60 * 10, { download: item.file_name });
        const { file_path, ...publicItem } = item;
        return { ...publicItem, downloadUrl: signedError ? null : signed?.signedUrl || null };
      }));
      return res.status(200).json({ materials });
    }

    if (req.method === 'POST') {
      if (profile.role !== 'teacher') return res.status(403).json({ error: 'Solo los docentes pueden publicar material.' });
      const { courseId, title, description = '', classDate, fileName, fileType, fileBase64 } = req.body || {};
      if (!courseId || !title?.trim() || !classDate || !fileName || !fileType || !fileBase64) {
        return res.status(400).json({ error: 'Completá curso, fecha, título y archivo.' });
      }
      if (!ALLOWED_TYPES.has(fileType)) return res.status(400).json({ error: 'Formato no permitido. Usá PDF, Word, JPG o PNG.' });
      const buffer = Buffer.from(fileBase64, 'base64');
      if (!buffer.length || buffer.length > MAX_FILE_BYTES) {
        return res.status(400).json({ error: 'El archivo debe pesar como máximo 8 MB.' });
      }
      const { data: course, error: courseError } = await supabase
        .from('courses').select('id').eq('id', courseId).eq('active', true).single();
      if (courseError || !course) return res.status(400).json({ error: 'El curso seleccionado no existe o está inactivo.' });

      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
      const filePath = `${courseId}/${Date.now()}-${randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, { contentType: fileType, upsert: false });
      if (uploadError) throw uploadError;

      const { data: inserted, error: insertError } = await supabase
        .from('materials')
        .insert({
          course_id: courseId,
          title: title.trim().slice(0, 120),
          description: String(description).trim().slice(0, 1000),
          class_date: classDate,
          file_path: filePath,
          file_name: safeName,
          file_type: fileType,
          created_by: user.id,
        })
        .select('id')
        .single();
      if (insertError) {
        await supabase.storage.from(BUCKET).remove([filePath]);
        throw insertError;
      }
      return res.status(201).json({ success: true, id: inserted.id });
    }

    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('Aula materials:', error);
    return res.status(500).json({ error: 'No se pudo procesar el material. Revisá la configuración de Supabase.' });
  }
}
