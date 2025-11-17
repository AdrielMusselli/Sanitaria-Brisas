function selectPayment(element) {
  document.querySelectorAll('.payment-method').forEach(method => {
    method.classList.remove('active');
  });
  element.classList.add('active');
  
  const radio = element.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;

  const cardForm = document.getElementById('cardForm');
  cardForm.style.display = element.querySelector('.fa-credit-card') ? 'block' : 'none';
}

// Formato número de tarjeta
document.querySelector('input[placeholder="1234 5678 9012 3456"]')?.addEventListener('input', e => {
  let value = e.target.value.replace(/\s/g, '');
  e.target.value = value.match(/.{1,4}/g)?.join(' ') || value;
});

// Formato MM/AA
document.querySelector('input[placeholder="MM/AA"]')?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
  e.target.value = v;
});

document.addEventListener("DOMContentLoaded", renderOrderSummary);

function renderOrderSummary() {
  const contenedor = document.getElementById("order-products");
  if (!contenedor) return;

  const subtotalElem = document.getElementById("subtotal");
  const envioElem = document.getElementById("envio");
  const impuestosElem = document.getElementById("impuestos");
  const totalElem = document.getElementById("total");

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem("cart")) || {}; } catch { cart = {}; }

  const productos = Object.values(cart);
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    contenedor.innerHTML = `<p class="text-muted text-center">Tu carrito está vacío.</p>`;
    subtotalElem.textContent = envioElem.textContent = impuestosElem.textContent = totalElem.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  productos.forEach(prod => {
    const cantidad = Number(prod.cantidad) || 1;
    const precio = Number(prod.precio) || 0;
    const subtotalItem = cantidad * precio;
    subtotal += subtotalItem;

    contenedor.insertAdjacentHTML("beforeend", `
      <div class="product-mini">
        <img src="${prod.imagen || ''}" alt="${prod.nombre}" class="product-mini-img" onerror="this.style.display='none';">
        <div class="product-mini-info">
          <div class="product-mini-name">${prod.nombre}</div>
          <div class="product-mini-qty">Cantidad: ${cantidad}</div>
        </div>
        <div class="product-mini-price">$${subtotalItem.toFixed(2)}</div>
      </div>
    `);
  });

  const envio = 15.00;
  const impuestos = subtotal * 0.08;
  const total = subtotal + envio + impuestos;

  subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  envioElem.textContent = `$${envio.toFixed(2)}`;
  impuestosElem.textContent = `$${impuestos.toFixed(2)}`;
  totalElem.textContent = `$${total.toFixed(2)}`;
}

function getProductosDelPedido() {
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem("cart")) || {}; } catch { cart = {}; }

  return Object.values(cart).map(p => ({
    id_producto: p.id,
    cantidad: Number(p.cantidad) || 1,
    precio_unitario: Number(p.precio) || 0
  }));
}

async function enviarPedido(e) {
  e.preventDefault();

  const nombre = document.querySelector('input[name="nombre"]').value.trim();
  const apellido = document.querySelector('input[name="apellido"]').value.trim();
  const direccion = document.querySelector('input[name="direccion"]').value.trim();

  if (!nombre || !apellido || !direccion) {
    alert("Por favor completa todos los campos de envío.");
    return;
  }

  const productos = getProductosDelPedido();
  if (!productos.length) {
    alert("El carrito está vacío.");
    return;
  }

  const subtotal = productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);
  const envio = 15.00;
  const impuestos = subtotal * 0.08;
  const total = subtotal + envio + impuestos;
  const fechaEnvio = new Date().toISOString().slice(0, 19).replace("T", " ");

  const fd = new FormData();
  fd.append("id_usuario", 1);
  fd.append("estado", "Pendiente");
  fd.append("direccion_envio", `${nombre} ${apellido} - ${direccion}`);
  fd.append("precio_total", total.toFixed(2));
  fd.append("fecha", fechaEnvio);
  fd.append("productos", JSON.stringify(productos));

  try {
    const res = await fetch("http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=agregarpedido", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.success) {
      localStorage.removeItem("cart");
      mostrarModalExito();
    } else {
      alert(data.message || "Error al procesar el pedido.");
    }
  } catch (error) {
    alert("Error de conexión con el servidor.");
  }
}

function mostrarModalExito() {
  const html = `
    <div class="modal fade" id="successModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">¡Pedido realizado con éxito!</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <p>Tu pedido ha sido registrado correctamente.</p>
          </div>

          <div class="modal-footer">
            <button class="btn btn-success" id="closeSuccessModal" data-bs-dismiss="modal">
              Aceptar
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const modal = new bootstrap.Modal(document.getElementById("successModal"));
  modal.show();

  const redirigir = () => (window.location.href = "index.html");

  document.getElementById("closeSuccessModal").addEventListener("click", redirigir);
  document.getElementById("successModal").addEventListener("hidden.bs.modal", redirigir);
}

document.querySelector(".btn-primary-custom")?.addEventListener("click", enviarPedido);
