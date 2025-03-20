const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware para manejar JSON
router.use(express.json());

// ✅ Middleware para verificar usuario autenticado
const verificarUsuario = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extrae solo el token sin "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Formato de token incorrecto." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Extraer datos del usuario desde el token
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
  }
};

// ✅ Ruta de Registro (POST)
router.post("/registro", async (req, res) => {
  const { username, email, phone, password, secretQuestion, secretAnswer } =
    req.body;

  try {
    console.log("Datos recibidos:", req.body);

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado." });
    }

    // Crear un nuevo usuario
    const user = new User({
      username,
      email,
      phone,
      password,
      secretQuestion,
      secretAnswer,
    });
    await user.save();

    // Generar un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res
      .status(500)
      .json({
        message: "Error al registrar el usuario.",
        error: error.message,
      });
  }
});

// ✅ Ruta de Inicio de Sesión (POST)
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

    // Generar un token JWT con información del usuario
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ message: "Error al iniciar sesión.", error: error.message });
  }
});

// ✅ Ruta para obtener los datos del usuario autenticado
router.get("/perfil", verificarUsuario, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.userId).select("-password");
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.put("/perfil", verificarUsuario, async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    // Buscar usuario por ID sin aplicar validaciones a campos que no estamos modificando
    const usuario = await User.findById(req.usuario.userId);
    if (!usuario) {
      return res.status(404).json({ message: "❌ Usuario no encontrado" });
    }

    // Validaciones básicas
    if (!username && !email && !phone) {
      return res
        .status(400)
        .json({
          message: "❌ Debes enviar al menos un campo para actualizar.",
        });
    }

    // Actualizar solo los campos enviados
    if (username) usuario.username = username;
    if (email) usuario.email = email;
    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        return res
          .status(400)
          .json({
            message: "❌ El teléfono debe tener exactamente 10 dígitos.",
          });
      }
      usuario.phone = phone;
    }

    // Guardar sin aplicar validaciones en otros campos no enviados
    await usuario.save({ validateModifiedOnly: true });

    res.json({ message: "✅ Perfil actualizado correctamente", usuario });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    res
      .status(500)
      .json({ message: "❌ Error en el servidor", error: error.message });
  }
});

// ✅ Ruta para obtener el nombre del usuario autenticado (para la navbar)
router.get("/user", verificarUsuario, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ nombre: usuario.username });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ✅ 1️⃣ Solicitar pregunta secreta por email
router.post("/recuperar-pregunta", async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "❌ Este correo no está registrado." });
    }

    res.json({ secretQuestion: usuario.secretQuestion });
  } catch (error) {
    console.error("Error al recuperar pregunta secreta:", error);
    res.status(500).json({ message: "❌ Error en el servidor" });
  }
});

// ✅ 2️⃣ Verificar respuesta secreta y generar token de recuperación
router.post("/verificar-respuesta", async (req, res) => {
  const { email, secretAnswer } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "❌ Usuario no encontrado." });
    }

    if (usuario.secretAnswer !== secretAnswer) {
      return res.status(400).json({ message: "❌ Respuesta incorrecta." });
    }

    // Generar token temporal para restablecer contraseña
    const resetToken = jwt.sign(
      { userId: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ message: "✅ Respuesta correcta.", resetToken });
  } catch (error) {
    console.error("Error al verificar respuesta secreta:", error);
    res.status(500).json({ message: "❌ Error en el servidor" });
  }
});

// ✅ 3️⃣ Restablecer contraseña usando el token de recuperación
router.post("/restablecer-contrasena", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.userId);

    if (!usuario) {
      return res.status(404).json({ message: "❌ Usuario no encontrado." });
    }

    usuario.password = newPassword; // Asigna la nueva contraseña
    await usuario.save();

    res.json({ message: "✅ Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(500).json({ message: "❌ Error en el servidor" });
  }
});

module.exports = router;
