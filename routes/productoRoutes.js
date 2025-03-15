const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Obtener todos los productos
router.get("/", productoController.obtenerProductos);

// Agregar un nuevo producto
router.post("/", productoController.agregarProducto);

// Editar un producto
router.put("/:id", productoController.editarProducto);

// Eliminar un producto
router.delete("/:id", productoController.eliminarProducto);

// Obtener un producto por su ID
router.get("/:id", productoController.obtenerProductoPorId);

module.exports = router;