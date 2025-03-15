const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');

// Ruta para obtener los datos de la empresa
router.get('/', getAbout);

// Ruta para actualizar los datos de la empresa
router.put('/', updateAbout);

module.exports = router;