<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
    exit;
}

function handleImageUpload() {
    // 🗂️ Ruta absoluta al directorio de destino
    $target_dir = __DIR__ . "/../../frontend/assets/";

    // Verificar archivo recibido
    if (!isset($_FILES["imagenes"])) {
        return [
            "success" => false,
            "message" => "No se recibió ninguna imagen"
        ];
    }

    $file = $_FILES["imagenes"];
    $fileName = basename($file["name"]);
    $targetFile = $target_dir . $fileName;
    $imageFileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    // Validar si es una imagen
    if (!getimagesize($file["tmp_name"])) {
        return ["success" => false, "message" => "El archivo no es una imagen válida"];
    }

    // Límite de tamaño (2MB)
    if ($file["size"] > 2000000) {
        return ["success" => false, "message" => "La imagen es demasiado grande (máximo 2MB)"];
    }

    // Validar extensión
    if (!in_array($imageFileType, ["jpg", "jpeg", "png", "gif"])) {
        return ["success" => false, "message" => "Solo se permiten archivos JPG, JPEG, PNG & GIF"];
    }

    // Si ya existe, no se vuelve a subir
    if (file_exists($targetFile)) {
        return [
            "success" => true,
            "message" => "La imagen ya existe, no se volvió a subir",
            "path" => "frontend/assets/" . $fileName
        ];
    }

    // Subir la imagen
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return [
            "success" => true,
            "message" => "Imagen subida correctamente",
            "path" => "frontend/assets/" . $fileName
        ];
    }

    return ["success" => false, "message" => "Error al subir la imagen"];
}

echo json_encode(handleImageUpload());
?>
