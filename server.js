require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const productoRoutes = require("./routes/productoRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const faqRoutes = require("./routes/faqRoutes");
const contactoRoutes = require("./routes/contactoRoutes"); // 🚀 Importar la nueva ruta
const dispositivosRoutes = require("./routes/dispositivosRoutes");
const estadoRoutes = require("./routes/estadoRoutes");
const app = express();

// Conectar a MongoDB Atlas
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/productos", productoRoutes);
app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/nosotros", aboutRoutes);
app.use("/faqs", faqRoutes);
app.use("/contacto", contactoRoutes);
app.use("/dispositivos", dispositivosRoutes);
app.use("/estado", estadoRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Servidor en funcionamiento 🚀");
});

require("./config/mqttClient");

// ❌ NO USAR `app.listen()` en Vercel
module.exports = app;
