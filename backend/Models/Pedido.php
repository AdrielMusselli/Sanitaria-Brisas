<?php
require "../Config/pdo.php"; // Conexión a la BD

class Pedido {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Obtener todos los pedidos
     */
    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM pedido");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Agregar un pedido con sus productos
     */
    public function agregar($id_usuario, $fecha, $estado, $precio_total, $direccion_envio, $productos) {
    try {
        $this->pdo->beginTransaction();

        // Insertar pedido
        $stmt = $this->pdo->prepare("
            INSERT INTO pedido (id_usuario, fecha, estado, precio_total, direccion_envio)
            VALUES (:id_usuario, :fecha, :estado, :precio_total, :direccion_envio)
        ");
        $stmt->execute([
            ":id_usuario" => $id_usuario,
            ":fecha" => $fecha,
            ":estado" => $estado,
            ":precio_total" => $precio_total,
            ":direccion_envio" => $direccion_envio
        ]);

        $id_pedido_nuevo = $this->pdo->lastInsertId();

        // Preparar inserción detalle y actualización de stock
        $stmtDetalle = $this->pdo->prepare("
            INSERT INTO detallepedido (id_pedido, id_producto, cantidad, precio_unitario)
            VALUES (:id_pedido, :id_producto, :cantidad, :precio_unitario)
        ");

        $stmtStock = $this->pdo->prepare("
            UPDATE producto SET stock = stock - :cantidad
            WHERE id_producto = :id_producto AND stock >= :cantidad
        ");

        foreach ($productos as $p) {
            // Insertar detalle
            $stmtDetalle->execute([
                ":id_pedido" => $id_pedido_nuevo,
                ":id_producto" => $p["id_producto"],
                ":cantidad" => $p["cantidad"],
                ":precio_unitario" => $p["precio_unitario"]
            ]);

            // Actualizar stock
            $stmtStock->execute([
                ":id_producto" => $p["id_producto"],
                ":cantidad" => $p["cantidad"]
            ]);

            if ($stmtStock->rowCount() === 0) {
                throw new Exception("No hay stock suficiente para el producto ID " . $p["id_producto"]);
            }
        }

        $this->pdo->commit();

        return [
            "success" => true,
            "id_pedido" => $id_pedido_nuevo
        ];

    } catch (Exception $e) {
        $this->pdo->rollBack();
        return [
            "success" => false,
            "message" => "Error al guardar el pedido",
            "error" => $e->getMessage()
        ];
    }
}

    /**
     * Obtener detalles de un pedido por su ID
     */
    public function obtenerDetallesPedido($id_pedido) {
        $sql = "SELECT id_producto, cantidad, precio_unitario
                FROM detallepedido
                WHERE id_pedido = :id_pedido";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(["id_pedido" => $id_pedido]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>
