<?php
require "../Models/Pedido.php"; // Importa el modelo

// Instancia del modelo principal
$pedidoModel = new Pedido($pdo);

/**
 * Obtener todos los pedidos
 */
function obtenerPedido() {
    global $pedidoModel;
    echo json_encode($pedidoModel->obtenerTodos());
}

/**
 * Agregar un nuevo pedido con sus productos
 */
function agregarPedido() {
    global $pedidoModel;

    $id_usuario    = $_POST['id_usuario'] ?? null;
    $estado        = $_POST['estado'] ?? "Pendiente";
    $direccion     = $_POST['direccion_envio'] ?? "";
    $precio_total  = $_POST['precio_total'] ?? 0;
    $fecha         = $_POST['fecha'] ?? date('Y-m-d H:i:s');
    $productos     = json_decode($_POST['productos'] ?? '[]', true);

    if (!$id_usuario || empty($productos)) {
        echo json_encode([
            "success" => false,
            "message" => "Parámetros faltantes"
        ]);
        exit;
    }

    $resultado = $pedidoModel->agregar($id_usuario, $fecha, $estado, $precio_total, $direccion, $productos);

    echo json_encode($resultado);
}

function eliminarPedido($id_pedido) {
    global $pedidoModel;
    if ($pedidoModel->eliminarPedido($id_pedido)) {
        echo json_encode(["success" => true, "message" => "Pedido eliminado exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el pedido"]);
    }
}


function obtenerDetallesPedido($id_pedido) {
    global $pedidoModel;

    if (!$id_pedido) {
        echo json_encode([
            "success" => false,
            "message" => "Falta id_pedido"
        ]);
        return;
    }

    $detalles = $pedidoModel->obtenerDetallesPedido($id_pedido);

    echo json_encode([
        "success" => true,
        "detalles" => $detalles ?: []
    ]);
}
