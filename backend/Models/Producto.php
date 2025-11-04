<?php
require_once "../Config/pdo.php"; // Importar la conexión a la base de datos

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

    // Método para obtener productos por categoría (case-insensitive y trim)
    public function obtenerPorCategoria($categoria) {
        // Normalizar la categoría (trim espacios y convertir primera letra a mayúscula)
        $categoria = ucfirst(trim($categoria));
        
        $stmt = $this->pdo->prepare("SELECT * FROM producto WHERE categoria = :categoria");
        $stmt->bindParam(':categoria', $categoria);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Método para agregar un nuevo producto a la base de datos
    public function agregarProducto($nombre, $categoria, $precio, $stock, $descripcion, $imagenes) {
        // Prepara la consulta SQL para insertar un nuevo registro en la tabla 'productos'
        $stmt = $this->pdo->prepare("INSERT INTO producto (nombre, categoria, precio, stock, descripcion) VALUES (:nombre, :categoria, :precio, :stock, :descripcion)");

        // Vincula los parámetros de la consulta con los valores proporcionados
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':precio', $precio);
        $stmt->bindParam(':stock', $stock);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':imagenes', $imagenes);

        // Ejecuta la consulta y devuelve true si tuvo éxito, o false en caso contrario
        return $stmt->execute();
    }

    // Método para eliminar un producto
    public function eliminarProducto($id) {
        $stmt = $this->pdo->prepare("DELETE FROM producto WHERE id_producto = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>