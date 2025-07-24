<?php
require "../Models/Usuario.php"; // Importar el modelo

$usuarioModel = new Usuario ($pdo);// Instancia del modelo

function obtenerUsuario() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerTodos());
}

function agregarUsuario($id_usuario, $nombre, $email, $telefono, $contraseña) {
    global $usuarioModel;
    if ($usuarioModel->agregar($id_usuario, $nombre, $email, $telefono, $contraseña)) {
        echo json_encode(["message" => "producto agregado"]);
    } else {
        echo json_encode(["error" => "Error al agregar el producto"]);
    }
}
?>