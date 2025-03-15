const User = require('../models/User');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find(); // Obtener todos los usuarios
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener los usuarios', error: error.message });
  }
};

// Obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findById(id); // Buscar usuario por ID
    if (!usuario) {
      return res.status(404).json({ message: '❌ Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener el usuario', error: error.message });
  }
};


// Función para agregar un nuevo usuario
exports.agregarUsuario = async (req, res) => {
  try {
    console.log('Datos recibidos en req.body:', req.body);
    const { username, email, phone, password, secretQuestion, secretAnswer } = req.body;

    if (!username || !email || !phone || !password || !secretQuestion || !secretAnswer) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const nuevoUsuario = new User({
      username,
      email,
      phone,
      password,
      secretQuestion,
      secretAnswer,
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: '✅ Usuario registrado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error en el backend:', error);
    res.status(500).json({ message: '❌ Error al registrar el usuario', error: error.message });
  }
};

// Actualizar un usuario por su ID
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica que el rol sea válido
    if (req.body.role && !["user", "admin"].includes(req.body.role)) {
      return res.status(400).json({ message: "❌ Rol no válido" });
    }

    // Actualiza solo el campo 'role'
    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      { role: req.body.role },
      { new: true } // Devuelve el documento actualizado
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "❌ Usuario no encontrado" });
    }

    res.json({
      message: "✅ Rol del usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error en el backend:", error);
    res.status(500).json({
      message: "❌ Error al actualizar el usuario",
      error: error.message,
    });
  }
};

// Eliminar un usuario por su ID
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: '❌ Usuario no encontrado' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: '✅ Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al eliminar el usuario', error: error.message });
  }
};
