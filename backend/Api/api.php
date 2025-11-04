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
// Manejo de errores
// ==============================
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);

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
            agregarProducto(
                $input['nombre'] ?? null,
                $input['categoria'] ?? null,
                $input['precio'] ?? null,
                $input['stock'] ?? null,
                $input['descripcion'] ?? null,
                $input['imagenes'] ?? null
            );
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
