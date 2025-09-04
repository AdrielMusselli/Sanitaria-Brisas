<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$pdo = require __DIR__ . "/../Config/pdo.php";

require __DIR__ . "/../Controllers/Productos.php";
require __DIR__ . "/../Controllers/Pedidos.php";
require __DIR__ . "/../Controllers/Usuarios.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];
$seccion = $_GET["seccion"] ?? null;

switch ($seccion) {

    case "producto":
        if ($requestMethod == "GET") {
            obtenerProducto();
        } elseif ($requestMethod == "POST") {
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input) {
                echo json_encode(["success" => false, "message" => "Datos JSON inválidos o vacíos"]);
                exit;
            }
            agregarProducto($input);
        }
        break;

    case "pedido":
        if ($requestMethod == "GET") {
            obtenerPedido();
        } elseif ($requestMethod == "POST") {
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input) {
                echo json_encode(["success" => false, "message" => "Datos JSON inválidos o vacíos"]);
                exit;
            }
            agregarPedido($input);
        } elseif ($requestMethod == "DELETE") {
            $id = $_GET["id_pedido"] ?? null;
            if ($id) {
                eliminarPedido($id);
            } else {
                echo json_encode(["success" => false, "message" => "ID de pedido requerido"]);
            }
        }
        break;

    case "usuario":
        if ($requestMethod == "GET") {
            obtenerUsuario();
        } elseif ($requestMethod == "POST") {
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input) {
                echo json_encode(["success" => false, "message" => "Datos JSON inválidos o vacíos"]);
                exit;
            }
            agregarUsuario($input);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Sección no válida"]);
        break;
}
?>