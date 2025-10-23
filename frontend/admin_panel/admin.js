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

  API_URL = "http://localhost/Sanitaria-brisas-3/backend/Api/api.php";

async function obtenerPedidos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-brisas-3/backend/Api/api.php?seccion=pedido");
    
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
    const response = await fetch("http://localhost/Sanitaria-brisas-3/backend/Api/api.php?seccion=producto");

    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos recibidos:", data);
    renderizarProductos(data);

  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}
function renderizarProductos(data) {
  const tbody = document.querySelector("#tablaProductos tbody")

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos</td></tr>'
    return
  }

  tbody.innerHTML = data
    .map(
      (producto) => `
        <tr>
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td>$${Number.parseFloat(producto.precio).toFixed(2)}</td>
          <td>${producto.descripcion}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `,
    )
    .join("")
}
async function agregarProducto(e) {
  e.preventDefault()

  const formData = new FormData()
  formData.append("action", "agregarProducto")
  formData.append("nombre", document.getElementById("nombre").value)
  formData.append("precio", document.getElementById("precio").value)
  formData.append("categoria", document.getElementById("categoria").value)
  formData.append("descripcion", document.getElementById("descripcion").value)

  const imagenFile = document.getElementById("imagen").files[0]
  if (imagenFile) {
    formData.append("imagen", imagenFile)
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      alert("Producto agregado exitosamente")
      document.getElementById("productoForm").reset()
      cargarProductos()
      mostrarSeccion("productos")
    } else {
      alert(data.message || "Error al agregar producto")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error de conexión con el servidor")
  }
}

async function eliminarProducto(id) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) {
    return
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=eliminarProducto&id=${id}`,
    })

    const data = await response.json()

    if (data.success) {
      alert("Producto eliminado exitosamente")
      cargarProductos()
    } else {
      alert(data.message || "Error al eliminar producto")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error de conexión con el servidor")
  }
}

async function obtenerUsuarios() {
  try {
    const response = await fetch("http://localhost/Sanitaria-brisas-3/backend/Api/api.php?seccion=usuario");

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
