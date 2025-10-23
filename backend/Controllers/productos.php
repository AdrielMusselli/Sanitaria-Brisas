<?php
header('Content-Type: application/json');
require "../Models/Producto.php"; // Importar el modelo

$productoModel = new Producto($pdo); // Instancia del modelo

function obtenerProducto() {
    global $productoModel;
    echo json_encode($productoModel->obtenerTodos());
}

function agregarProducto($nombre, $categoria, $precio, $stock, $descripcion) {
    global $productoModel;
    if ($productoModel->agregarProducto($nombre, $categoria, $precio, $stock, $descripcion)) {
        echo json_encode(["success" => true, "message" => "Producto agregado exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar el producto"]);
    }
}

function eliminarProducto($id) {
    global $productoModel;
    if ($productoModel->eliminarProducto($id)) {
        echo json_encode(["success" => true, "message" => "Producto eliminado exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el producto"]);
    }
}
?>