const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get('/:id', obtenerUsuarioPorId);

// Ruta para agregar un nuevo usuario
router.post('/', agregarUsuario);

// Ruta para actualizar un usuario
router.put('/:id', actualizarUsuario);

// Ruta para eliminar un usuario
router.delete('/:id', eliminarUsuario);

module.exports = router;