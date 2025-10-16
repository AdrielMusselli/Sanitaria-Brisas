<?php
header('Content-Type: application/json');
require "../Models/Producto.php"; // Importar el modelo

$productoModel = new Producto($pdo); // Instancia del modelo

function obtenerProducto() {
    global $productoModel;
    echo json_encode($productoModel->obtenerTodos());
}

function agregarProducto($nombreProducto, $descripcionProducto, $precioProducto, $stockProducto, $categoriaProducto) {
    global $productoModel;
    if ($productoModel->agregar($nombreProducto, $descripcionProducto, $precioProducto, $stockProducto, $categoriaProducto)) {
        echo json_encode(["message" => "producto agregado"]);
    } else {
        echo json_encode(["error" => "Error al agregar el producto"]);
    }
}
?>