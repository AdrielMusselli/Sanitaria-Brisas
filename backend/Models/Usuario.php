<?php
// clase Usuario que maneja las operaciones relacionadas con los usuarios
class Usuario {
    private $pdo;

    // Constructor que recibe la conexión PDO
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
    public function agregar($data) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO usuario (id_usuario, nombre, email, telefono, contrasena)
             VALUES (:id_usuario, :nombre, :email, :telefono, :contrasena)"
        );

        return $stmt->execute([
            ":id_usuario" => $data["id_usuario"],
            ":nombre"     => $data["nombre"],
            ":email"      => $data["email"],
            ":telefono"   => $data["telefono"],
            ":contrasena" => $data["contrasena"], // cambiar a hash si querés seguridad
        ]);
    }
}
?>