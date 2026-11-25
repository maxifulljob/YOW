
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método no permitido",
    });
  }

  const { name, email, message } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ success: false });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    cleanName.length < 2 ||
    cleanName.length > 100 ||
    !emailRegex.test(cleanEmail) ||
    cleanMessage.length < 5 ||
    cleanMessage.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos",
    });
  }

  try {
    const result = await resend.emails.send({
      from: "Web Instituto <onboarding@resend.dev>",
      to: ["maxbonn1975@gmail.com"],
      replyTo: cleanEmail,
      subject: "Nueva consulta desde Your Own Way",
      html: `
        <h2>Nueva consulta desde la página web</h2>
        <p><b>Nombre:</b> ${escapeHtml(cleanName)}</p>
        <p><b>Email:</b> ${escapeHtml(cleanEmail)}</p>
        <p><b>Mensaje:</b></p>
        <p>${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (result.error) {
      console.error("Error Resend:", result.error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error enviando correo:", error);
    return res.status(500).json({ success: false });
  }
}
