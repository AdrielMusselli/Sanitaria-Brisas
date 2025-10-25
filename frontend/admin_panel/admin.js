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

  API_URL = "http://localhost/Sanitaria-brisas/backend/Api/api.php";

async function obtenerPedidos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=pedido");

    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

  const data = await response.json();
  console.log("Pedidos recibidos:", data);

  // Guardar globalmente para acceso desde verPedido
  window.pedidos = data;

  // Renderizar pedidos en la tabla del admin
  renderizarPedidos(data);

  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
}

function renderizarPedidos(data) {
  const tbody = document.querySelector("#tablaPedidos tbody");

  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay pedidos</td></tr>';
    return;
  }

  tbody.innerHTML = data
    .map(pedido => `
      <tr>
        <td>${pedido.id_pedido}</td>
        <td>${pedido.id_usuario}</td>
        <td>${pedido.fecha || ''}</td>
        <td>${pedido.estado || ''}</td>
        <td>${pedido.direccion_envio || ''}</td>
        <td>$${pedido.precio_total ? Number.parseFloat(pedido.precio_total).toFixed(2) : '0.00'}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verPedido(${pedido.id_pedido})">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');
}

// Función de ejemplo para ver detalles del pedido (puede ampliarse)
function verPedido(id) {
  // Buscar el pedido en la colección cargada
  const pedido = (window.pedidos || []).find(p => Number(p.id_pedido) === Number(id));
  if (!pedido) {
    alert('Pedido no encontrado');
    return;
  }

  // Rellenar modal con datos del pedido
  document.getElementById('modalPedidoId').textContent = pedido.id_pedido;
  document.getElementById('modalPedidoFecha').textContent = pedido.fecha || '';
  document.getElementById('modalPedidoEstado').textContent = pedido.estado || '';
  document.getElementById('modalPedidoPrecio').textContent = pedido.precio_total ? Number.parseFloat(pedido.precio_total).toFixed(2) : '0.00';
  document.getElementById('modalPedidoDireccion').textContent = pedido.direccion_envio || '';

  // Obtener información del usuario asociado al pedido
  const usuarioId = pedido.id_usuario;
  fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=usuario&id=${encodeURIComponent(usuarioId)}`)
    .then(resp => {
      if (!resp.ok) throw new Error('Error HTTP ' + resp.status);
      return resp.json();
    })
    .then(user => {
      // Rellenar datos del usuario en el modal
      document.getElementById('modalUsuarioNombre').textContent = user.nombre || '';
      document.getElementById('modalUsuarioEmail').textContent = user.email || '';
      document.getElementById('modalUsuarioTelefono').textContent = user.telefono || '';

      // Mostrar modal
      const modalEl = document.getElementById('pedidoModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    })
    .catch(err => {
      console.error('Error al obtener usuario:', err);
      alert('No se pudo obtener información del usuario');
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
    renderizarProductos(data);

  } catch (error) {
    console.error("Error al obtener los productos:", error);
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

    const data = await response.json()

    if (data.success) {
      alert("Producto agregado exitosamente")
      document.getElementById("productoForm").reset()
      obtenerProductos()
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
    // Enviar petición DELETE con la sección e id en la query string (el backend espera seccion por GET para DELETE)
    const response = await fetch(API_URL + `?seccion=producto&id=${id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (data.success) {
      alert("Producto eliminado exitosamente")
      obtenerProductos()
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
