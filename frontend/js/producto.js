// ===============================
// producto.js
// ===============================

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
// LocalStorage Helpers
// ============================
function getFavoritos() {
  try {
    const raw = localStorage.getItem('favoritos');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error leyendo favoritos desde localStorage', err);
    return {};
  }
}

function saveFavoritos(favoritos) {
  try {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  } catch (err) {
    console.error('Error guardando favoritos en localStorage', err);
  }
}

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
// Cargar Producto
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
    productoData = Array.isArray(data) ? data[0] : data;

    console.log("📦 Producto cargado:", productoData);

    // Mostrar datos en el HTML
    tituloEl.textContent = productoData.nombre || "Sin nombre";
    precioEl.textContent = `UYU $${productoData.precio || "0.00"}`;
    descripcionEl.textContent = productoData.descripcion || "Sin descripción disponible.";
    stockEl.textContent = `Stock disponible: ${productoData.stock ?? "No especificado"}`;

    const mainImage = document.getElementById("mainImage");
    if (mainImage) {
      const imagenSrc = productoData.imagenes
        ? `http://localhost/Sanitaria-Brisas/backend/${productoData.imagenes}`
        : "https://via.placeholder.com/300x300?text=Sin+Imagen";
      mainImage.src = imagenSrc;
      mainImage.onerror = () => {
        mainImage.src = "https://via.placeholder.com/300x300?text=Sin+Imagen";
      };
    }

  } catch (error) {
    console.error("❌ Error al cargar el producto:", error);
    tituloEl.textContent = "Error al cargar el producto";
    descripcionEl.textContent = "Ocurrió un problema al conectarse con el servidor.";
  }
}

// ============================
// Inicializar Botón Favoritos
// ============================
function initWishlistButton() {
  const wishlistBtn = document.querySelector('.wishlist-btn');
  if (!wishlistBtn || !productoData) return;

  const favoritos = getFavoritos();
  const icon = wishlistBtn.querySelector('i');

  if (favoritos[productoData.id_producto]) {
    icon.classList.remove('far');
    icon.classList.add('fas');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
  }

  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favoritos = getFavoritos();
    const productId = productoData.id_producto;

    if (favoritos[productId]) {
      delete favoritos[productId];
      icon.classList.remove('fas');
      icon.classList.add('far');
    } else {
      favoritos[productId] = {
  id: productId,
  nombre: productoData.nombre,
  precio: productoData.precio,
  imagen: productoData.imagenes
    ? `http://localhost/Sanitaria-Brisas/backend/${productoData.imagenes}`
    : '../assets/pintura.jpeg',
  categoria: productoData.categoria,
  stock: productoData.stock
};
      icon.classList.remove('far');
      icon.classList.add('fas');
    }

    saveFavoritos(favoritos);
  });
}

// ============================
// Productos Relacionados
// ============================
async function cargarProductosRelacionados(categoriaActual) {
  const container = document.getElementById("related-products-container");
  if (!container || !categoriaActual) return;

  try {
    const response = await fetch(`${API_URL}&categoria=${encodeURIComponent(categoriaActual)}`);
    if (!response.ok) throw new Error("Error HTTP " + response.status);

    const data = await response.json();
    if (!data || data.length === 0) {
      container.innerHTML = "<p class='text-muted'>No hay productos relacionados.</p>";
      return;
    }

    // Excluir el producto actual
    const productosRelacionados = data.filter(p => String(p.id_producto) !== String(productoData.id_producto));
    mostrarProductosRelacionados(productosRelacionados);

  } catch (err) {
    console.error("Error cargando productos relacionados:", err);
    container.innerHTML = "<p class='text-muted'>Error al cargar productos relacionados.</p>";
  }
}

function mostrarProductosRelacionados(productos) {
  const contenedor = document.getElementById("related-products-container");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach(producto => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-3");

    const card = document.createElement("div");
    card.classList.add("card", "h-100", "position-relative", "overflow-hidden");

    const imagen = producto.imagenes
      ? `http://localhost/Sanitaria-Brisas/backend/${producto.imagenes}`
      : 'https://via.placeholder.com/300x300?text=Sin+Imagen';

    const favoritos = getFavoritos();
    const esFavorito = favoritos[String(producto.id_producto)];
    const iconoClase = esFavorito ? 'fas' : 'far';
    const btnClase = esFavorito ? 'btn-favorito active' : 'btn-favorito';

    card.innerHTML = `
      <button class="${btnClase}" data-id="${producto.id_producto}" title="Agregar a favoritos">
        <i class="${iconoClase} fa-heart"></i>
      </button>

      <div class="card-body">
        <a href="../paginas/producto.html?id=${producto.id_producto}" class="text-decoration-none text-dark">
          <div class="card-content">
            <img src="${imagen}" alt="${producto.nombre}" class="img-fluid mb-3 rounded">
            <h3 class="card-title">${producto.nombre}</h3>
            <h5 class="card-price">$${producto.precio}</h5>
            <button class="card-button btn btn-primary mt-2" data-id="${producto.id_producto}">
              <i class="fas fa-shopping-cart me-2"></i>Agregar al carrito
            </button>
          </div>
        </a>
      </div>
    `;

    col.appendChild(card);
    contenedor.appendChild(col);
  });

  // Inicializar botón de favoritos de cada card
  const btnsFavorito = contenedor.querySelectorAll('.btn-favorito');
  btnsFavorito.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = btn.dataset.id;
      const favoritos = getFavoritos();
      const icon = btn.querySelector('i');

      if (favoritos[id]) {
        delete favoritos[id];
        icon.classList.remove('fas');
        icon.classList.add('far');
      } else {
        const productoCard = productos.find(p => String(p.id_producto) === String(id));
        if (!productoCard) return;

        favoritos[id] = {
          id: id,
          nombre: productoCard.nombre,
          precio: productoCard.precio,
          imagen: productoCard.imagenes,
          categoria: productoCard.categoria,
          stock: productoCard.stock
        };
        icon.classList.remove('far');
        icon.classList.add('fas');
      }

      saveFavoritos(favoritos);
    });
  });
}

// ============================
// Agregar al carrito desde producto.html
// ============================
function addToCart(producto) {
  const cart = getCart();
  const productId = String(producto.id_producto || producto.id);

  if (cart[productId]) {
    cart[productId].cantidad = Number(cart[productId].cantidad) + 1;
  } else {
    const imagenPath = producto.imagenes
      ? `http://localhost/Sanitaria-Brisas/backend/${producto.imagenes}`
      : null;

    cart[productId] = {
      id: productId,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: imagenPath,
      id_producto: producto.id_producto
    };
  }

  saveCart(cart);
  updateCartCount();
}

// ============================
// DOMContentLoaded
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  await cargarProducto();
  updateCartCount();
  initWishlistButton();

  if (productoData && productoData.categoria) {
    cargarProductosRelacionados(productoData.categoria);
  }

  // Botón Agregar al carrito
  const addToCartBtn = document.querySelector('.btn-primary-custom');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (productoData) addToCart(productoData);
    });
  }

  cargarResenas();
});

// ============================
// Cargar Reseñas del Producto
// ============================
async function cargarResenas() {
    const container = document.getElementById("reviews-container");
    if (!container) return;

    container.innerHTML = `<p class="text-muted">Cargando reseñas...</p>`;

    try {
        const res = await fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=resenas&id_producto=${producto.id_producto}`);
        if (!res.ok) throw new Error("Error HTTP " + res.status);

        const data = await res.json();

        console.log("📄 Reseñas recibidas:", data);

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = `<p class="text-muted">Este producto aún no tiene reseñas.</p>`;
            return;
        }

        container.innerHTML = "";

        data.forEach(r => {
            const estrellas = generarEstrellas(r.puntuacion);

            const item = document.createElement("div");
            item.classList.add("review-item", "mb-3");
            item.innerHTML = `
                <div class="review-header d-flex justify-content-between">
                    <div>
                       <div class="reviewer-name">${r.nombre_usuario}</div>
                        <div class="stars text-warning">${estrellas}</div>
                    </div>
                    <div class="review-date">${r.fecha || ""}</div>
                </div>
                <p>${r.comentario || "Sin comentario."}</p>
            `;
            container.appendChild(item);
        });

    } catch (err) {
        console.error("❌ Error cargando reseñas:", err);
        container.innerHTML = `<p class="text-danger">No se pudieron cargar las reseñas.</p>`;
    }
}

// Generar estrellas HTML según puntuación
function generarEstrellas(num) {
    num = Number(num) || 0;
    let html = "";
    for (let i = 1; i <= 5; i++) {
        html += `<i class="fas fa-star${i > num ? '-o' : ''}"></i>`;
    }
    return html;
}


