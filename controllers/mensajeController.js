const Mensaje = require("../models/Mensaje");

// Guardar un nuevo mensaje
exports.enviarMensaje = async (req, res) => {
  try {
    const nuevoMensaje = new Mensaje(req.body);
    await nuevoMensaje.save();
    res.status(201).json({ message: "✅ Mensaje enviado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error al enviar el mensaje", error: error.message });
  }
};

// Obtener todos los mensajes
exports.obtenerMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ message: "❌ Error al obtener los mensajes", error: error.message });
  }
};

// Eliminar un mensaje
exports.eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    await Mensaje.findByIdAndDelete(id);
    res.json({ message: "✅ Mensaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error al eliminar el mensaje", error: error.message });
  }
};
