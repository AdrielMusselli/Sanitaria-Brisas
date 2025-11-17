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

  API_URL = "http://localhost/Sanitaria-Brisas/backend/Api/api.php";

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

async function obtenerResenas() {
  try {
    const response = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=resena", {
      method: "GET",
      });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Reseñas recibidas:", data);

    renderizarResenas(data);

  } catch (error) {
    console.error("Error al obtener las reseñas:", error);
  }
}

function renderizarResenas(data) {
  const tbody = document.querySelector("#tablaResenas tbody");

  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay reseñas</td></tr>';
    return;
  }

  tbody.innerHTML = data
    .map(res => `
      <tr>
        <td>${res.id_reseña}</td>
        <td>${res.id_producto}</td>
        <td>${res.id_usuario}</td>
        <td>${res.puntuacion || "-"}</td>
        <td>${res.comentario || ""}</td>
        <td>${res.fecha || ""}</td>
      </tr>
    `)
    .join("");
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
  <button class="btn btn-sm btn-info me-1" onclick="verPedido(${pedido.id_pedido})">
    <i class="fas fa-eye"></i>
  </button>

  <button class="btn btn-sm btn-warning" onclick="abrirModalEstado(${pedido.id_pedido}, '${pedido.estado}')">
    <i class="fas fa-edit"></i>
  </button>

  <button class="btn btn-sm btn-danger ms-1" onclick="eliminarPedido(${pedido.id_pedido})">
    <i class="fas fa-trash"></i>
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
    })
    .catch(err => {
      console.error('Error al obtener usuario:', err);
      alert('No se pudo obtener información del usuario');
    });

  // Obtener los productos del pedido
fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=detallepedido&id_pedido=${encodeURIComponent(id)}`)
  .then(resp => {
    if (!resp.ok) throw new Error('Error HTTP ' + resp.status);
    return resp.json();
  })
  .then(data => {

    if (!data.success) {
      throw new Error("La API devolvió success = false");
    }

    const detalles = data.detalles; // ✅ ahora sí el array

    const productosContainer = document.getElementById('modalProductos');
    productosContainer.innerHTML = '';

    detalles.forEach(detalle => {
      const { id_producto, cantidad, precio_unitario } = detalle;

      // Obtener datos del producto
      fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto&id=${encodeURIComponent(id_producto)}`)
        .then(resp => resp.json())
        .then(producto => {

          // Si tu API devuelve un array, tomamos el primero
          const prod = Array.isArray(producto) ? producto[0] : producto;

          const nombre = prod.nombre || "Producto desconocido";

          const productoHtml = `
            <div class="producto">
              <strong>${nombre}</strong><br>
              Precio Unitario: $${parseFloat(precio_unitario).toFixed(2)}<br>
              Cantidad: ${cantidad}<br>
              Total: $${(precio_unitario * cantidad).toFixed(2)}
            </div>
            <hr>
          `;
          productosContainer.innerHTML += productoHtml;
        })
        .catch(err => {
          console.error('Error al obtener producto:', err);
        });
    });
  })
  .catch(err => {
    console.error('Error al obtener detalles del pedido:', err);
    alert('No se pudieron obtener los detalles del pedido');
  });

  // Mostrar el modal
  const modalEl = document.getElementById('pedidoModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}


async function obtenerProductos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto");

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
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos</td></tr>'
    return
  }

  tbody.innerHTML = data
    .map((producto) => {
      // Construir src absoluto para la imagen devuelta por el backend.
      // El backend guarda rutas como 'assets/filename.jpg' (ruta relativa al directorio backend/).
      // Si la ruta ya es absoluta (http) o es un placeholder, usarla tal cual.
      let imgSrc = producto.imagenes || 'https://via.placeholder.com/50x50?text=?';
      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
        // Prepend the backend base URL para que el navegador no busque en admin_panel/
        imgSrc = `http://localhost/Sanitaria-Brisas/backend/${imgSrc}`;
      }

      return `
        <tr>
          <td>${producto.id_producto}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${imgSrc}" 
                   alt="${producto.nombre}" 
                   class="me-2" 
                   style="width: 50px; height: 50px; object-fit: cover;"
                   onerror="this.src='https://via.placeholder.com/50x50?text=?'">
              ${producto.nombre}
            </div>
          </td>
          <td>${producto.categoria}</td>
          <td>$${Number.parseFloat(producto.precio).toFixed(2)}</td>
          <td>${producto.descripcion || ''}</td>
          <td>${producto.stock || '0'}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id_producto})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
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
  // Agregar imagen si existe (se enviará más abajo junto al resto del formulario)
  const imgFile = document.getElementById("imagenes").files[0];
  if (imgFile) formData.append("imagenes", imgFile);
  
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

async function eliminarPedido(id) {
    if (!confirm("¿Estás seguro de eliminar este pedido?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=pedido&id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data.success) {
            alert("Pedido eliminado correctamente");
            obtenerPedidos(); // Recarga la tabla
        } else {
            alert("Error al eliminar el pedido: " + (data.message || "Error desconocido"));
        }

    } catch (error) {
        console.error("Error eliminando pedido:", error);
        alert("Ocurrió un error al eliminar el pedido.");
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

function abrirModalEstado(id, estadoActual) {
  document.getElementById("estadoPedidoId").value = id;
  document.getElementById("nuevoEstado").value = estadoActual;

  const modal = new bootstrap.Modal(document.getElementById("modalEstado"));
  modal.show();
}

async function guardarEstado() {
  const id = document.getElementById("estadoPedidoId").value;
  const estado = document.getElementById("nuevoEstado").value;

  const formData = new FormData();
  formData.append("seccion", "pedido_estado");
  formData.append("id_pedido", id);
  formData.append("estado", estado);

  try {
    const response = await fetch(API_URL + "?seccion=pedido_estado", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!data.success) {
      alert("Error: " + data.message);
      return;
    }

    alert("Estado actualizado correctamente");

    // Actualizar la tabla
    obtenerPedidos();

    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById("modalEstado")).hide();

  } catch (error) {
    console.error("Error al actualizar estado:", error);
    alert("Error al conectarse con el servidor");
  }
}


// Ejecutar al cargar la página
// Preview de imagen
document.getElementById('imagenes')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        this.value = '';
        return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        this.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('image-preview');
        const container = document.getElementById('preview-container');
        preview.src = e.target.result;
        container.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
});

function filtrarPedidos() {
  const estadoFiltro = document.getElementById("filtroEstado").value.trim().toLowerCase();
  const usuarioFiltro = document.getElementById("filtroUsuario").value.trim();

  if (!window.pedidos) return;

  const filtrados = window.pedidos.filter(p => {
    const coincideEstado =
      !estadoFiltro || (p.estado && p.estado.toLowerCase() === estadoFiltro);

    const coincideUsuario =
      !usuarioFiltro || Number(p.id_usuario) === Number(usuarioFiltro);

    return coincideEstado && coincideUsuario;
  });

  renderizarPedidos(filtrados);
}
function limpiarFiltros() {
  document.getElementById("filtroEstado").value = "";
  document.getElementById("filtroUsuario").value = "";
  renderizarPedidos(window.pedidos);
}

document.getElementById("filtroEstado").addEventListener("change", filtrarPedidos);
document.getElementById("filtroUsuario").addEventListener("input", filtrarPedidos);
document.addEventListener("DOMContentLoaded", obtenerPedidos);
document.addEventListener("DOMContentLoaded", obtenerProductos);
document.addEventListener("DOMContentLoaded", obtenerUsuarios);
document.addEventListener("DOMContentLoaded", obtenerResenas);
