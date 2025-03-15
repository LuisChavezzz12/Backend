const FAQ = require("../models/FAQ");

// Crear una nueva pregunta
exports.enviarPregunta = async (req, res) => {
  try {
    const { pregunta } = req.body;
    if (!pregunta) {
      return res.status(400).json({ message: "❌ La pregunta es obligatoria." });
    }

    const nuevaPregunta = new FAQ({ pregunta });
    await nuevaPregunta.save();

    res.status(201).json({ message: "✅ Pregunta enviada correctamente." });
  } catch (error) {
    console.error("❌ Error al enviar la pregunta:", error);
    res.status(500).json({ message: "❌ Error en el servidor." });
  }
};

// Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
  try {
    const preguntas = await FAQ.find().sort({ fecha: -1 });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ message: "❌ Error al obtener preguntas.", error: error.message });
  }
};

// Responder una pregunta (solo admin)
exports.responderPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const pregunta = await FAQ.findById(id);
    if (!pregunta) {
      return res.status(404).json({ message: "❌ Pregunta no encontrada." });
    }

    pregunta.respuesta = respuesta;
    pregunta.estado = "respondida";
    await pregunta.save();

    res.json({ message: "✅ Pregunta respondida correctamente.", pregunta });
  } catch (error) {
    res.status(500).json({ message: "❌ Error al responder la pregunta.", error: error.message });
  }
};

// Eliminar una pregunta
exports.eliminarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.json({ message: "✅ Pregunta eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "❌ Error al eliminar la pregunta.", error: error.message });
  }
};
