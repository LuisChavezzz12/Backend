const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  respuesta: { type: String, default: "" }, // Inicialmente sin respuesta
  estado: { type: String, enum: ["pendiente", "respondida"], default: "pendiente" },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FAQ", FAQSchema);
