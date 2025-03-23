const mqtt = require("mqtt");
const EstadoActual = require("../models/EstadoActual");

const options = {
  clientId: "backend_" + Math.random().toString(16).slice(2, 10),
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 2000,
};

const client = mqtt.connect(
  "wss://fa9707a6.ala.us-east-1.emqxsl.com:8084/mqtt",
  options
);

client.on("connect", () => {
  console.log("✅ Backend conectado a EMQX Cloud");
  client.subscribe("esp32/#");
});

client.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log(`📥 MQTT -> ${topic}: ${payload}`);

  try {
    const { dispositivo, valor } = JSON.parse(payload);
    const parts = topic.split("/");
    const campo = parts[1]; // reproductor, carrusel, nema, etc.

    // Solo guardar si viene de 'cuna_unica'
    if (dispositivo !== "cuna_unica") return;

    // Validar si es sensor o actuador (pero sin importar si es de control o no)
    const camposPermitidos = [
      "temperatura", "humedad", "sonido",
      "reproductor", "carrusel", "nema"
    ];
    if (!camposPermitidos.includes(campo)) return;

    const actualizacion = {
      [campo]: Number(valor), // convierte a número 0 o 1
      fecha: new Date(),
    };

    await EstadoActual.findOneAndUpdate(
      { dispositivo: "cuna_unica" },
      {
        $set: actualizacion,
        $setOnInsert: { dispositivo: "cuna_unica" },
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Mongo actualizado: ${campo} = ${valor}`);
  } catch (err) {
    console.error("❌ Error al guardar en MongoDB:", err.message);
  }
});

module.exports = client;
