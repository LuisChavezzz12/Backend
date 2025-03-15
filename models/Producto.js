const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  imagen: { type: String, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcionExtra: { type: String, required: true },
  caracteristicas: [{ type: String }],
  imagenesAdicionales: [{ type: String }]
});

const Producto = mongoose.model("Producto", productoSchema);
module.exports = Producto;
