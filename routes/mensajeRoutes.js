const express = require("express");
const router = express.Router();
const cors = require("cors");
const mensajeController = require("../controllers/mensajeController");

const corsOptions = {
  origin: ["http://localhost:3000", "https://tudominio.vercel.app"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// ✅ Aplica CORS solo en esta ruta
router.use(cors(corsOptions));

// Ruta para recibir mensajes desde el formulario
router.post("/", mensajeController.enviarMensaje);

// Ruta para obtener mensajes
router.get("/", mensajeController.obtenerMensajes);

// Ruta para eliminar mensajes
router.delete("/:id", mensajeController.eliminarMensaje);

module.exports = router;
