<?php
require "../Models/Usuario.php"; // Importar el modelo

$pdo = require "../Config/pdo.php";
$usuarioModel = new Usuario($pdo); // Instancia del modelo

function obtenerUsuario() {
    global $usuarioModel;
    // Si se solicita un id en GET, devolver sólo ese usuario
    $id = $_GET['id'] ?? null;
    if ($id) {
        $usuario = $usuarioModel->obtenerPorId($id);
        if ($usuario) {
            echo json_encode($usuario);
        } else {
            echo json_encode(["error" => "Usuario no encontrado"]);
        }
    } else {
        echo json_encode($usuarioModel->obtenerTodos());
    }
}

function agregarUsuario($id_usuario, $nombre, $email, $telefono, $contraseña) {
    global $usuarioModel;
    if ($usuarioModel->agregar($id_usuario, $nombre, $email, $telefono, $contraseña)) {
        echo json_encode(["message" => "usuario agregado"]);
    } else {
        echo json_encode(["error" => "Error al agregar el usuario"]);
    }
}
?>