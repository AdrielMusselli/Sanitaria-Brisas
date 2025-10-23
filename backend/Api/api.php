<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require "../Controllers/productos.php"; 
require "../Controllers/Pedidos.php";
require "../Controllers/Usuarios.php";
require "../Controllers/logins.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];    
$seccion = $_GET["seccion"] ?? null;

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
        // acá deberías usar los datos del POST
        $nombre = $_POST["nombre"] ?? null;
        $descripcion = $_POST["descripcion"] ?? null;
        $precio = $_POST["precio"] ?? null;
        $stock = $_POST["stock"] ?? null;
        $categoria = $_POST["categoria"] ?? null;

        agregarProducto($nombre, $categoria, $precio, $stock);
    } else if ($seccion == "pedido") {
        agregarPedido($id_pedido, $id_usuario, $fecha, $estado, $precio_total, $direccion_envio);
    } else if ($seccion == "usuario") {
        agregarUsuario($id_usuario, $nombre, $email, $direccion, $telefono, $contrasena);
    } else {
        echo json_encode(["error" => "Sección inválida"]);
    }
}
?>
