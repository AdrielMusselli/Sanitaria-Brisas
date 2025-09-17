<?php
header('Content-Type: application/json');
require __DIR__ . "/../Models/Producto.php";

$productoModel = new Producto($pdo);

function obtenerProducto() {
    global $productoModel;
    echo json_encode($productoModel->obtenerTodos());
}

function agregarProducto($data) {
    global $productoModel;
    $resultado = $productoModel->agregar($data);
    echo json_encode([
        "success" => $resultado,
        "message" => $resultado ? "Producto agregado correctamente" : "Error al agregar producto"
    ]);
}
?>