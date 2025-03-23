// config/mqttClient.js
const mqtt = require('mqtt');
const EstadoActual = require('../models/EstadoActual');

const options = {
  clientId: 'backend_' + Math.random().toString(16).slice(2, 10),
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 2000,
};

const client = mqtt.connect('wss://fa9707a6.ala.us-east-1.emqxsl.com:8084/mqtt', options);

client.on('connect', () => {
  console.log('✅ Backend conectado a EMQX Cloud');
  client.subscribe('esp32/#'); // suscribirse a todos los topics del ESP32
});

client.on('message', async (topic, message) => {
  const payload = message.toString();
  console.log(`📥 MQTT -> ${topic}: ${payload}`);

  try {
    const { dispositivo, valor } = JSON.parse(payload);
    const parts = topic.split('/');
    const campo = parts[1];
    const isControlTopic = parts[2] === 'control';

    if (!dispositivo || !campo) return;

    const valorNormalizado = isControlTopic ? Number(valor) : valor;
    const esActuador = ['reproductor', 'carrusel', 'nema'].includes(campo);

    // Solo guardar sensores normales o comandos de actuadores
    if ((isControlTopic && esActuador) || (!isControlTopic && !esActuador)) {
      const actualizacion = {
        [campo]: valorNormalizado,
        fecha: new Date()
      };

      const result = await EstadoActual.findOneAndUpdate(
        { dispositivo },
        {
          $set: actualizacion,
          $setOnInsert: { dispositivo }
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Mongo actualizado: ${dispositivo}.${campo} = ${valorNormalizado}`);
    }

  } catch (err) {
    console.error('❌ Error al guardar en MongoDB:', err.message);
  }
});

module.exports = client;
