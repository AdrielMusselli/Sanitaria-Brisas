<?php
header('Content-Type: application/json');
// Se importa el archivo que contiene la configuración de la base de datos, que establece la conexión
$pdo = require_once "../Config/pdo.php"; // Importar la conexión a la base de datos

// Definición de la clase Libro que interactuará con la tabla 'libros' en la base de datos
class Producto {
    private $pdo;  // Declaración de una propiedad privada para almacenar la conexión PDO

    // El constructor recibe el objeto $pdo (conexión a la base de datos) y lo asigna a la propiedad $this->pdo
    public function __construct($pdo) {
        $this->pdo = $pdo;  // Asigna la conexión PDO a la propiedad de la clase
    }

    // Método para obtener todos los productos de la base de datos
    public function obtenerTodos() {
        // Prepara la consulta SQL para seleccionar todos los registros de la tabla 'productos'
        $stmt = $this->pdo->prepare("SELECT * FROM producto");

        // Ejecuta la consulta
        $stmt->execute();
        
        // Devuelve todos los resultados como un array asociativo
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($data) {
        $stmt = $this->pdo->prepare("INSERT INTO producto (nombre, categoria, precio, descripcion, stock) VALUES (:nombre, :categoria, :precio, :descripcion, :stock)");
        $result = $stmt->execute([
            ':nombre' => $data['nombre'],
            ':categoria' => $data['categoria'],
            ':precio' => $data['precio'],
            ':descripcion' => $data['descripcion'],
            ':stock' => $data['stock']
        ]);
        return $result;
    }   
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos JSON inválidos o vacíos'
        ]);
        exit;
    }

    // Crear instancia y agregar producto
    $producto = new Producto($pdo);
    $resultado = $producto->agregar($data);

    if ($resultado) {
        echo json_encode([
            'success' => true,
            'message' => 'Producto agregado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al insertar en la base de datos'
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>