import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  const { name, email, message } = req.body;

  // validaciones
  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  try {
    await resend.emails.send({
      from: 'Web Instituto <onboarding@resend.dev>',
      to: ['institutoyourownway@gmail.com'], 
      subject: 'Nueva consulta desde la web',
      html: `
        <h2>Nueva consulta</h2>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mensaje:</b> ${message}</p>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}