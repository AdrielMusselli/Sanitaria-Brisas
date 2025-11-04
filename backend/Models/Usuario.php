<?php
// Se importa el archivo que contiene la configuración de la base de datos, que establece la conexión
require_once "../Config/pdo.php"; // Importar la conexión a la base de datos

// Definición de la clase Libro que interactuará con la tabla 'libros' en la base de datos
class Usuario {
    private $pdo;  // Declaración de una propiedad privada para almacenar la conexión PDO

    // El constructor recibe el objeto $pdo (conexión a la base de datos) y lo asigna a la propiedad $this->pdo
    public function __construct($pdo) {
        $this->pdo = $pdo;  // Asigna la conexión PDO a la propiedad de la clase
    }

    // Método para obtener todos los productos de la base de datos
    public function obtenerTodos() {
        // Prepara la consulta SQL para seleccionar todos los registros de la tabla 'productos'
        $stmt = $this->pdo->prepare("SELECT * FROM usuario");

        // Ejecuta la consulta
        $stmt->execute();
        
        // Devuelve todos los resultados como un array asociativo
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener usuario por ID
    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE id_usuario = :id LIMIT 1");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ==============================
    // AGREGAR USUARIO (Registro)
    // ==============================
 public function agregar($nombre, $email, $telefono, $contrasena) {
    try {
        $stmt = $this->pdo->prepare("
            INSERT INTO usuario (nombre, email, telefono, contraseña)
            VALUES (:nombre, :email, :telefono, :contrasena)
        ");

        $ok = $stmt->execute([
            ":nombre" => $nombre,
            ":email" => $email,
            ":telefono" => $telefono,
            ":contrasena" => $contrasena
        ]);

        return $ok;
    } catch (PDOException $e) {
        // Log detallado del error
        error_log("❌ Error SQL en Usuario::agregar => " . $e->getMessage());
        echo json_encode([
            "success" => false,
            "message" => "Error SQL: " . $e->getMessage()
        ]);
        return false;
    }
}

    // ==============================
    // OBTENER USUARIO POR EMAIL
    // ==============================
    public function obtenerPorEmail($email) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE email = :email LIMIT 1");
            $stmt->execute([":email" => $email]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error al obtener usuario: " . $e->getMessage());
            return false;
        }
    }


    // ==============================
    // ELIMINAR USUARIO
    // ==============================
    public function eliminar($id_usuario) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE id_usuario = :id");
            return $stmt->execute([":id" => $id_usuario]);
        } catch (PDOException $e) {
            error_log("Error al eliminar usuario: " . $e->getMessage());
            return false;
        }
    }

    // ==============================
    // ACTUALIZAR USUARIO
    // ==============================
    public function actualizar($id_usuario, $nombre, $email, $telefono) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE usuario 
                SET nombre = :nombre, email = :email, telefono = :telefono
                WHERE id_usuario = :id
            ");
            return $stmt->execute([
                ":id" => $id_usuario,
                ":nombre" => $nombre,
                ":email" => $email,
                ":telefono" => $telefono
            ]);
        } catch (PDOException $e) {
            error_log("Error al actualizar usuario: " . $e->getMessage());
            return false;
        }
    }
}
?>