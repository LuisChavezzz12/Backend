const express = require("express");
const router = express.Router();
const mensajeController = require("../controllers/mensajeController");

// Ruta para recibir mensajes desde el formulario
router.post("/", mensajeController.enviarMensaje);

// Ruta para obtener mensajes (Panel de administración)
router.get("/", mensajeController.obtenerMensajes);

// Ruta para eliminar un mensaje
router.delete("/:id", mensajeController.eliminarMensaje);

module.exports = router;
import React, { useState } from "react";
import axios from "axios";


const InfoContacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://backend-alpha-neon.vercel.app/infoContacto",
        formData
      );
      setMensajeEnviado(true);
      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("❌ Hubo un error al enviar tu mensaje.");
    }
  };

  return (
    <div className="InfoContacto-container">
      <h2>Contáctanos</h2>
      <p>
        ¿Tienes alguna pregunta? Envíanos tu mensaje y te responderemos pronto.
      </p>
      {mensajeEnviado && (
        <p className="mensaje-exito">
          ✅ ¡Tu mensaje ha sido enviado con éxito!
        </p>
      )}
      <form onSubmit={handleSubmit} className="InfoContacto-form">
        <input
          type="text"
          name="nombre"
          placeholder="Tu Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Tu Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="mensaje"
          placeholder="Tu Mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Enviar Mensaje</button>
      </form>
    </div>
  );
};

export default InfoContacto;
