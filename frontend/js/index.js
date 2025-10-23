

async function obtenerProductos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=producto");

    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos recibidos:", data);

    // Si querés mostrarlos en una tabla o lista, podés hacerlo así:
   const contenedor = document.getElementById("lista-productos");

if (contenedor) {
  contenedor.innerHTML = "";

  data.forEach(producto => {
    // Columna (grid de Bootstrap)
    const col = document.createElement("div");
    col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-4");

  // Card dentro de la columna
  const card = document.createElement("div");
  card.classList.add("card", "h-100");

    const imagen = producto.imagen
      ? producto.imagen
      : "../assets/pintura.jpeg"; // imagen por defecto

    // Contenido de la card: usar clases definidas en CSS y data-id en el botón
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

    // Agregar la card dentro de la columna
    col.appendChild(card);

    // Agregar la columna al contenedor principal
    contenedor.appendChild(col);
  });
}


  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}


  

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", obtenerProductos);

