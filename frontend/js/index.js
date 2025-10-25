
const producto = [];

// Función para mostrar el spinner de carga
function mostrarCargando() {
  const contenedor = document.getElementById("lista-productos");
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="col-12 text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2 text-muted">Cargando productos...</p>
      </div>
    `;
  }
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("lista-productos");
  if (contenedor) {
    contenedor.innerHTML = "";

    if (productos.length === 0) {
      // Crear el mensaje de "Producto no encontrado"
      const mensajeDiv = document.createElement("div");
      mensajeDiv.classList.add("col-12", "text-center", "my-5", "h-400");
      mensajeDiv.innerHTML = `
        <h3 class="text-muted">No se encontraron productos en esta categoría</h3>
      `;
      contenedor.appendChild(mensajeDiv);
      return;
    }

    productos.forEach(producto => {
      const col = document.createElement("div");
      col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-3");

      const card = document.createElement("div");
      card.classList.add("card", "h-100");

      const imagen = producto.imagen
        ? producto.imagen
        : "../assets/pintura.jpeg"; // imagen por defecto

      card.innerHTML = `
        <div class="card-body">
          <a href="../paginas/producto.html" class="text-decoration-none text-dark">
            <div class="card-content text-center">
              <img src="${imagen}" alt="${producto.nombre}" class="img-fluid mb-3 rounded">
              <h3 class="card-title">${producto.nombre}</h3>
              <h5 class="card-price">$${producto.precio}</h5>
              <p class="card-text">${producto.descripcion}</p>
              <button class="card-button btn btn-primary mt-2" data-id="${producto.id_producto}">Agregar al carrito</button>
            </div>
          </a>
        </div>
      `;

      col.appendChild(card);
      contenedor.appendChild(col);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById('buscador');
  const searchForm = buscador.closest('form');
  
  // Crear el contenedor de sugerencias
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.classList.add('search-suggestions', 'position-absolute', 'w-100', 'bg-white', 'border', 'rounded', 'shadow-sm', 'mt-1');
  suggestionsContainer.style.cssText = `
    max-height: 300px;
    overflow-y: auto;
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
  `;
  
  // Asegurarse de que el contenedor padre tenga position relative
  const searchContainer = buscador.closest('.input-group');
  searchContainer.style.position = 'relative';
  searchContainer.appendChild(suggestionsContainer);

  if (buscador) {
    // Evento keyup para mostrar sugerencias
    buscador.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') return; // Ignorar la tecla Enter aquí
      
      const texto = e.target.value.toLowerCase().trim();
      
      if (texto.length < 2) {
        suggestionsContainer.style.display = 'none';
        return;
      }

      const filtrados = producto.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );

      if (filtrados.length > 0) {
        suggestionsContainer.innerHTML = filtrados.map(prod => `
          <div class="suggestion-item p-2 border-bottom hover-bg-light" style="cursor: pointer;">
            <div class="d-flex align-items-center">
              <img src="${prod.imagen || '../assets/pintura.jpeg'}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover;" class="me-2 rounded">
              <div>
                <div class="fw-bold">${prod.nombre}</div>
                <div class="text-muted">$${prod.precio}</div>
              </div>
            </div>
          </div>
        `).join('');
        suggestionsContainer.style.display = 'block';
        
        // Agregar eventos click a las sugerencias
        const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
          item.addEventListener('click', () => {
            buscador.value = filtrados[index].nombre;
            suggestionsContainer.style.display = 'none';
            mostrarProductos([filtrados[index]]);
          });
        });
      } else {
        suggestionsContainer.innerHTML = '<div class="p-2 text-muted">No se encontraron productos</div>';
        suggestionsContainer.style.display = 'block';
      }
    });

    // Cerrar sugerencias cuando se hace clic fuera
    document.addEventListener('click', (e) => {
      if (!buscador.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });

    // Prevenir el comportamiento por defecto del formulario y manejar la búsqueda
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = buscador.value.toLowerCase().trim();
      const filtrados = producto.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
      mostrarProductos(filtrados);
      suggestionsContainer.style.display = 'none';
    });

  }

  async function obtenerProductos() {
    try {
      const response = await fetch("http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=producto");

      // Verificamos si la respuesta HTTP es válida
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Store products in the global array
      producto.length = 0; // Clear the array
      producto.push(...data); // Add all products

      // Display the products
      mostrarProductos(data);

      // Return data for callers that may await this function
      return data;

    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }

  // Ejecutar al cargar la página
  obtenerProductos();

  // Inicializar contador de carrito
  updateCartCount();

  // Manejo de clicks en las categorías del menú para pedir la categoría al backend
  const categoryLinks = document.querySelectorAll('.category-link[data-category]');
  if (categoryLinks.length > 0) {
    categoryLinks.forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        // Normalizar la categoría (primera letra mayúscula, resto minúsculas)
        const categoria = link.getAttribute('data-category');
        const categoriaFormateada = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
        console.log('Click en categoría:', categoriaFormateada);
        
        // Mostrar spinner de carga
        mostrarCargando();

        try {
          // Pedir al backend sólo los productos de la categoría
          const url = `http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=producto&categoria=${encodeURIComponent(categoriaFormateada)}`;
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();

          // Actualizar el array global por si otras funcionalidades lo necesitan
          producto.length = 0;
          producto.push(...data);

          mostrarProductos(data);

          // Cerrar el dropdown de Bootstrap (si está abierto)
          try {
            const dropdownEl = link.closest('.dropdown');
            if (dropdownEl) {
              const bsDropdown = bootstrap.Dropdown.getInstance(dropdownEl.querySelector('.dropdown-toggle'));
              if (bsDropdown) bsDropdown.hide();
            }
          } catch (err) {
            // Ignorar si bootstrap no está disponible
          }

        } catch (error) {
          console.error('Error al obtener productos por categoría:', error);
          mostrarProductos([]);
        }
      });
    });
  }

  // Manejo centralizado de clicks en botones "Agregar al carrito"
  // Usamos delegación para cubrir productos renderizados dinámicamente.
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.card-button');
    if (!btn) return;

    // Evitar que el <a> padre navegue cuando el botón está dentro de un enlace
    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.id;
    if (!id) return;

    // Verificar sesión (función definida en nav.js)
    let user = null;
    try {
      if (typeof checkSession === 'function') {
        user = await checkSession();
      }
    } catch (err) {
      console.error('Error verificando sesión:', err);
    }

    if (!user) {
      // No está logueado: redirigir a Login
      // Se puede mejorar mostrando un modal; por simplicidad redirigimos.
      window.location.href = '../paginas/Login.html';
      return;
    }

    // Buscar el producto en el array global `producto`
    const prod = producto.find(p => String(p.id_producto) === String(id));
    if (!prod) {
      console.warn('Producto no encontrado para id:', id);
      return;
    }

    console.debug('Agregando al carrito:', prod);

    // Agregar al carrito en localStorage
    try {
      console.log('Debug: Producto a agregar:', prod);
      const cart = getCart();
      console.log('Debug: Estado actual del carrito:', cart);
      
      const productId = String(prod.id_producto); // Asegurar que el ID sea string
      if (cart[productId]) {
        cart[productId].cantidad = Number(cart[productId].cantidad) + 1;
      } else {
        cart[productId] = {
          id: productId,
          nombre: prod.nombre,
          precio: prod.precio,
          cantidad: 1,
          imagen: prod.imagen || '../assets/pintura.jpeg'
        };
      }
      console.log('Debug: Nuevo estado del carrito:', cart);
      saveCart(cart);
      updateCartCount();

      // Feedback visual sencillo
      btn.classList.add('btn-success');
      btn.textContent = 'Agregado';
      setTimeout(() => {
        btn.classList.remove('btn-success');
        btn.textContent = 'Agregar al carrito';
      }, 1200);
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      alert('No se pudo agregar el producto al carrito. Intente nuevamente.');
    }
  });
});

// Helpers de carrito usando localStorage
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

