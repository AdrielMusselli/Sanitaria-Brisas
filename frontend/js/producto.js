// URL base de tu API
const API_URL = "http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto";

const params = new URLSearchParams(window.location.search);
const producto = {
  id_producto: params.get('id') // Obtener el ID de los parámetros de URL
};

console.log("ID del producto recibido:", producto.id_producto);

// Variable global para almacenar los datos del producto
let productoData = null;

// 🔹 Referencias a elementos del DOM
const tituloEl = document.querySelector(".product-title");
const precioEl = document.querySelector(".product-price");
const descripcionEl = document.querySelector("#description p");
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
  if (!producto.id_producto) {
    console.error("❌ No se proporcionó un ID de producto en la URL.");
    tituloEl.textContent = "Producto no encontrado";
    descripcionEl.textContent = "No se pudo cargar la información del producto.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}&id=${producto.id_producto}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    if (!data || data.length === 0) {
      tituloEl.textContent = "Producto no encontrado";
      descripcionEl.textContent = "No se encontró información para este producto.";
      return;
    }

    // Si la API devuelve un solo objeto o un array
    productoData = Array.isArray(data) ? data[0] : data;

    console.log("📦 Producto cargado:", productoData);

    // 🧾 Mostrar datos en el HTML
    tituloEl.textContent = productoData.nombre || "Sin nombre";
    precioEl.textContent = `UYU $${productoData.precio || "0.00"}`;
    descripcionEl.textContent = productoData.descripcion || "Sin descripción disponible.";
    stockEl.textContent = `Stock disponible: ${productoData.stock ?? "No especificado"}`;

    const mainImage = document.getElementById("mainImage");
    if (mainImage && productoData.imagenes) {
      mainImage.src = `http://localhost/Sanitaria-Brisas/backend/${productoData.imagenes}`;
      mainImage.onerror = function() {
        this.src = "https://via.placeholder.com/300x300?text=Sin+Imagen";
      };
    }

  } catch (error) {
    console.error("❌ Error al cargar el producto:", error);
    tituloEl.textContent = "Error al cargar el producto";
    descripcionEl.textContent = "Ocurrió un problema al conectarse con el servidor.";
  }
}

// ============================
// 🛒 Funciones del carrito
// ============================
function getCart() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error leyendo carrito desde localStorage', err);
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (err) {
    console.error('Error guardando carrito en localStorage', err);
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((s, item) => s + Number(item.cantidad || 0), 0);
  const cartLink = document.getElementById('cart-link');
  if (!cartLink) return;

  // Añadir badge si no existe
  let badge = cartLink.querySelector('.cart-count-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-count-badge';
    badge.style.fontSize = '0.7rem';
    badge.style.transform = 'translate(-10%, -40%)';
    cartLink.appendChild(badge);
  }

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// ============================
// 🚀 Ejecutar al cargar la página
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  await cargarProducto();
  updateCartCount();

  // Agregar al carrito
  const addToCartBtn = document.querySelector('.btn-primary-custom');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (!productoData) {
        alert('El producto aún no se ha cargado. Por favor espere.');
        return;
      }

      // Verificar sesión
      let user = null;
      try {
        if (typeof checkSession === 'function') {
          user = await checkSession();
        }
      } catch (err) {
        console.error('Error verificando sesión:', err);
      }

      if (!user) {
        alert('Debes iniciar sesión para agregar productos al carrito.');
        window.location.href = '../paginas/index.html';
        return;
      }

      try {
        const cart = getCart();
        const productId = String(productoData.id_producto);

        if (cart[productId]) {
          cart[productId].cantidad = Number(cart[productId].cantidad) + 1;
        } else {
          const imagenPath = productoData.imagenes && productoData.imagenes.trim() 
            ? `http://localhost/Sanitaria-Brisas/backend/${productoData.imagenes}` 
            : null;
          
          cart[productId] = {
            id: productId,
            nombre: productoData.nombre,
            precio: productoData.precio,
            cantidad: 1,
            imagen: imagenPath,
            id_producto: productoData.id_producto
          };
        }

        saveCart(cart);
        updateCartCount();

        // Cambiar texto del botón temporalmente
        const originalHTML = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Agregado al Carrito';
        addToCartBtn.disabled = true;

        setTimeout(() => {
          addToCartBtn.innerHTML = originalHTML;
          addToCartBtn.disabled = false;
        }, 2000);

      } catch (err) {
        console.error('Error agregando al carrito:', err);
        alert('No se pudo agregar el producto al carrito. Intente nuevamente.');
      }
    });
  }
});
