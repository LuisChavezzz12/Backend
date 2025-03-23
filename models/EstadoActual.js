// models/EstadoActual.js
const mongoose = require("mongoose");

const estadoActualSchema = new mongoose.Schema({
  dispositivo: { type: String, required: true, unique: true },
  temperatura: Number,
  humedad: Number,
  sonido: Number,
  reproductor: String,
  carrusel: String,
  nema: String,
  ip: String,
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EstadoActual", estadoActualSchema);
