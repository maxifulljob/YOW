import { requireAulaUser } from '../../../lib/aulaServer';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });
  try {
    const result = await requireAulaUser(req);
    if (result.error) return res.status(result.status).json({ error: result.error });
    return res.status(200).json({ profile: result.profile });
  } catch (error) {
    console.error('Aula /me:', error);
    return res.status(500).json({ error: 'No se pudo validar el usuario.' });
  }
}
