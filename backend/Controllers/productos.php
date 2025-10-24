<?php
header('Content-Type: application/json');
$pdo = require "../Config/pdo.php";
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
// Fallback global para errores fatales
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error["type"], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        error_log("Shutdown error: " . print_r($error, true));
        if (!headers_sent()) {
            header('Content-Type: application/json');
        }
        echo json_encode(["success" => false, "message" => "Error fatal en el servidor", "error" => $error]);
    }
});
?>