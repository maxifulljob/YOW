import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Inscripciones() {
  const contact = {
    title: "Sigamos en contacto",
    info: [
      {
        title: "Your Own Way",
        subtitle:
          "Mail, redes sociales o una consulta por nuestro formulario seran bienvenidos",
        address: {
          icon: <FaMapMarkerAlt />,
          name: "Emilio Lamarca 2300 (esquina Arregui)",
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

  return (
    <section
      id="inscripciones"
      className="section  py-[88px] md:py-[110px]
    lg:pt[140px] lg:pb-[180px]"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-y-16">
          <div className="flex-1 px-[30px]">
            <h2 className="h2 max-w-[490px]">{contact.title}</h2>

            <div className="flex flex-col xl:flex-row gap-x-5 gap-y-16 xl:gap-y-0">
              {contact.info.map((item, index) => {
                const { title, subtitle, address, phone, email, link } = item;
                return (
                  <div key={index}>
                    <div
                      data-aos="fade-in"
                      className="font-primary uppercase font-medium text-orange-400 text-xl mb-3"
                    >
                      {title}
                    </div>
                    <div
                      data-aos="fade-in"
                      delay="600"
                      className="mb-6 text-primary-600 leading-[187%] tracking-[0.02em] "
                    >
                      {subtitle}
                    </div>
                    <div
                      className="flex flex-col gap-y-3 mb-8"
                      data-aos="flip-left"
                      data-aos-easing="ease-out-cubic"
                      data-aos-duration="2000"
                    >
                      <div className="flex items-center gap-[10px]">
                        <div className="text-primary-100">{address.icon}</div>
                        <div className="font-medium">{address.name}</div>
                      </div>
                      <div className="flex items-center gap-[10px]">
                        <div className="text-primary-100">{phone.icon}</div>
                        <div className="font-medium">{phone.number}</div>
                      </div>
                      <div className="flex items-center gap-[10px]">
                        <div className="text-primary-100">{email.icon}</div>
                        <div className="font-medium">{email.address}</div>
                      </div>
                      <a
                        className="font-medium border-b border-dark pb-[5px]"
                        href="https://www.google.com/maps/place/Your+Own+Way+Instituto+de+idiomas/@-34.6155879,-58.5002087,20.25z/data=!4m15!1m8!3m7!1s0x95bcc9d86e580fdd:0x8f2e57166dc95c69!2sEmilio+Lamarca+2300,+C1417+Cdad.+Aut%C3%B3noma+de+Buenos+Aires!3b1!8m2!3d-34.6109689!4d-58.4953443!16s%2Fg%2F11y1d1l96m!3m5!1s0x95bcc9d86fc003ef:0x95ecf74fb136b6b1!8m2!3d-34.6154416!4d-58.5000299!16s%2Fg%2F11bzrd93_p?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                      >
                        {link}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 xl:pl-[40px] flex justify-center items-center px-3">
            <form
              className="flex flex-col gap-y-10 w-full"
              data-aos="zoom-in-left"
            >
              <input
                className="border b border-dark placeholder:text-orange-200
                italic tracking-[0.06em] outline-none pb-4 px-2"
                placeholder={contact.form.name}
                type="text"
              />
              <input
                className="border b border-dark placeholder:text-orange-200
                italic tracking-[0.06em] outline-none pb-4 px-2"
                placeholder={contact.form.email}
                type="text"
              />
              <textarea
                className="border b border-dark placeholder:text-orange-200
                italic tracking-[0.06em] outline-none pb-4 px-2"
                placeholder={contact.form.message}
                type="text"
              />
              <button className="btn btn-sm btn-primary self-start">
                {contact.form.btnText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Inscripciones;
