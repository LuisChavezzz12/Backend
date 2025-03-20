const express = require("express");
const router = express.Router();
const dispositivoController = require("../controllers/dispositivoController");

// Ruta para registrar un dispositivo
router.post("/", dispositivoController.crearDispositivo);

// Ruta para obtener los dispositivos por ID de usuario en la URL
router.get("/:idUsuario", dispositivoController.obtenerDispositivos);

// ✅ Ruta para obtener un dispositivo específico por ID
router.get("/dispositivo/:id", dispositivoController.obtenerDispositivo);

// ✅ Ruta para actualizar un dispositivo (editar IP y nombre)
router.put("/dispositivo/:id", dispositivoController.actualizarDispositivo);

module.exports = router;
