const EstadoActual = require("../models/EstadoActual");

exports.obtenerEstadoDispositivo = async (req, res) => {
  const { dispositivo } = req.params;

  try {
    const estado = await EstadoActual.findOne({ dispositivo });

    if (!estado) {
      return res.status(404).json({ message: "Dispositivo no encontrado" });
    }

    res.json(estado);
  } catch (error) {
    console.error("Error al obtener estado:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
