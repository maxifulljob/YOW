
import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Inscripciones() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const contact = {
    title: "Sigamos en contacto",
    info: [
      {
        title: "Your Own Way",
        subtitle:
          "Mail, redes sociales o una consulta por nuestro formulario seran bienvenidos",
        address: {
          icon: <FaMapMarkerAlt />,
          name: "Lascano 4212",
        },
        phone: {
          icon: <FaPhoneAlt />,
          number: "+54 11 5858 8428",
        },
        email: {
          icon: <FaEnvelope />,
          address: "institutoyourownway@gmail.com",
        },
        link: "Ver en mapa",
      },
    ],
    form: {
      name: "Nombre y Apellido",
      email: "Email",
      message: "Mensaje",
      btnText: "Enviar",
    },
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("No se pudo enviar el mensaje");
      }

      setStatus("¡Mensaje enviado correctamente! Gracias por contactarnos.");
      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (error) {
      setStatus("Hubo un problema al enviar el mensaje. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="inscripciones"
      className="section py-[88px] md:py-[110px] lg:pt[140px] lg:pb-[180px]"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-y-16">

          <div className="flex-1 px-[30px]">
            <h2 className="h2 max-w-[490px]">{contact.title}</h2>

            {contact.info.map((item, index) => {
              const { title, subtitle, address, phone, email, link } = item;

              return (
                <div key={index}>
                  <div className="font-primary uppercase font-medium text-orange-400 text-xl mb-3">
                    {title}
                  </div>

                  <div className="mb-6 text-primary-600 leading-[187%]">
                    {subtitle}
                  </div>

                  <div className="flex flex-col gap-y-3 mb-8">
                    <div className="flex items-center gap-[10px]">
                      {address.icon}
                      {address.name}
                    </div>

                    <div className="flex items-center gap-[10px]">
                      {phone.icon}
                      {phone.number}
                    </div>

                    <div className="flex items-center gap-[10px]">
                      {email.icon}
                      {email.address}
                    </div>

                    <a
                      className="font-medium border-b border-dark pb-[5px]"
                      href="https://www.google.com/maps/place/Your+Own+Way+Instituto+de+idiomas/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 xl:pl-[40px] flex justify-center items-center px-3">

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-10 w-full"
              data-aos="zoom-in-left"
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                className="border border-dark placeholder:text-orange-200 italic tracking-[0.06em] outline-none pb-4 px-2"
                placeholder={contact.form.name}
                type="text"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="border border-dark placeholder:text-orange-200 italic tracking-[0.06em] outline-none pb-4 px-2"
                placeholder={contact.form.email}
                type="email"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                minLength={5}
                rows={5}
                className="border border-dark placeholder:text-orange-200 italic tracking-[0.06em] outline-none pb-4 px-2"
                placeholder={contact.form.message}
              />

              <button
                type="submit"
                disabled={loading}
                className="btn btn-sm btn-primary self-start disabled:opacity-50"
              >
                {loading ? "Enviando..." : contact.form.btnText}
              </button>

              {status && (
                <p className="font-medium text-sm" role="status">
                  {status}
                </p>
              )}

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Inscripciones;
