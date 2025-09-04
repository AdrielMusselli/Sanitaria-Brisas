<?php
    $host = "localhost";             // Servidor donde está la base de datos
    $dbname = "sanitaria_brisas";    // Nombre de la base de datos
    $username = "root";              // Usuario de la base de datos
    $password = "";                  // Contraseña (vacía por defecto)

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo; 
    } catch (PDOException $e) {
        die("Error en la conexión: " . $e->getMessage());
    }
?>
