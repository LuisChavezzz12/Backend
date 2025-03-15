const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware para manejar JSON
router.use(express.json());

// Ruta de registro (POST)
router.post("/registro", async (req, res) => {
  const { username, email, phone, password, secretQuestion, secretAnswer } = req.body;

  try {
    console.log('Datos recibidos:', req.body); // <--- Depuración

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado." });
    }

    // Crear un nuevo usuario con todos los campos requeridos
    const user = new User({
      username,
      email,
      phone,
      password,
      secretQuestion,
      secretAnswer
    });
    await user.save();

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Enviar respuesta con el token
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario.", error: error.message });
  }
});

// Ruta de inicio de sesión (POST)
router.post("/iniciar-sesion", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Generar un token JWT con el username en lugar de nombre
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username }, // Usar 'username' aquí
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar respuesta con el token
    res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión.", error: error.message });
  }
});



// Ruta para obtener los datos del usuario logueado
router.get("/user", async (req, res) => {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar al usuario por su ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Enviar el nombre del usuario
    res.json({ nombre: user.username });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
});

module.exports = router;
