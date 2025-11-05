<?php
require_once "../Models/Usuario.php";
$pdo = require "../Config/pdo.php";
$usuarioModel = new Usuario($pdo);

// ==============================
// INICIAR SESIÓN
// ==============================
function iniciarSesion($data = []) {
    global $usuarioModel;

    $email = $data['email'] ?? $_POST['email'] ?? null;
    $password = $data['password'] ?? $_POST['password'] ?? null;

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

    $passwordOk = false;
    if ($stored) {
        if (preg_match('/^\$2[ayb]\$|\$argon2/i', $stored)) {
            $passwordOk = password_verify($password, $stored);
        } else {
            $passwordOk = ($password === $stored);
        }
    }

    if (!$passwordOk) {
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
        return;
    }

    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['user'] = [
        'id' => $user['id_usuario'] ?? $user['id'] ?? null,
        'nombre' => $user['nombre'] ?? '',
        'email' => $user['email'] ?? '',
        'admin' => $user['admin'] ?? '',
    ];

    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión correcto',
        'user' => $_SESSION['user']
    ]);
}

// ==============================
// REGISTRAR USUARIO
// ==============================
function registrarUsuario($data = []) {
    global $usuarioModel;

    header('Content-Type: application/json');

    try {
        $nombre = trim($data['nombre'] ?? $_POST['nombre'] ?? '');
        $email = trim($data['email'] ?? $_POST['email'] ?? '');
        $telefono = trim($data['telefono'] ?? $_POST['telefono'] ?? '');
        $password = trim($data['password'] ?? $_POST['password'] ?? '');

        if (!$email || !$password) {
            echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
            return;
        }

        if (!$usuarioModel) {
            throw new Exception('Modelo de usuario no inicializado');
        }

        $existente = $usuarioModel->obtenerPorEmail($email);
        if ($existente) {
            echo json_encode(['success' => false, 'message' => 'El correo ya está registrado']);
            return;
        }

        $hashed = password_hash($password, PASSWORD_BCRYPT);

        $ok = $usuarioModel->agregar($nombre, $email, $telefono, $hashed);

        if ($ok) {
            echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
        }

    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error interno: '.$e->getMessage()]);
    }
}

// ==============================
// CERRAR SESIÓN
// ==============================
function cerrarSesion() {
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada correctamente']);
}
?>
