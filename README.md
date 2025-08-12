# 🛠 Proyecto Sanitaria

Este proyecto está dividido en dos partes principales: **Backend** y **Frontend**, manteniendo la lógica de negocio y la interfaz de usuario separadas para un mejor mantenimiento y escalabilidad.

---

## 📂 Backend (`backend/`)

Aquí vive toda la lógica que procesa y envía datos al frontend.

* **`Api/api.php`**
  Punto de entrada para solicitudes del frontend. Procesa peticiones y devuelve respuestas, normalmente en formato JSON.

* **`BBDD/sanitaria.sql`**
  Exportación de la base de datos, con su estructura y datos iniciales.

* **`Config/pdo.php`**
  Configuración de la conexión a la base de datos utilizando **PDO**.

* **`Controllers/productos.php`**
  Controlador que maneja la lógica de negocio de los productos, actuando como puente entre la API y los modelos.

* **`Models/Producto.php`**
  Modelo que define la estructura de los productos y métodos para interactuar con la base de datos (operaciones CRUD).

---

## 🎨 Frontend (`frontend/`)

Esta parte contiene todos los recursos y páginas visibles para el usuario final.

* **`assets/`**
  Archivos estáticos como imágenes y otros recursos gráficos.

* **`page/`**
  Contiene las páginas HTML que conforman el sitio:

  * Carpeta `categorias/` con páginas específicas (construcción, herramientas, pinturas, techos, etc.).
  * Páginas principales: `carrrito.html`, `checkout.html`, `index.html`, `Login.html`, `producto.html`.

* **`script/script.js`**
  Archivo JavaScript que gestiona la interacción de la página con el usuario y la comunicación con el backend.

* **`style/style.css`**
  Hoja de estilos que define la apariencia visual del sitio.

---

## 📌 Resumen de la Arquitectura

El **frontend** envía solicitudes al **backend** a través de `api.php`, que procesa la petición y utiliza los **controladores** y **modelos** para obtener o modificar datos en la **base de datos**.
El backend devuelve la información en JSON para que el JavaScript del frontend la procese y actualice el contenido en el navegador.

---
