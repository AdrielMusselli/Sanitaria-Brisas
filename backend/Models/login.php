<?php
// Se importa el archivo que contiene la configuración de la base de datos
require "../Config/pdo.php";

class Login {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Método para obtener todos los usuarios
    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Método para agregar un nuevo usuario
    public function agregar($id_usuario, $nombre, $email, $telefono, $contraseña) {
        $stmt = $this->pdo->prepare("INSERT INTO usuario (id_usuario, nombre, email, telefono, contraseña)
                                     VALUES (:id_usuario, :nombre, :email, :telefono, :contraseña)");
        return $stmt->execute([
            ":id_usuario" => $id_usuario,
            ":nombre" => $nombre,
            ":email" => $email,
            ":telefono" => $telefono,
            ":contraseña" => $contraseña
        ]);
    }
}
?>
