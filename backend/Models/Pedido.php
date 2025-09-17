<?php
// Se importa el archivo que contiene la configuración de la base de datos, que establece la conexión
require_once "../Config/pdo.php"; // Importar la conexión a la base de datos

// Definición de la clase Libro que interactuará con la tabla 'libros' en la base de datos
class Pedido {
    private $pdo;  // Declaración de una propiedad privada para almacenar la conexión PDO

    // El constructor recibe el objeto $pdo (conexión a la base de datos) y lo asigna a la propiedad $this->pdo
    public function __construct($pdo) {
        $this->pdo = $pdo;  // Asigna la conexión PDO a la propiedad de la clase
    }

    // Método para obtener todos los productos de la base de datos
    public function obtenerTodos() {
        // Prepara la consulta SQL para seleccionar todos los registros de la tabla 'productos'
        $stmt = $this->pdo->prepare("SELECT * FROM pedido");

        // Ejecuta la consulta
        $stmt->execute();
        
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminar($id_pedido) {
    // Prepara la consulta SQL para eliminar un pedido basado en su id
    $stmt = $this->pdo->prepare("DELETE FROM pedido WHERE id_pedido = :id_pedido");

    // Ejecuta la consulta
    return $stmt->execute([":id_pedido" => $id_pedido]);
    }

public function agregar($id_pedido, $id_usuario, $fecha, $estado, $precio_total, $direccion_envio) {
        $stmt = $this->pdo->prepare("INSERT INTO pedido (id_pedido, id_usuario, fecha, estado, precio_total, direccion_envio)
        VALUES (:id_pedido, :id_usuario, :fecha, :estado, :precio_total, :direccion_envio)");

    return $stmt->execute([
        "id_pedido" => $id_pedido,
        ":id_usuario" => $id_usuario,
        ":fecha" => $fecha,
        ":estado" => $estado,
        ":precio_total" => $precio_total,
        ":direccion_envio" => $direccion_envio,
    ]);
}
}

?>