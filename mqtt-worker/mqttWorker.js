// config/mqttClient.js
require("dotenv").config();
const mongoose = require("mongoose");
const mqtt = require("mqtt");
const EstadoActual = require("../models/EstadoActual");

const options = {
  clientId: "worker_" + Math.random().toString(16).slice(2, 10),
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 2000,
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error Mongo:", err));

const client = mqtt.connect(
  "wss://fa9707a6.ala.us-east-1.emqxsl.com:8084/mqtt",
  options
);

client.on("connect", () => {
  console.log("✅ Conectado a EMQX");
  client.subscribe("esp32/#");
});

client.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log(`📥 MQTT -> ${topic}: ${payload}`);

  try {
    const { dispositivo, valor, accion } = JSON.parse(payload);
    const parts = topic.split("/");
    const campo = parts[1];
    const isControlTopic = parts[2] === "control";
    const isComandoTopic = parts[2] === "comando";

    if (!dispositivo || !campo) return;
    if (dispositivo !== "cuna_unica") return;

    const valorNormalizado = isControlTopic ? Number(valor) : valor;
    const esActuador = ["reproductor", "carrusel", "nema"].includes(campo);

    const actualizacion = { fecha: new Date() };

    // Si es un comando del reproductor, no se actualiza en Mongo
    if (isComandoTopic && campo === "reproductor") {
      console.log(`🎵 Comando de reproductor recibido: ${accion}`);
      return; // No guardar en Mongo
    }

    if (esActuador || (!isControlTopic && !esActuador)) {
      actualizacion[campo] = valorNormalizado;
    }

    if (campo in actualizacion) {
      await EstadoActual.findOneAndUpdate(
        { dispositivo: "cuna_unica" },
        {
          $set: actualizacion,
          $setOnInsert: { dispositivo: "cuna_unica" },
        },
        { upsert: true, new: true }
      );
      console.log(`✅ Mongo actualizado: ${campo} = ${valorNormalizado}`);
    }
  } catch (err) {
    console.error("❌ Error al guardar en MongoDB:", err.message);
  }
});

module.exports = client;
