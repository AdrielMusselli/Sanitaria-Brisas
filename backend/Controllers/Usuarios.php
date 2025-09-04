<?php
header('Content-Type: application/json');
require __DIR__ . "/../Models/Usuario.php";

$usuarioModel = new Usuario($pdo);

function obtenerUsuario() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerTodos());
}

function agregarUsuario($data) {
    global $usuarioModel;
    $resultado = $usuarioModel->agregar($data);
    echo json_encode([
        "success" => $resultado,
        "message" => $resultado ? "Usuario agregado correctamente" : "Error al agregar usuario"
    ]);
}
?>