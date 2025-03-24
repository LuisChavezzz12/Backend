require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");
const productoRoutes = require("./routes/productoRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const faqRoutes = require("./routes/faqRoutes");
const contactoRoutes = require("./routes/contactoRoutes");
const dispositivosRoutes = require("./routes/dispositivosRoutes");
const estadoRoutes = require("./routes/estadoRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
require("./mqtt-worker/mqttWorker"); // 🟢 Ejecutar el worker MQTT

const app = express();

// Conectar a MongoDB
conectarDB();

// Middlewares
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
app.use("/mqtt", mqttRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ API funcionando correctamente");
});

// 🟢 Iniciar servidor en Render (Render necesita que se escuche en un puerto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
