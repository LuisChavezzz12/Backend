const express = require("express");
const router = express.Router();
const { obtenerContacto, actualizarContacto } = require("../controllers/contactoController");

router.get("/", obtenerContacto);
router.put("/", actualizarContacto); // Permite actualizar los datos

module.exports = router;
