// models/EstadoActual.js
const mongoose = require("mongoose");

const estadoActualSchema = new mongoose.Schema({
  idDispositivo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Dispositivo", 
    required: true, 
    unique: true 
  },
  dispositivo: { type: String, required: true }, // nombre del dispositivo (configurado por el usuario)
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
