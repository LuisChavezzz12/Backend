const About = require("../models/aboutModel");

const getAbout = async (req, res) => {
  try {
    const aboutData = await About.findOne(); // Busca el primer documento en la colección
    res.json(aboutData); // Envía el documento como respuesta
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAbout };

// Crear o actualizar los datos de la empresa
const updateAbout = async (req, res) => {
  try {
    const aboutData = req.body;
    const updatedData = await About.findOneAndUpdate({}, aboutData, {
      new: true,
      upsert: true, // Si no existe, crea un nuevo documento
    });
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAbout, updateAbout };
