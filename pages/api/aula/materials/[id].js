import { requireAulaUser } from '../../../../lib/aulaServer';

const BUCKET = 'materiales';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método no permitido.' });
  try {
    const result = await requireAulaUser(req);
    if (result.error) return res.status(result.status).json({ error: result.error });
    if (result.profile.role !== 'teacher') return res.status(403).json({ error: 'Solo los docentes pueden eliminar material.' });

    const { data: material, error: findError } = await result.supabase
      .from('materials').select('id, file_path').eq('id', req.query.id).single();
    if (findError || !material) return res.status(404).json({ error: 'No se encontró el material.' });

    const { error: deleteError } = await result.supabase.from('materials').delete().eq('id', material.id);
    if (deleteError) throw deleteError;
    const { error: storageError } = await result.supabase.storage.from(BUCKET).remove([material.file_path]);
    if (storageError) console.error('No se pudo borrar el archivo del storage:', storageError);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Aula delete material:', error);
    return res.status(500).json({ error: 'No se pudo eliminar el material.' });
  }
}
