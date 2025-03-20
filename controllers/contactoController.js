const Contacto = require("../models/Contacto");

exports.obtenerContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findOne();
    if (!contacto) {
      return res.status(404).json({ message: "No se encontraron datos de contacto" });
    }
    res.json(contacto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos de contacto", error });
  }
};

exports.actualizarContacto = async (req, res) => {
  try {
    const { nombreEmpresa, direccion, telefono, correo, ubicacion, horarios_atencion, redes_sociales } = req.body;

    const contacto = await Contacto.findOneAndUpdate({}, {
      nombreEmpresa, direccion, telefono, correo, ubicacion, horarios_atencion, redes_sociales, 
      fecha_actualizacion: new Date()
    }, { new: true, upsert: true });

    res.json({ message: "Datos actualizados correctamente", contacto });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar los datos", error });
  }
};
