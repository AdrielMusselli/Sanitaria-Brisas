<?php
// ==============================
// Configuración de CORS
// ==============================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// ==============================
// Manejo de errores (suprimir salida HTML y devolver JSON en fallos)
// ==============================
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

set_error_handler(function ($severity, $message, $file, $line) {
    // Convertir warnings/notices en excepciones para manejarlos uniformemente
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function ($e) {
    if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor', 'error' => $e->getMessage()]);
    exit;
});

register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fatal en el servidor', 'error' => $err['message']]);
        exit;
    }
});

// ==============================
// Requerimientos de controladores
// ==============================
require "../Controllers/productos.php"; 
require "../Controllers/Pedidos.php";
require "../Controllers/Usuarios.php";
require "../Controllers/logins.php";

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}


// ==============================
// Determinar sección según método
// ==============================
$requestMethod = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents("php://input"), true) ?? [];

if ($requestMethod === 'POST') {
    // Permite obtener seccion por POST o GET
    $seccion = $input['accion'] ?? $_POST['accion'] ?? $_GET['seccion'] ?? null;
} elseif ($requestMethod === 'GET' || $requestMethod === 'DELETE') {
    $seccion = $_GET['seccion'] ?? null;
} else {
    $seccion = null;
}

$seccion = $seccion ? trim($seccion) : null;
error_log(">>> [API DEBUG] Método: $requestMethod | Sección: '$seccion'");

// ==============================
// Métodos GET
// ==============================
if ($requestMethod == "GET") {

    switch ($seccion) {

        case "producto":
            obtenerProducto();
            break;

        case "pedido":
            obtenerPedido();
            break;

        case "usuario":
            obtenerUsuario();
            break;

        case "login":
            // Verificar sesión activa
            if (isset($_SESSION['user'])) {
                echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
            } else {
                echo json_encode(['success' => false]);
            }
            break;

        default:
            echo json_encode(["success" => false, "message" => "Sección inválida"]);
    }
}

// ==============================
// Métodos POST
// ==============================
if ($requestMethod == "POST") {

    switch ($seccion) {

        case "producto":
            // Preferir valores de $_POST (multipart/form-data) si existen
            $nombre = $_POST['nombre'] ?? $input['nombre'] ?? null;
            $categoria = $_POST['categoria'] ?? $input['categoria'] ?? null;
            $precio = $_POST['precio'] ?? $input['precio'] ?? null;
            $stock = $_POST['stock'] ?? $input['stock'] ?? null;
            $descripcion = $_POST['descripcion'] ?? $input['descripcion'] ?? null;
            $imagenes = $_POST['imagenes'] ?? $input['imagenes'] ?? null;

            // Si se subió un archivo, moverlo a assets/ y usar su ruta
            if (isset($_FILES['imagenes']) && $_FILES['imagenes']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['imagenes'];
                $fileName = uniqid() . '_' . basename($file['name']);
                $uploadDir = __DIR__ . '/../assets/';
                if (!file_exists($uploadDir)) @mkdir($uploadDir, 0777, true);
                $target = $uploadDir . $fileName;
                if (is_uploaded_file($file['tmp_name']) && move_uploaded_file($file['tmp_name'], $target)) {
                    // Guardar ruta relativa en la BD
                    $imagenes = 'assets/' . $fileName;
                }
            }

            agregarProducto($nombre, $categoria, $precio, $stock, $descripcion, $imagenes);
            break;

        case "pedido":
            agregarPedido(
                $input['id_pedido'] ?? null,
                $input['id_usuario'] ?? null,
                $input['fecha'] ?? null,
                $input['estado'] ?? null,
                $input['precio_total'] ?? null,
                $input['direccion_envio'] ?? null
            );
            break;

        case "login":
            iniciarSesion($input);
            break;

        case "registro":
            registrarUsuario($input); 
            break;

        case "logout":
            cerrarSesion();
            break;

        default:
            echo json_encode(["success" => false, "message" => "Sección inválida"]);
    }
}

// ==============================
// Métodos DELETE
// ==============================
if ($requestMethod == "DELETE") {
    $id = $_GET["id"] ?? null;

    switch ($seccion) {
        case "producto":
            if (!$id) {
                echo json_encode(["success" => false, "message" => "ID de producto no proporcionado"]);
                exit;
            }
            eliminarProducto($id);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Sección inválida para DELETE"]);
    }
}

// ==============================
// OPTIONS (CORS preflight)
// ==============================
if ($requestMethod == "OPTIONS") {
    http_response_code(200);
    exit();
}
?>
