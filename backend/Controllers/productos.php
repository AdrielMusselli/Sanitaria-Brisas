<?php
header('Content-Type: application/json');
$pdo = require "../Config/pdo.php";
require "../Models/Producto.php"; // Importar el modelo

$productoModel = new Producto($pdo); // Instancia del modelo

function obtenerProducto() {
    global $productoModel;
    $id = $_GET['id'] ?? null;
    $categoria = $_GET['categoria'] ?? null;
    
    if ($id) {
        // Obtener producto específico por ID
        $producto = $productoModel->obtenerPorId($id);
        if ($producto) {
            echo json_encode([$producto]);
        } else {
            echo json_encode([]);
        }
    } elseif ($categoria) {
        // Llamar al modelo para obtener por categoría
        echo json_encode($productoModel->obtenerPorCategoria($categoria));
    } else {
        echo json_encode($productoModel->obtenerTodos());
    }
}

function agregarProducto($nombre, $categoria, $precio, $stock, $descripcion, $imagenes) {
    global $productoModel;
    if ($productoModel->agregarProducto($nombre, $categoria, $precio, $stock, $descripcion, $imagenes)) {
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
