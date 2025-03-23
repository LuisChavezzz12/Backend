const express = require("express");
const router = express.Router();
const estadoController = require("../controllers/estadoController");

// Ruta para obtener el estado actual de un dispositivo
router.get("/:dispositivo", estadoController.obtenerEstadoDispositivo);

module.exports = router;
