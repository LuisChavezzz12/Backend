// models/Dispositivo.js
const mongoose = require("mongoose");

const dispositivoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nombreProducto: { type: String, required: true },
  nombreDispositivo: { type: String, required: true },
  idProducto: { type: String, required: true },
  estado: { type: String, default: "online" }, //  ✅ Forzar "online"
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dispositivo", dispositivoSchema);
