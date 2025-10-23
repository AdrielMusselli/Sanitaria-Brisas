document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const section = this.getAttribute("data-section")
      mostrarSeccion(section)

      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })

  document.getElementById("productoForm").addEventListener("submit", agregarProducto)

  const API_URL = "http://localhost/Sanitaria-brisas/backend/Api/api.php";

async function obtenerPedidos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=pedido");
    
    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pedidos recibidos:", data);

    // Si querés mostrarlos en una tabla o lista, podés hacerlo así:
    const contenedor = document.getElementById("lista-pedidos");
    if (contenedor) {
      contenedor.innerHTML = "";
      data.forEach(pedido => {
        const item = document.createElement("li");
        item.textContent = `ID: ${pedido.id_pedido} | Usuario: ${pedido.id_usuario} | Estado: ${pedido.estado}`;
        contenedor.appendChild(item);
      });
    }

  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
}

async function obtenerProductos() {
  try {
    const response = await fetch(`${API_URL}?seccion=producto`);
    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos recibidos:", data);

    if (Array.isArray(data)) {
      renderizarProductos(data);
    } else {
      console.error("Formato de respuesta inválido:", data);
      alert("Error: Los datos recibidos no tienen el formato esperado");
    }

  } catch (error) {
    console.error("Error al obtener los productos:", error);
    alert("Error al obtener los productos");
  }
}
function renderizarProductos(data) {
  const tbody = document.querySelector("#tablaProductos tbody")

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos</td></tr>'
    return
  }

  tbody.innerHTML = data
    .map(
      (producto) => `
        <tr>
          <td>${producto.id_producto}</td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td>$${Number.parseFloat(producto.precio).toFixed(2)}</td>
          <td>${producto.descripcion || ''}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id_producto})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("")
}
async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    return;
  }

  try {
    console.log('Eliminando producto con ID:', id);
    const urlString = `${API_URL}?seccion=producto&id=${id}`;
    console.log('URL de eliminación:', urlString);

    const response = await fetch(urlString, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    let rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (jsonError) {
      console.error('Respuesta cruda del backend:', rawText);
      throw new Error('Respuesta del servidor no es JSON válido.');
    }

    if (!response.ok) {
      throw new Error(data.message || `Error HTTP: ${response.status}`);
    }

    if (data.success) {
      alert("Producto eliminado exitosamente");
      obtenerProductos();
    } else {
      throw new Error(data.message || "Error al eliminar el producto");
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    alert(error.message || "Error al eliminar el producto");
  }
}

async function agregarProducto(e) {
  e.preventDefault()

  const formData = new FormData()
  formData.append("seccion", "producto")
  formData.append("nombre", document.getElementById("nombre").value)
  formData.append("descripcion", document.getElementById("descripcion").value)
  formData.append("precio", document.getElementById("precio").value)
  formData.append("stock", document.getElementById("stock").value)
  formData.append("categoria", document.getElementById("categoria").value)
  

  try {
    const response = await fetch(API_URL + "?seccion=producto", {
      method: "POST",
      body: formData,
    })
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json()

    if (data.success) {
      alert("Producto agregado exitosamente")
      document.getElementById("productoForm").reset()
       obtenerProductos() // Actualizamos la lista de productos
      mostrarSeccion("productos") // Volvemos a la sección de productos
    } else {
      alert(data.message || "Error al agregar producto")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error al agregar el producto")
  }
}

async function obtenerUsuarios() {
  try {
    const response = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=usuario");

    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Usuarios recibidos:", data);

    // Si querés mostrarlos en una tabla o lista, podés hacerlo así:
    const contenedor = document.getElementById("lista-usuarios");
    if (contenedor) {
      contenedor.innerHTML = "";
      data.forEach(usuario => {
        const item = document.createElement("li");
        item.textContent = `ID: ${usuario.id_usuario} | Nombre: ${usuario.nombre} | Email: ${usuario.email} | Rol: ${usuario.rol}`;
        contenedor.appendChild(item);
      });
    }

  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}
  function mostrarSeccion(seccion) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(seccion).classList.add("active")
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", obtenerPedidos);
document.addEventListener("DOMContentLoaded", obtenerProductos);
document.addEventListener("DOMContentLoaded", obtenerUsuarios);
