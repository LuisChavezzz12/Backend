  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const conectarDB = require("./config/db");
  const productoRoutes = require("./routes/productoRoutes");
  const authRoutes = require("./routes/authRoutes");
  const userRoutes = require("./routes/userRoutes");
  const aboutRoutes = require("./routes/aboutRoutes");

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

  // Ruta raíz de prueba
  app.get("/", (req, res) => {
    res.send("Servidor en funcionamiento 🚀");
  });

  // ❌ NO USAR `app.listen()` en Vercel
  module.exports = app;
