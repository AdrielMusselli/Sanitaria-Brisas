<?php
require "../Models/Pedido.php"; // Importar el modelo

$pedidoModel = new Pedido ($pdo);// Instancia del modelo

function obtenerPedido() {
    global $pedidoModel;
    echo json_encode($pedidoModel->obtenerTodos());
}

function agregarPedido($id_pedido, $id_usuario, $fecha, $estado, $precio_total, $direccion_envio) {
    global $pedidoModel;
    if ($pedidoModel->agregar($id_pedido, $id_usuario, $fecha, $estado, $precio_total, $direccion_envio)) {
        echo json_encode(["message" => "producto agregado"]);
    } else {
        echo json_encode(["error" => "Error al agregar el producto"]);
    }
}
?>