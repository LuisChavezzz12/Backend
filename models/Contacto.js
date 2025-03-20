const mongoose = require("mongoose");

const ContactoSchema = new mongoose.Schema({
  nombreEmpresa: String,
  direccion: String,
  telefono: String,
  correo: String,
  ubicacion: String, // 🔥 Nuevo campo para el enlace de Maps
  horarios_atencion: {
    lunes_viernes: String,
    sabado: String,
    domingo: String
  },
  redes_sociales: {
    facebook: String,
    instagram: String
  },
  fecha_actualizacion: Date
});

module.exports = mongoose.model("Contacto", ContactoSchema);
