<?php
// Se importa el archivo que contiene la configuración de la base de datos, que establece la conexión
require_once "../Config/pdo.php"; // Importar la conexión a la base de datos

// Definición de la clase Libro que interactuará con la tabla 'libros' en la base de datos
class Producto {
    private $pdo;  // Declaración de una propiedad privada para almacenar la conexión PDO

    // El constructor recibe el objeto $pdo (conexión a la base de datos) y lo asigna a la propiedad $this->pdo
    public function __construct($pdo) {
        $this->pdo = $pdo;  // Asigna la conexión PDO a la propiedad de la clase
    }

    // Método para obtener todos los productos de la base de datos
    public function obtenerTodos() {
        // Prepara la consulta SQL para seleccionar todos los registros de la tabla 'productos'
        $stmt = $this->pdo->prepare("SELECT * FROM producto");

        // Ejecuta la consulta
        $stmt->execute();
        
        // Devuelve todos los resultados como un array asociativo
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombreProducto, $descripcionProducto, $precioProducto, $stockProducto, $categoriaProducto) {
        $stmt = $this->pdo->prepare("INSERT INTO producto (nombre_producto, descripcion_producto, precio_producto, stock_producto, categoria_producto)
            VALUES (:nombre, :descripcion, :precio, :stock, :categoria)");

        return $stmt->execute([
            "nombre" => $nombreProducto,
            "descripcion" => $descripcionProducto,
            "precio" => $precioProducto,
            "stock" => $stockProducto,
            "categoria" => $categoriaProducto
        ]);
    }

    
}
?>