const express = require("express");
const router = express.Router();
const mqtt = require("mqtt");
require("dotenv").config();

const options = {
  clientId: "mqtt_api_" + Math.random().toString(16).substr(2, 8),
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
};

const client = mqtt.connect("wss://fa9707a6.ala.us-east-1.emqxsl.com:8084/mqtt", options);

client.on("connect", () => {
  console.log("✅ Conectado a MQTT desde API");
});

router.post("/enviar", (req, res) => {
  const { topic, dispositivo, valor, accion } = req.body;

  if (!topic || !dispositivo || (valor === undefined && !accion)) {
    return res.status(400).json({ message: "❌ Faltan campos requeridos." });
  }

  const payload = JSON.stringify(
    accion !== undefined
      ? { dispositivo, accion }
      : { dispositivo, valor }
  );

  client.publish(topic, payload, {}, (err) => {
    if (err) {
      console.error("❌ Error al publicar en MQTT:", err);
      return res.status(500).json({ message: "❌ Error al publicar en MQTT" });
    }

    console.log(`✅ Publicado en ${topic}: ${payload}`);
    return res.status(200).json({ message: "✅ Mensaje enviado por MQTT" });
  });
});

module.exports = router;
