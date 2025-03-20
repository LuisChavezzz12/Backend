const express = require("express");
const router = express.Router();
const { crearPregunta, obtenerPreguntas, responderPregunta } = require("../controllers/faqController");

// Ruta para enviar una nueva pregunta
router.post("/", crearPregunta);

// Ruta para obtener todas las preguntas
router.get("/", obtenerPreguntas);

// Ruta para responder una pregunta (por ID)
router.put("/:id", responderPregunta);

module.exports = router;
