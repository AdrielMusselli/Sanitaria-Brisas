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
    // DEPURACIÓN: Marcar entrada a la función
    error_log("[DEBUG] Entrando a eliminarProducto con ID: $id");
    echo "[DEBUG] Entrando a eliminarProducto\n";
    try {
        error_log("Intentando eliminar producto con ID: $id");
        $resultado = $productoModel->eliminarProducto($id);
        error_log("Resultado de eliminarProducto: " . var_export($resultado, true));
        if ($resultado) {
            echo json_encode(["success" => true, "message" => "Producto eliminado exitosamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al eliminar el producto"]);
        }
    } catch (Throwable $e) {
        error_log("Excepción en eliminarProducto: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Excepción: " . $e->getMessage()]);
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