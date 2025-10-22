<?php
header('Content-Type: application/json');
require "../Models/Producto.php"; // Importar el modelo

$productoModel = new Producto($pdo); // Instancia del modelo

function obtenerProducto() {
    global $productoModel;
    echo json_encode($productoModel->obtenerTodos());
}

function agregarProducto($nombre, $categoria, $precio, $stock) {
    global $productoModel;
    if ($productoModel->agregarProducto($nombre, $categoria, $precio, $stock)) {
        echo json_encode(["message" => "producto agregado"]);
    } else {
        echo json_encode(["error" => "Error al agregar el producto"]);
    }
}
?>