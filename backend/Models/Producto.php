<?php
class Producto {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM producto");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

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