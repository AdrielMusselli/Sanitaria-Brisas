
const producto = [];

function mostrarProductos(productos) {
  const contenedor = document.getElementById("lista-productos");
  if (contenedor) {
    contenedor.innerHTML = "";

    if (productos.length === 0) {
      // Crear el mensaje de "Producto no encontrado"
      const mensajeDiv = document.createElement("div");
      mensajeDiv.classList.add("col-12", "text-center", "my-5", "h-400");
      mensajeDiv.innerHTML = `
        <h3 class="text-muted">Producto no encontrado</h3>
      `;
      contenedor.appendChild(mensajeDiv);
      return;
    }

    productos.forEach(producto => {
      const col = document.createElement("div");
      col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-4");

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
              <button class="card-button btn btn-primary mt-2" data-id="${producto.id}">Agregar al carrito</button>
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
      console.log("Productos recibidos:", data);

      // Store products in the global array
      producto.length = 0; // Clear the array
      producto.push(...data); // Add all products

      // Display the products
      mostrarProductos(data);

    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }

  // Ejecutar al cargar la página
  obtenerProductos();
});

