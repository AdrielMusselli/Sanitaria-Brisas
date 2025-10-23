<?php
// Configuración de CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // Cache para 24 horas

ini_set('display_errors', 1);
error_reporting(E_ALL);

require "../Controllers/productos.php"; 
require "../Controllers/Pedidos.php";
require "../Controllers/Usuarios.php";
require "../Controllers/logins.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];    

// Obtener la sección de los parámetros GET para todos los métodos
$seccion = $_GET["seccion"] ?? null;

// Log para debugging
error_log("=== REQUEST INFO ===");
error_log("Method: " . $requestMethod);
error_log("Section: " . ($seccion ?? 'null'));
error_log("GET params: " . json_encode($_GET));
error_log("==================");

// Log para debugging
error_log("Request Method: " . $requestMethod);
error_log("Seccion: " . ($seccion ?? "no definida"));

if ($requestMethod == "GET") {
    if ($seccion == "producto") {
        obtenerProducto();
    } else if ($seccion == "pedido") {
        obtenerPedido();
    } else if ($seccion == "usuario") {
        obtenerUsuario();
    } else  if ($seccion == "login")  {
        obtenerLogin();
    } else {
        echo json_encode(["error" => "Sección inválida"]);
    }
}

if ($requestMethod == "POST") {
    if ($seccion == "producto") {
        $nombre = $_POST["nombre"] ?? null;
        $descripcion = $_POST["descripcion"] ?? null;
        $precio = $_POST["precio"] ?? null;
        $stock = $_POST["stock"] ?? null;
        $categoria = $_POST["categoria"] ?? null;

        if (!$nombre || !$categoria || !$precio || !$stock || !$descripcion) {
            echo json_encode(["success" => false, "message" => "Faltan datos requeridos"]);
            exit;
        }

        agregarProducto($nombre, $categoria, $precio, $stock, $descripcion);
    } else if ($seccion == "pedido") {
        agregarPedido($id_pedido, $id_usuario, $fecha, $estado, $precio_total, $direccion_envio);
    } else if ($seccion == "usuario") {
        agregarUsuario($id_usuario, $nombre, $email, $direccion, $telefono, $contrasena);
    } else {
        echo json_encode(["success" => false, "message" => "Sección inválida"]);
    }
}

if ($requestMethod == "DELETE") {
    // Log detallado para debugging
    error_log("=== DEBUG DELETE REQUEST ===");
    error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
    error_log("QUERY_STRING: " . $_SERVER['QUERY_STRING']);
    error_log("GET params: " . json_encode($_GET));
    error_log("Seccion recibida: " . ($seccion ?? 'null'));
    error_log("=========================");
    
    // Forzar la obtención de la sección desde GET para DELETE
    $seccion = $_GET["seccion"] ?? null;
    
    if ($seccion === "producto") {
        $id = $_GET["id"] ?? null;
        if (!$id) {
            echo json_encode(["success" => false, "message" => "ID de producto no proporcionado"]);
            exit;
        }
        eliminarProducto($id);
    } else {
        echo json_encode(["success" => false, "message" => "Sección inválida para DELETE. Sección recibida: " . ($seccion ?? "ninguna")]);
    }
}

// Manejar las solicitudes OPTIONS para CORS
if ($requestMethod == "OPTIONS") {
    http_response_code(200);
    exit();
}
?>
