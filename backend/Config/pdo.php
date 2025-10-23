<?php
    $host = "localhost";       // Servidor donde está la base de datos
    $dbname = "sanitaria brisas";    // Nombre de la base de datos (usar guion bajo, coincide con el dump SQL)
    $username = "root";        // Usuario de la base de datos
    $password = "";            // Contraseña (vacía por defecto)

    try {
        // Conectamos a la base de datos con PDO
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo; // ¡IMPORTANTE! Retornar la conexión
    } catch (PDOException $e) {
        die("Error en la conexión: " . $e->getMessage());
    }
?>
