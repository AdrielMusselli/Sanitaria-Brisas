<?php
require_once "../Models/Usuario.php"; // Use Usuario model for login

$pdo = require "../Config/pdo.php";
$usuarioModel = new Usuario($pdo);

function obtenerLogin() {
    global $usuarioModel;
    echo json_encode($usuarioModel->obtenerTodos());
}

// Maneja el inicio de sesión (POST)
function iniciarSesion() {
    global $usuarioModel;

    // Leer email y password desde POST
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Faltan credenciales']);
        return;
    }

    $user = $usuarioModel->obtenerPorEmail($email);
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        return;
    }

    $stored = $user['contraseña'] ?? $user['contrasena'] ?? null;

    // Verificar contraseña: si parece hash de password_hash, usar password_verify, si no, comparar plano
    $passwordOk = false;
    if ($stored) {
        if (strpos($stored, '$2y$') === 0 || strpos($stored, '$2a$') === 0 || strpos($stored, '$argon2') !== false) {
            $passwordOk = password_verify($password, $stored);
        } else {
            $passwordOk = ($password === $stored);
        }
    }

    if (!$passwordOk) {
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
        return;
    }

    // Iniciar sesión y devolver datos mínimos
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    // Guardar datos en la sesión (sin la contraseña)
    $_SESSION['user'] = [
        'id' => $user['id_usuario'] ?? $user['id'] ?? null,
        'nombre' => $user['nombre'] ?? null,
        'email' => $user['email'] ?? null,
    ];

    echo json_encode(['success' => true, 'message' => 'Inicio de sesión correcto', 'user' => $_SESSION['user']]);
}

// Maneja el cierre de sesión (POST)
function cerrarSesion() {
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
}

?>