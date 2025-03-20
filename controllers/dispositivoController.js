const Dispositivo = require("../models/Dispositivo");

// ✅ Crear un nuevo dispositivo
exports.crearDispositivo = async (req, res) => {
  const { usuario, nombreProducto, nombreDispositivo, ipDispositivo, idProducto, estado } = req.body;

  if (!usuario) {
    return res.status(400).json({ message: "❌ Error: Se requiere un usuario." });
  }

  try {
    const nuevoDispositivo = new Dispositivo({
      usuario, // ID del usuario
      nombreProducto,
      nombreDispositivo,
      ipDispositivo,
      idProducto,
      estado: estado || "Online",
    });

    await nuevoDispositivo.save();
    res.status(201).json({ message: "✅ Dispositivo registrado exitosamente" });
  } catch (error) {
    console.error("❌ Error al registrar dispositivo:", error);
    res.status(500).json({ message: "❌ Error al registrar dispositivo" });
  }
};

// ✅ Obtener dispositivos por ID de usuario desde la URL
exports.obtenerDispositivos = async (req, res) => {
  const { idUsuario } = req.params; // Obtener userId de la URL

  if (!idUsuario) {
    return res.status(400).json({ message: "❌ Se requiere un ID de usuario." });
  }

  try {
    const dispositivos = await Dispositivo.find({ usuario: idUsuario });

    if (dispositivos.length === 0) {
      return res.status(404).json({ message: "❌ No hay dispositivos registrados para este usuario." });
    }

    res.json(dispositivos);
  } catch (error) {
    console.error("❌ Error al obtener dispositivos:", error);
    res.status(500).json({ message: "❌ Error en el servidor." });
  }
};

// ✅ Obtener un dispositivo específico por ID
exports.obtenerDispositivo = async (req, res) => {
  const { id } = req.params;

  try {
    const dispositivo = await Dispositivo.findById(id);
    if (!dispositivo) {
      return res.status(404).json({ message: "❌ Dispositivo no encontrado." });
    }

    res.json(dispositivo);
  } catch (error) {
    console.error("❌ Error al obtener el dispositivo:", error);
    res.status(500).json({ message: "❌ Error en el servidor." });
  }
};

// ✅ Actualizar nombre e IP de un dispositivo
exports.actualizarDispositivo = async (req, res) => {
  const { id } = req.params;
  const { nombreDispositivo, ipDispositivo } = req.body;

  try {
    const dispositivo = await Dispositivo.findById(id);
    if (!dispositivo) {
      return res.status(404).json({ message: "❌ Dispositivo no encontrado." });
    }

    // Actualizar solo los campos enviados
    if (nombreDispositivo) dispositivo.nombreDispositivo = nombreDispositivo;
    if (ipDispositivo) dispositivo.ipDispositivo = ipDispositivo;

    await dispositivo.save();
    res.json({ message: "✅ Dispositivo actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar el dispositivo:", error);
    res.status(500).json({ message: "❌ Error en el servidor." });
  }
};

// ✅ Eliminar un dispositivo
exports.eliminarDispositivo = async (req, res) => {
  const { id } = req.params;

  try {
    const dispositivo = await Dispositivo.findById(id);
    if (!dispositivo) {
      return res.status(404).json({ message: "❌ Dispositivo no encontrado." });
    }

    await Dispositivo.findByIdAndDelete(id);
    res.json({ message: "✅ Dispositivo eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar el dispositivo:", error);
    res.status(500).json({ message: "❌ Error en el servidor." });
  }
};
