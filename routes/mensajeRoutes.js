const express = require("express");
const router = express.Router();
const mensajeController = require("../controllers/mensajeController");

// Enviar un mensaje
router.post("/", mensajeController.enviarMensaje);

// Obtener todos los mensajes
router.get("/", mensajeController.obtenerMensajes);

// Eliminar un mensaje
router.delete("/:id", mensajeController.eliminarMensaje);

module.exports = router;
