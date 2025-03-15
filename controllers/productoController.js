  const Producto = require("../models/Producto");

  // Obtener todos los productos
  exports.obtenerProductos = async (req, res) => {
    try {
      const productos = await Producto.find();
      res.json(productos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "❌ Error al obtener productos", error: error.message });
    }
  };
  exports.obtenerProductoPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).json({ message: "❌ Producto no encontrado" });
      }
      res.json(producto);
    } catch (error) {
      res.status(500).json({
        message: "❌ Error al obtener el producto",
        error: error.message,
      });
    }
  };
  // Agregar un nuevo producto
  exports.agregarProducto = async (req, res) => {
    try {
      const nuevoProducto = new Producto(req.body);
      await nuevoProducto.save();
      res.status(201).json({
        message: "✅ Producto agregado correctamente",
        producto: nuevoProducto,
      });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error al agregar el producto",
        error: error.message,
      });
    }
  };

  exports.editarProducto = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID del producto de la URL
      const updates = req.body; // Obtener los datos actualizados del cuerpo de la solicitud

      // Actualizar el producto en la base de datos
      const productoActualizado = await Producto.findByIdAndUpdate(id, updates, {
        new: true, // Devuelve el documento actualizado
      });

      if (!productoActualizado) {
        return res.status(404).json({ message: "❌ Producto no encontrado" });
      }

      res.json({
        message: "✅ Producto actualizado correctamente",
        producto: productoActualizado,
      });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error al editar el producto",
        error: error.message,
      });
    }
  };

  // Eliminar un producto
  exports.eliminarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const productoEliminado = await Producto.findByIdAndDelete(id);

      if (!productoEliminado) {
        return res.status(404).json({ message: "❌ Producto no encontrado" });
      }

      res.json({ message: "✅ Producto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({
        message: "❌ Error al eliminar el producto",
        error: error.message,
      });
    }
  };
