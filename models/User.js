const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio."],
    minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres."],
    maxlength: [30, "El nombre de usuario no puede tener más de 30 caracteres."],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio."],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo electrónico no es válido."],
  },
  phone: {
    type: String,
    required: [true, "El teléfono es obligatorio."],
    match: [/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos."],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  secretQuestion: {
    type: String,
    required: [true, "La pregunta secreta es obligatoria."],
    enum: [
      "¿Cuál es el nombre de tu primera mascota?",
      "¿Cuál es el nombre de tu ciudad natal?",
      "¿Cuál es el nombre de tu mejor amigo de la infancia?",
      "¿Cuál es tu comida favorita?",
      "¿Cuál es el nombre de tu profesor favorito?",
    ],
  },
  secretAnswer: {
    type: String,
    required: [true, "La respuesta secreta es obligatoria."],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Hash de la contraseña antes de guardar el usuario
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar la contraseña ingresada con la almacenada en la base de datos
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
