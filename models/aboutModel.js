const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  mision: { type: String, required: true },
  vision: { type: String, required: true },
  historia: { type: String, required: true },
  valores: { type: [String], required: true },
  equipo: [
    {
      nombre: { type: String, required: true },
      cargo: { type: String, required: true },
      descripcion: { type: String, required: true },
    },
  ],
  contacto: {
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
  },
}, { collection: 'nosotros' }); // Asegúrate de que apunte a la colección "nosotros"

module.exports = mongoose.model('About', aboutSchema);