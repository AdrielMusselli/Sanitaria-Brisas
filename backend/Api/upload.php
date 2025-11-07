<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod !== 'POST') {
if (isset $_FILES["imagenes"]) {
    $extension = pathinfo($_FILES["imagenes"]["name"], PATHINFO_EXTENSION);
    move_uploaded_file($_FILES["imagenes"]["tmp_name"], "../assets/" . '.' . $extension);
    $resultado = '../assets/' . '.' . $extension;
    echo json_encode([
        "ruta" => $resultado
    ]);
    $fileName = uniqid() . '.' . basename($_FILES['imagenes']['name']) . $extension;
    $uploadFile = '../assets/' . $fileName . $extension;
    exit;
}
}
/*
function handleImageUpload() {
    $target_dir = "../assets/";
    
    // Crear el directorio si no existe
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    if (!isset($_FILES["imagenes"])) {
        return [
            "success" => false,
            "message" => "No se recibió ninguna imagen"
        ];
    }

    $file = $_FILES["imagenes"];
    $fileName = basename($file["name"]);
    $targetFile = $target_dir . time() . '_' . $fileName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Verificar si es una imagen real
    if (!getimagesize($file["tmp_name"])) {
        return [
            "success" => false,
            "message" => "El archivo no es una imagen válida"
        ];
    }

    // Verificar tamaño (2MB máximo)
    if ($file["size"] > 2000000) {
        return [
            "success" => false,
            "message" => "La imagen es demasiado grande (máximo 2MB)"
        ];
    }

    // Permitir ciertos formatos
    if (!in_array($imageFileType, ["jpg", "jpeg", "png", "gif"])) {
        return [
            "success" => false,
            "message" => "Solo se permiten archivos JPG, JPEG, PNG & GIF"
        ];
    }

    // Intentar subir el archivo
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return [
            "success" => true,
            "path" => str_replace("../", "", $targetFile)
        ];
    }

    return [
        "success" => false,
        "message" => "Error al subir la imagen"
    ];
}

// Si es una solicitud POST, procesar la imagen
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $result = handleImageUpload();
    header('Content-Type: application/json');
    echo json_encode($result);
}
?>