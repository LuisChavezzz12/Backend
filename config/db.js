const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ Sin `useNewUrlParser` ni `useUnifiedTopology`
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error en la conexión a MongoDB:", error);
    process.exit(1); // Detener la aplicación si falla la conexión
  }
};

module.exports = conectarDB;
