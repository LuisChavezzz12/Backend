const Faq = require("../models/Faq");

// Guardar una nueva pregunta
exports.crearPregunta = async (req, res) => {
  try {
    const { pregunta } = req.body;
    if (!pregunta) {
      return res.status(400).json({ msg: "La pregunta no puede estar vacía." });
    }

    const nuevaPregunta = new Faq({ pregunta });
    await nuevaPregunta.save();
    res.status(201).json({ msg: "Pregunta enviada con éxito." });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

// Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
  try {
    const preguntas = await Faq.find();
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

// Responder una pregunta (usado por administradores)
exports.responderPregunta = async (req, res) => {
  try {
    const { respuesta } = req.body;
    const { id } = req.params;

    const pregunta = await Faq.findById(id);
    if (!pregunta) {
      return res.status(404).json({ msg: "Pregunta no encontrada." });
    }

    pregunta.respuesta = respuesta;
    await pregunta.save();
    res.status(200).json({ msg: "Pregunta respondida con éxito." });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};
