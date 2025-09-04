<?php
class Pedido {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM pedido");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($data) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO pedido (id_pedido, id_usuario, fecha, estado, precio_total, direccion_envio)
             VALUES (:id_pedido, :id_usuario, :fecha, :estado, :precio_total, :direccion_envio)"
        );

        return $stmt->execute([
            ":id_pedido"        => $data["id_pedido"],
            ":id_usuario"       => $data["id_usuario"],
            ":fecha"            => $data["fecha"],
            ":estado"           => $data["estado"],
            ":precio_total"     => $data["precio_total"],
            ":direccion_envio"  => $data["direccion_envio"]
        ]);
    }
}
?>