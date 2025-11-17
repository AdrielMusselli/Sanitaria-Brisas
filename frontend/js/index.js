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
      card.classList.add("card", "h-100", "position-relative", "overflow-hidden");

      const imagen = producto.imagenes || 'https://via.placeholder.com/300x300?text=Sin+Imagen';

      card.innerHTML = `
        <button class="btn-favorito" data-id="${producto.id_producto}" title="Agregar a favoritos">
          <i class="fas fa-heart"></i>
        </button>

        <div class="card-body">
          <a href="../paginas/producto.html?id=${producto.id_producto}" class="text-decoration-none text-dark">
            <div class="card-content">
              <img src="http://localhost/Sanitaria-Brisas/backend/${imagen}" alt="${producto.nombre}" class="img-fluid mb-3 rounded" onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
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
              <img src="http://localhost/Sanitaria-Brisas/backend/${prod.imagenes || ''}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover;" class="me-2 rounded" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3ENo image%3C/text%3E%3C/svg%3E'">
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
          const url = `http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto&categoria=${encodeURIComponent(categoriaFormateada)}`;
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
});


// =========================
// 🔐 Lógica de modales
// =========================
const loginForm = document.getElementById("loginForm");
const registroForm = document.getElementById("registroForm");

document.addEventListener("click", (e) => {
  const loginBtn = e.target.closest("#btnLogin");
  const registroBtn = e.target.closest("#btnRegistrarse");
  const cerrarBtn = e.target.closest(".cerrar");

  if (loginBtn) {
    document.getElementById("loginModal").style.display = "block";
  }

  if (registroBtn) {
    document.getElementById("registroModal").style.display = "block";
  }

  if (cerrarBtn) {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("registroModal").style.display = "none";
  }
});

// =========================
// ⚙️ Función para actualizar el menú del usuario después del login
// =========================
async function updateUserMenu() {
  try {
    const res = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=login", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    const userDropdown = document.getElementById("userDropdown");
    const navbar = document.querySelector(".navbar-nav.me-auto"); // contenedor de la izquierda (categorías)

    if (!userDropdown) return;

    if (data.success && data.user) {
      //  Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      //  Actualizar el dropdown del usuario
      userDropdown.innerHTML = `
         <li><a class="dropdown-item" href="../paginas/pedido.html"><i class="fas fa-box me-2"></i>Mis Pedidos</a></li>
      <li><a class="dropdown-item" href="../paginas/listadeseos.html"><i class="fas fa-heart me-2"></i>Lista de Deseos</a></li>
      <li><hr class="dropdown-divider"></li>
        <li><a id="btnLogout" class="dropdown-item"><i class="fas fa-sign-out-alt me-2"></i>Cerrar sesión</a></li>
      `;

      // Mostrar botón Admin Panel si el usuario es admin
      if (data.user.admin && Number(data.user.admin) === 1) {
        // Evitar duplicar el botón si ya existe
        if (!document.querySelector("#admin-panel-btn")) {
          const adminBtn = document.createElement("li");
          adminBtn.className = "nav-item";
          adminBtn.innerHTML = `
            <a id="admin-panel-btn" class="nav-link text" href="../admin_panel/administrador.html">
              <i class="fas fa-tools me-2"></i>Admin Panel
            </a>
          `;
          navbar.appendChild(adminBtn);
        }
      }

    } else {
      // Eliminar del localStorage
      localStorage.removeItem("user");

      // Dropdown para usuario no logueado
      userDropdown.innerHTML = `
        <li><a id="btnLogin" class="dropdown-item"><i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</a></li>
        <li><a id="btnRegistrarse" class="dropdown-item"><i class="fas fa-user-plus me-2"></i>Registrarse</a></li>
      `;

      const existingAdminBtn = document.querySelector("#admin-panel-btn");
      if (existingAdminBtn) existingAdminBtn.remove();
    }

  } catch (error) {
    console.error("Error actualizando menú de usuario:", error);
  }
}

// 🔑 LOGIN

if (loginForm) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger d-none mt-3";
  loginForm.appendChild(errorDiv);

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Iniciando sesión...';

    errorDiv.classList.add("d-none");

    const formData = new FormData(loginForm);

    try {
      const res = await fetch('http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=login', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await res.json();

      if (data.success) {
        document.getElementById("loginModal").style.display = "none";
        await updateUserMenu();
      } else {
        errorDiv.textContent = data.message || "Credenciales incorrectas";
        errorDiv.classList.remove("d-none");
      }
    } catch (err) {
      console.error("Error:", err);
      errorDiv.textContent = "Error al conectar con el servidor.";
      errorDiv.classList.remove("d-none");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// 🧾 REGISTRO

if (registroForm) {
  const registroErrorDiv = document.createElement("div");
  registroErrorDiv.className = "alert alert-danger d-none mt-3";
  registroForm.appendChild(registroErrorDiv);

  const registroOkDiv = document.createElement("div");
  registroOkDiv.className = "alert alert-success d-none mt-3";
  registroForm.appendChild(registroOkDiv);

  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = registroForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrando...';

    registroErrorDiv.classList.add("d-none");
    registroOkDiv.classList.add("d-none");

    const formData = {
      nombre: registroForm.nombre.value,
      email: registroForm.email.value,
      telefono: registroForm.telefono.value,
      password: registroForm.password.value,
      accion: 'registro'
    };

    try {
      const res = await fetch('http://localhost/Sanitaria-Brisas/backend/Api/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        registroOkDiv.textContent = data.message;
        registroOkDiv.classList.remove("d-none");
        registroForm.reset();

        setTimeout(() => {
          document.getElementById("registroModal").style.display = "none";
          registroOkDiv.classList.add("d-none");
        }, 2000);
      } else {
        registroErrorDiv.textContent = data.message;
        registroErrorDiv.classList.remove("d-none");
      }

    } catch (err) {
      console.error("Error:", err);
      registroErrorDiv.textContent = "Error al conectar con el servidor.";
      registroErrorDiv.classList.remove("d-none");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// 🚪 LOGOUT

document.addEventListener("click", async (e) => {
  const logoutBtn = e.target.closest("#btnLogout");
  if (logoutBtn) {
    const res = await fetch('http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=logout', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      await updateUserMenu();
    }
  }
});

// mostrar modal de login si no esta iniciado sesion al tocar el boton de carrito
document.addEventListener("DOMContentLoaded", () => {
  const cartLink = document.getElementById("cart-link");

  cartLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      let user = null;

      if (typeof checkSession === "function") {
        user = await checkSession();
      }

      if (user) {
        window.location.href = "../paginas/carrrito.html";
      } else {
        const loginModal = document.getElementById("loginModal");
        if (loginModal) {
          loginModal.style.display = "block";
        }
      }
    } catch (error) {
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

function updateFavoritosUI() {
  const favoritos = getFavoritos();
  const btnsFavorito = document.querySelectorAll('.btn-favorito');
  
  btnsFavorito.forEach(btn => {
    const id = btn.dataset.id;
    const icon = btn.querySelector('i');
    
    if (favoritos[id]) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      btn.classList.add('active');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
      btn.classList.remove('active');
    }
  });
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

function mostrarProductos(productos) {
  const contenedor = document.getElementById("lista-productos");
  if (contenedor) {
    contenedor.innerHTML = "";

    if (productos.length === 0) {
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
      card.classList.add("card", "h-100", "position-relative", "overflow-hidden");

      const imagen = producto.imagenes || 'https://via.placeholder.com/300x300?text=Sin+Imagen';
      
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
              <img src="http://localhost/Sanitaria-Brisas/backend/${imagen}" alt="${producto.nombre}" class="img-fluid mb-3 rounded" onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
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
    
    updateFavoritosUI();
  }
}

// Manejo centralizado de clicks en botones "Agregar al carrito"
// Usamos delegación para cubrir productos renderizados dinámicamente.
document.addEventListener('click', async (e) => {
  const btnFavorito = e.target.closest('.btn-favorito');
  if (btnFavorito) {
    e.preventDefault();
    e.stopPropagation();
    
    const id = btnFavorito.dataset.id;
    if (!id) return;
    
    const prod = producto.find(p => String(p.id_producto) === String(id));
    if (!prod) {
      console.warn('Producto no encontrado para id:', id);
      return;
    }
    
    const favoritos = getFavoritos();
    const productId = String(prod.id_producto);
    
    if (favoritos[productId]) {
      // Eliminar de favoritos
      delete favoritos[productId];
      console.log('Producto eliminado de favoritos:', prod.nombre);
    } else {
      // Agregar a favoritos
      const imagenPath = prod.imagenes && prod.imagenes.trim() 
        ? `http://localhost/Sanitaria-Brisas/backend/${prod.imagenes}` 
        : null;
      
      favoritos[productId] = {
        id: productId,
        nombre: prod.nombre,
        precio: prod.precio,
        imagen: imagenPath,
        id_producto: prod.id_producto
      };
      console.log('Producto agregado a favoritos:', prod.nombre);
    }
    
    saveFavoritos(favoritos);
    updateFavoritosUI();
    return;
  }
  
  const btn = e.target.closest('.card-button');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const id = btn.dataset.id;
  if (!id) return;

  let user = null;
  try {
    if (typeof checkSession === 'function') {
      user = await checkSession();
    }
  } catch (err) {
    console.error('Error verificando sesión:', err);
  }

  if (!user) {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) {
      loginModal.style.display = "block";
    }
    return;
  }

  const prod = producto.find(p => String(p.id_producto) === String(id));
  if (!prod) {
    console.warn('Producto no encontrado para id:', id);
    return;
  }

  try {
    const cart = getCart();
    
    const productId = String(prod.id_producto);
    if (cart[productId]) {
      cart[productId].cantidad = Number(cart[productId].cantidad) + 1;
    } else {
      const imagenPath = prod.imagenes && prod.imagenes.trim() 
        ? `http://localhost/Sanitaria-Brisas/backend/${prod.imagenes}` 
        : null;
      
      cart[productId] = {
        id: productId,
        nombre: prod.nombre,
        precio: prod.precio,
        cantidad: 1,
        imagen: imagenPath,
        id_producto: prod.id_producto
      };
    }
    saveCart(cart);
    updateCartCount();

    btn.innerHTML = '<span class="text"><i class="fas fa-check-circle me-2"></i>Agregado</span>';
  } catch (err) {
    console.error('Error agregando al carrito:', err);
    alert('No se pudo agregar el producto al carrito. Intente nuevamente.');
  }
});

async function obtenerProductos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    producto.length = 0;
    producto.push(...data);

    mostrarProductos(data);

    return data;

  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}


// =========================
// 🔁 Al cargar la página, verificar sesión activa
// =========================
document.addEventListener("DOMContentLoaded", updateUserMenu);
