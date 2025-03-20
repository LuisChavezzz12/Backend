const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: true,
  },
  respuesta: {
    type: String,
    default: "", // Inicialmente vacía, hasta que un admin la responda
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Faq", FaqSchema);
