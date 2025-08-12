<?php
require "../Controllers/productos.php"; 
require "../Controllers/Pedidos.php";
require "../controllers/Usuarios.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];    
$seccion = $_GET["seccion"] ?? null;

if ($requestMethod == "GET") {
    $seccion = $_GET["seccion"];
    if($seccion =="producto"){
         obtenerProducto();
    } else if ($seccion=="pedido"){
        //echo "aca llamaremos al json de usuario";
        obtenerPedido();
    } else if ($seccion =="usuario"){
        //echo "aca llamaremos al json de prestamos";
        obtenerUsuario();
    }}

    if ($requestMethod == "POST") {
    $seccion = $_GET["seccion"];
    if($seccion =="producto"){
         obtenerProducto();
    } else if ($seccion=="pedido"){
        //echo "aca llamaremos al json de usuario";
        obtenerPedido();
    } else if ($seccion =="usuario"){
        //echo "aca llamaremos al json de prestamos";
        obtenerUsuario();
    }}




?>