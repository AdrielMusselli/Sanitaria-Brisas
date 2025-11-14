
// URL base de tu API
const API_URL = "http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto";

// 🔍 Obtener el parámetro "id" de la URL o desde localStorage
const params = new URLSearchParams(window.location.search);
let idProducto = params.get("id");

// Si no viene en la URL, intentar obtener de localStorage (navegación desde index.js)
if (!idProducto) {
  idProducto = localStorage.getItem('selectedProductId');
}

console.log("ID del producto recibido:", idProducto);

// 🔹 Referencias a elementos del DOM
const tituloEl = document.querySelector(".product-title");
const precioEl = document.querySelector(".product-price");
const descripcionEl = document.querySelector("#description p");
const imagenEl = document.querySelector(".main-image");
const stockEl = document.createElement("p"); // agregaremos debajo del precio
stockEl.classList.add("text-muted", "mt-2");

// Insertar el elemento de stock si no existe aún
const priceSection = document.querySelector(".price-section");
if (priceSection && !priceSection.querySelector(".stock-info")) {
  stockEl.classList.add("stock-info");
  priceSection.appendChild(stockEl);
}

// ============================
// 🔄 Función para obtener y mostrar el producto
// ============================
async function cargarProducto() {
  if (!idProducto) {
    console.error(" No se proporcionó un ID de producto en la URL.");
    tituloEl.textContent = "Producto no encontrado";
    descripcionEl.textContent = "No se pudo cargar la información del producto.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}&id=${idProducto}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    if (!data || data.length === 0) {
      tituloEl.textContent = "Producto no encontrado";
      descripcionEl.textContent = "No se encontró información para este producto.";
      return;
    }

    // Si la API devuelve un solo objeto o un array
    const producto = Array.isArray(data) ? data[0] : data;

    console.log("📦 Producto cargado:", producto);

    // 🧾 Mostrar datos en el HTML
    tituloEl.textContent = producto.nombre || "Sin nombre";
    precioEl.textContent = `UYU $${producto.precio || "0.00"}`;
    descripcionEl.textContent = producto.descripcion || "Sin descripción disponible.";
    stockEl.textContent = `Stock disponible: ${producto.stock ?? "No especificado"}`;
    
    // Resolver y mostrar imagen
    if (imagenEl) {
      let imgSrc = producto.imagenes || producto.imagen || "";
      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
        imgSrc = 'http://localhost/Sanitaria-Brisas/backend/assets' + imgSrc;
      }
      if (!imgSrc) {
        imgSrc = 'http://localhost/Sanitaria-Brisas/frontend/assets/1761440847_master.png';
      }
      imagenEl.src = imgSrc;
      imagenEl.onerror = function() {
        this.src = 'http://localhost/Sanitaria-Brisas/frontend/assets/1761440847_master.png';
      };
    }
    



  } catch (error) {
    console.error("❌ Error al cargar el producto:", error);
    tituloEl.textContent = "Error al cargar el producto";
    descripcionEl.textContent = "Ocurrió un problema al conectarse con el servidor.";
  }
}

// ============================
// 🚀 Ejecutar al cargar la página
// ============================
document.addEventListener("DOMContentLoaded", cargarProducto);
