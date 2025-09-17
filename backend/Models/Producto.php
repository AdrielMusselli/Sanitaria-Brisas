<?php
// clase Producto que maneja las operaciones relacionadas con los productos
class Producto {
    private $pdo;

    // Constructor que recibe la conexión PDO
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Método para obtener todos los productos
    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM producto");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Método para agregar un nuevo producto
    public function agregar($data) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO producto (nombre, categoria, precio, descripcion, stock) 
             VALUES (:nombre, :categoria, :precio, :descripcion, :stock)"
        );

        return $stmt->execute([
            ':nombre'      => $data['nombre'],
            ':categoria'   => $data['categoria'],
            ':precio'      => $data['precio'],
            ':descripcion' => $data['descripcion'],
            ':stock'       => $data['stock']
        ]);
    }
}
?>