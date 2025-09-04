<?php
header('Content-Type: application/json');
require __DIR__ . "/../Models/Pedido.php";

$pedidoModel = new Pedido($pdo);

function obtenerPedido() {
    global $pedidoModel;
    echo json_encode($pedidoModel->obtenerTodos());
}

function agregarPedido($data) {
    global $pedidoModel;
    $resultado = $pedidoModel->agregar($data);
    echo json_encode([
        "success" => $resultado,
        "message" => $resultado ? "Pedido agregado correctamente" : "Error al agregar pedido"
    ]);
}
?>