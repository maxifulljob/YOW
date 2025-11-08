import { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) setStatus("Correo enviado con éxito ✅");
    else setStatus("Error al enviar el correo ❌");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Contacto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Tu nombre"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Tu correo"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <textarea
          name="message"
          placeholder="Tu mensaje"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Enviar
        </button>
      </form>
      <p className="mt-3">{status}</p>
    </div>
  );
}
