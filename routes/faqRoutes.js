const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");

// Rutas para las preguntas frecuentes
router.post("/", faqController.enviarPregunta); // ✅ Enviar una pregunta
router.get("/", faqController.obtenerPreguntas); // ✅ Obtener todas las preguntas
router.put("/:id", faqController.responderPregunta); // ✅ Responder una pregunta
router.delete("/:id", faqController.eliminarPregunta); // ✅ Eliminar una pregunta

module.exports = router;
