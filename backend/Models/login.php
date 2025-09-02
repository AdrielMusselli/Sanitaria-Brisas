<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

$pdo = require_once __DIR__ . '/../Config/pdo.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

try {
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['contraseña'])) {
        $_SESSION['usuario'] = $email;
        echo json_encode(['success' => true, 'message' => 'Login exitoso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos']);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}