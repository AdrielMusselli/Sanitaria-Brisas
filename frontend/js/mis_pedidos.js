// ===============================
// 📦 mis_pedidos.js
// ===============================

// ⚙️ Obtener ID del usuario logueado (puede venir del localStorage, sessionStorage o JWT)
const usuarioId = localStorage.getItem("usuario_id") || 1; // 🔧 Cambia esto si lo guardas en otro lugar

// 🔗 URL de la API
const API_URL = "http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=pedido";

// ===============================
// 🔄 Obtener pedidos del backend
// ===============================
async function obtenerPedidosUsuario() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    console.log("📦 Todos los pedidos:", data);

    // Filtrar solo los pedidos del usuario logueado
    const pedidosUsuario = data.filter(p => p.id_usuario == usuarioId);
    console.log(`📋 Pedidos del usuario ${usuarioId}:`, pedidosUsuario);

    // Renderizar las pestañas
    renderizarPedidosPorEstado(pedidosUsuario);

  } catch (error) {
    console.error("❌ Error al obtener los pedidos:", error);
  }
}

// ===============================
// 🧩 Renderizar pedidos según estado
// ===============================
function renderizarPedidosPorEstado(pedidos) {
  // Limpiar cada contenedor de pestaña
  document.getElementById("all").innerHTML = "";
  document.getElementById("processing").innerHTML = "";
  document.getElementById("shipped").innerHTML = "";
  document.getElementById("delivered").innerHTML = "";
  document.getElementById("cancelled").innerHTML = "";

  pedidos.forEach(pedido => {
    const card = crearTarjetaPedido(pedido);

    // Agregar a "Todos"
    document.getElementById("all").appendChild(card.cloneNode(true));

    // Agregar según estado
    switch (pedido.estado.toLowerCase()) {
      case "en proceso":
        document.getElementById("processing").appendChild(card);
        break;
      case "enviado":
      case "en tránsito":
        document.getElementById("shipped").appendChild(card);
        break;
      case "entregado":
        document.getElementById("delivered").appendChild(card);
        break;
      case "cancelado":
        document.getElementById("cancelled").appendChild(card);
        break;
      default:
        // Si el estado no coincide con ninguno, queda solo en "Todos"
        break;
    }
  });

  // Si no hay pedidos en alguna pestaña
  ["all","processing","shipped","delivered","cancelled"].forEach(tabId => {
    if (!document.getElementById(tabId).hasChildNodes()) {
      document.getElementById(tabId).innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="fas fa-box-open fa-2x mb-3"></i>
          <p>No hay pedidos en esta categoría.</p>
        </div>
      `;
    }
  });
}

// ===============================
// 🧱 Crear HTML dinámico de cada pedido
// ===============================
function crearTarjetaPedido(pedido) {
  const div = document.createElement("div");
  div.classList.add("order-card", "mb-4");

  div.innerHTML = `
    <div class="order-header d-flex justify-content-between align-items-center flex-wrap">
      <div>
        <div class="order-number">Pedido #${pedido.codigo || pedido.id}</div>
        <div class="order-date">
          <i class="fas fa-calendar-alt me-1"></i>${pedido.fecha || "Sin fecha"}
        </div>
      </div>
      <div>
        <span class="status-badge ${getBadgeClass(pedido.estado)}">
          <i class="${getBadgeIcon(pedido.estado)}"></i>${pedido.estado}
        </span>
      </div>
    </div>

    <div class="order-body">
      <div class="row">
        <div class="col-lg-8">
          <h6 class="mb-3"><i class="fas fa-box-open me-2"></i>Productos</h6>
          ${pedido.productos ? renderizarProductos(pedido.productos) : "<p class='text-muted'>No hay productos asociados.</p>"}
        </div>

        <div class="col-lg-4">
          <div class="order-summary">
            <h6 class="mb-3"><i class="fas fa-receipt me-2"></i>Resumen</h6>
            <div class="d-flex justify-content-between mb-2">
              <span>Total:</span>
              <strong class="total-price">$${pedido.total || "0.00"}</strong>
            </div>
            <small class="text-muted">
              <i class="fas fa-map-marker-alt me-1"></i>
              <strong>Dirección:</strong><br>
              ${pedido.direccion_envio || "No especificada"}
            </small>
          </div>
        </div>
      </div>
    </div>
  `;

  return div;
}

// ===============================
// 🎨 Helpers visuales
// ===============================
function getBadgeClass(estado) {
  switch (estado.toLowerCase()) {
    case "en proceso": return "status-processing";
    case "enviado":
    case "en tránsito": return "status-shipped";
    case "entregado": return "status-delivered";
    case "cancelado": return "status-cancelled";
    default: return "status-default";
  }
}

function getBadgeIcon(estado) {
  switch (estado.toLowerCase()) {
    case "en proceso": return "fas fa-clock";
    case "enviado":
    case "en tránsito": return "fas fa-shipping-fast";
    case "entregado": return "fas fa-check-circle";
    case "cancelado": return "fas fa-times-circle";
    default: return "fas fa-box";
  }
}

// ===============================
// 🛒 Renderizar productos dentro del pedido
// ===============================
function renderizarProductos(productos) {
  try {
    const lista = JSON.parse(productos); // Por si viene como JSON string
    return lista.map(p => `
      <div class="product-item">
        <img src="${p.imagen || '/placeholder.svg?height=70&width=70'}" class="product-image-small" alt="${p.nombre}">
        <div class="flex-grow-1">
          <h6 class="mb-1">${p.nombre}</h6>
          <p class="text-muted mb-0 small">Cantidad: ${p.cantidad}</p>
        </div>
        <div class="price-text">$${p.precio}</div>
      </div>
    `).join("");
  } catch {
    return "<p class='text-muted'>Error al cargar los productos.</p>";
  }
}

// ===============================
// 🚀 Inicializar al cargar la página
// ===============================
document.addEventListener("DOMContentLoaded", obtenerPedidosUsuario);
