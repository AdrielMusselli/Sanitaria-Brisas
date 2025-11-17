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
require_once "../Models/Pedido.php";


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

        case "resena":
            reseñas();
            break;

        case "detallepedido":
    $id = $_GET['id_pedido'] ?? null;

    if (!$id) {
        echo json_encode(["success" => false, "message" => "Falta id_pedido"]);
        exit;
    }

    obtenerDetallesPedido($id);
    break;

        case "usuario":
            obtenerUsuario();
            break;

        case "resenas":
            obtenerReseñas();
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

        case "agregarpedido":
        agregarPedido();
        break;


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

      case "resena":
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        $id_usuario  = intval($input['id_usuario'] ?? 0);
        $id_producto = intval($input['id_producto'] ?? 0);
        $puntuacion  = intval($input['puntuacion'] ?? 0);
        $comentario  = trim($input['comentario'] ?? '');

        if (!$id_usuario || !$id_producto || $puntuacion < 1 || $puntuacion > 10) {
            echo json_encode([
                "success" => false,
                "message" => "Parámetros inválidos",
                "debug" => $input
            ]);
            exit;
        }

        $fecha = date('Y-m-d H:i:s');

        if (agregarReseña($id_producto, $id_usuario, $puntuacion, $comentario, $fecha)) {
            echo json_encode([
                "success" => true,
                "message" => "Reseña agregada exitosamente"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error al agregar la reseña"
            ]);
        }

        exit;

    } catch (Exception $e) {

        $msg = preg_replace('/[^(\x20-\x7F)]*/','', $e->getMessage());

        echo json_encode([
            "success" => false,
            "message" => "Error interno del servidor",
            "error" => $msg
        ]);
        exit;
    }
    break;

        
        case 'pedido_estado':
    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $id = $_POST["id_pedido"];
        $estado = $_POST["estado"];

        $stmt = $pdo->prepare("UPDATE pedido SET estado = :estado WHERE id_pedido = :id");
        $stmt->execute([
            ":estado" => $estado,
            ":id" => $id
        ]);

        echo json_encode(["success" => true, "message" => "Estado actualizado"]);
        exit;
    }
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

        case "pedido":
            if (!$id) {
                echo json_encode(["success" => false, "message" => "ID de pedido no proporcionado"]);
                exit;
            }
            eliminarPedido($id);
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
