// ===============================
// 📦 mis_pedidos.js
// ===============================
const API_BASE = "http://localhost/Sanitaria-Brisas/backend/Api/api.php";

// ⚙️ Obtener ID del usuario logueado dinámicamente
function getUsuarioId() {
    try {
        const userStorage = localStorage.getItem("user");
        if (!userStorage) return null;

        const user = JSON.parse(userStorage);

        // Ajusta "id_usuario" según cómo venga del login
        return user.id_usuario || user.id || null;
    } catch (err) {
        console.error("Error obteniendo usuario logueado:", err);
        return null;
    }
}

// ===============================
// 🔄 Obtener pedidos
// ===============================
async function obtenerPedidosUsuario() {
    try {
        const usuarioId = getUsuarioId();
        if (!usuarioId) {
            console.warn("No hay usuario logueado.");
            return;
        }

        const response = await fetch(`${API_BASE}?seccion=pedido`);
        const data = await response.json();
        if (!data || !Array.isArray(data)) return;

        // Filtrar solo los pedidos de este usuario
        const pedidosUsuario = data.filter(p => p.id_usuario == usuarioId);

        for (let pedido of pedidosUsuario) {
            pedido.detalles = await obtenerDetallesPedido(pedido.id_pedido);
        }

        renderizarPedidosPorEstado(pedidosUsuario);

    } catch (err) {
        console.error("Error cargando pedidos", err);
    }
}

// ===============================
// 🔄 Obtener detallepedido con info completa de producto
// ===============================
async function obtenerDetallesPedido(id_pedido) {
    try {
        const res = await fetch(`${API_BASE}?seccion=detallepedido&id_pedido=${id_pedido}`);
        const data = await res.json();
        if (!data.success) return [];

        const detalles = data.detalles;

        // Traer info completa de cada producto
        for (let d of detalles) {
            const producto = await obtenerProducto(d.id_producto);
            if (producto) {
                d.id_producto_real = producto.id_producto; // ID real del producto
                d.nombre_producto = producto.nombre || "Producto sin nombre";
                d.imagen_producto = producto.imagenes || "assets/no-image.png";
            } else {
                d.id_producto_real = d.id_producto; // fallback
                d.nombre_producto = "Producto sin nombre";
                d.imagen_producto = "assets/no-image.png";
            }
        }

        return detalles;

    } catch (e) {
        console.error("Error obteniendo detalles:", e);
        return [];
    }
}

// ===============================
// 🧩 Renderizar pedidos
// ===============================
function renderizarPedidosPorEstado(pedidos) {
    ["all","processing","shipped","delivered","cancelled"].forEach(tab => {
        document.getElementById(tab).innerHTML = "";
    });

    pedidos.forEach(pedido => {
        const card = crearTarjetaPedido(pedido);
        document.getElementById("all").appendChild(card.cloneNode(true));

        switch(pedido.estado.toLowerCase()) {
            case "en proceso": document.getElementById("processing").appendChild(card); break;
            case "enviado":
            case "en tránsito": document.getElementById("shipped").appendChild(card); break;
            case "entregado": document.getElementById("delivered").appendChild(card); break;
            case "cancelado": document.getElementById("cancelled").appendChild(card); break;
        }
    });

    ["all","processing","shipped","delivered","cancelled"].forEach(tab => {
        if (!document.getElementById(tab).hasChildNodes()) {
            document.getElementById(tab).innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-box-open fa-3x mb-3"></i>
                    <h5>No hay pedidos en esta categoría.</h5>
                </div>`;
        }
    });
}

// ===============================
// 🧱 Crear tarjeta de pedido
// ===============================
function crearTarjetaPedido(pedido) {
    const div = document.createElement("div");
    div.classList.add("order-card", "mb-4");

    div.innerHTML = `
        <div class="order-header d-flex justify-content-between align-items-center flex-wrap">
            <div>
                <div class="order-number">Pedido #${pedido.codigo || pedido.id_pedido}</div>
                <div class="order-date">
                    <i class="fas fa-calendar-alt me-1"></i>${pedido.fecha || "Sin fecha"}
                </div>
            </div>
            <span class="status-badge ${getBadgeClass(pedido.estado)}">
                <i class="${getBadgeIcon(pedido.estado)}"></i>${pedido.estado}
            </span>
        </div>

        <div class="order-body">
            <div class="row">
                <div class="col-lg-8">
                    <h6 class="mb-3"><i class="fas fa-box-open me-2"></i>Productos</h6>
                    ${renderizarProductos(pedido.detalles)}
                </div>

                <div class="col-lg-4">
                    <div class="order-summary">
                        <h6 class="mb-3"><i class="fas fa-receipt me-2"></i>Resumen</h6>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Total:</span>
                            <strong class="total-price">$${pedido.precio_total || "0.00"}</strong>
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>
                            <strong>Dirección:</strong><br>
                            ${pedido.direccion_envio || "No especificada"}
                        </small>
                    </div>

                    ${pedido.estado.toLowerCase() === "entregado" ? crearFormularioResena(pedido.detalles) : ""}
                </div>
            </div>
        </div>
    `;

    return div;
}
// ===============================
// 🧱 Crear formulario de reseña para productos entregados
// ===============================
function crearFormularioResena(detalles) {
    return detalles.map(d => `
        <div class="reseña-producto mt-3 p-2 border rounded">
            <h6>Reseña para: ${d.nombre_producto}</h6>
            
            <div class="star-rating mb-2" data-producto-id="${d.id_producto_real}">
                ${[...Array(5)].map((_, i) => `<i class="far fa-star" data-value="${i+1}"></i>`).join("")}
            </div>

            <textarea class="form-control mb-2 comentario" rows="2" placeholder="Escribe tu reseña..."></textarea>
            <button class="btn btn-sm btn-primary btn-enviar-reseña" data-producto-id="${d.id_producto_real}">Enviar Reseña</button>
        </div>
    `).join("");
}
// ===============================
// 🌟 Manejo de estrellas y envío de reseña
// ===============================
document.addEventListener("click", async (e) => {

    // 🌟 Interactividad de estrellas
    if (e.target.closest(".star-rating i")) {
        const star = e.target;
        const container = star.closest(".star-rating");
        const stars = container.querySelectorAll("i");
        const value = Number(star.dataset.value);

        stars.forEach((s, i) => {
            if (i < value) {
                s.classList.remove("far");
                s.classList.add("fas");
            } else {
                s.classList.remove("fas");
                s.classList.add("far");
            }
        });

        container.dataset.puntuacion = value;
    }

    // 📝 Enviar reseña
   if (e.target.classList.contains("btn-enviar-reseña")) {
    const btn = e.target;
    btn.disabled = true;

    const container = btn.closest(".reseña-producto");
    const productoId = container.querySelector(".star-rating").dataset.productoId;
    const comentario = container.querySelector(".comentario").value.trim();
    const puntuacion = parseInt(container.querySelector(".star-rating").dataset.puntuacion, 10);

    const user = JSON.parse(localStorage.getItem("user"));
    const usuarioId = user?.id_usuario || user?.id || null;

    if (!usuarioId) {
        alert("No hay usuario logueado");
        btn.disabled = false;
        return;
    }

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
        alert("Selecciona una puntuación entre 1 y 5 estrellas");
        btn.disabled = false;
        return;
    }

    try {
        const res = await fetch(`${API_BASE}?seccion=resena`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario: usuarioId,
                id_producto: productoId,
                comentario: comentario,
                puntuacion: puntuacion
            }),
        });

        const data = await res.json();

        if (data.success) {
            alert("¡Reseña enviada correctamente!");
            btn.textContent = "Enviado";
            container.querySelector(".comentario").disabled = true;
            btn.disabled = true;
        } else {
            alert("Error al enviar reseña: " + (data.message || "Intenta nuevamente"));
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Error enviando reseña:", err);
        alert("Error al conectar con el servidor.");
        btn.disabled = false;
    }
}
});

// ===============================
// 🛒 Renderizar productos
// ===============================
function renderizarProductos(detalles) {
    if (!detalles || detalles.length === 0) return "<p class='text-muted'>No hay productos asociados.</p>";

    return detalles.map(d => {
        const img = d.imagen_producto.startsWith("http") ? d.imagen_producto : `http://localhost/Sanitaria-Brisas/backend/${d.imagen_producto}`;
        return `
            <div class="product-item d-flex align-items-center mb-3">
                <img src="${img}" class="me-3 rounded" style="width:70px; height:70px; object-fit:cover;"">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${d.nombre_producto}</h6>
                    <p class="text-muted small mb-0">Cantidad: ${d.cantidad}</p>
                </div>
                <div class="price-text fw-bold">$${d.precio_unitario}</div>
            </div>`;
    }).join("");
}

// ===============================
// 🎨 Helpers
// ===============================
function getBadgeClass(estado) {
    switch(estado.toLowerCase()){
        case "en proceso": return "status-processing";
        case "enviado":
        case "en tránsito": return "status-shipped";
        case "entregado": return "status-delivered";
        case "cancelado": return "status-cancelled";
        default: return "status-default";
    }
}

function getBadgeIcon(estado) {
    switch(estado.toLowerCase()){
        case "en proceso": return "fas fa-clock";
        case "enviado":
        case "en tránsito": return "fas fa-shipping-fast";
        case "entregado": return "fas fa-check-circle";
        case "cancelado": return "fas fa-times-circle";
        default: return "fas fa-box";
    }
}

// ===============================
// 🔍 Obtener producto por ID
// ===============================
async function obtenerProducto(id) {
    try {
        const res = await fetch(`${API_BASE}?seccion=producto&id=${id}`);
        const data = await res.json();

        // data es un array de productos
        if (Array.isArray(data) && data.length > 0) {
            return data[0]; // devuelve el primer producto
        }
        return null;
    } catch (e) {
        console.error("Error obteniendo producto:", e);
        return null;
    }
}


// ===============================
// 🚀 Inicializar
// ===============================
document.addEventListener("DOMContentLoaded", obtenerPedidosUsuario);
