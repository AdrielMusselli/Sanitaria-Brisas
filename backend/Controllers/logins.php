<?php
require "../Models/login.php"; // Importar el modelo

$usuarioModel = new Usuario ($pdo);// Instancia del modelo

function obtenerLogin() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerTodos());
}

function agregarLogin($id_usuario, $nombre, $email, $telefono, $contraseña) {
    global $usuarioModel;
    if ($usuarioModel->agregar($id_usuario, $nombre, $email, $telefono, $contraseña)) {
        echo json_encode(["message" => "login iniciado"]);
    } else {
        echo json_encode(["error" => "Error al iniciar sesion"]);
    }
}
?>