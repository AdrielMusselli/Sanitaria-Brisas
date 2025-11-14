function selectPayment(element) {
    // Remove active class from all payment methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    // Add active class to selected method
    element.classList.add('active');
    
    // Check the radio button
    const radio = element.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
    }
    
    // Show/hide card form
    const cardForm = document.getElementById('cardForm');
    if (element.querySelector('.fa-credit-card')) {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

// Format card number input
document.querySelector('input[placeholder="1234 5678 9012 3456"]')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Format expiration date
document.querySelector('input[placeholder="MM/AA"]')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
});

function renderOrderSummary() {
  const contenedorProductos = document.getElementById("order-products");
  const subtotalElem = document.getElementById("subtotal");
  const envioElem = document.getElementById("envio");
  const impuestosElem = document.getElementById("impuestos");
  const totalElem = document.getElementById("total");

  if (!contenedorProductos) return;

  // Leer carrito del localStorage
  let cart = {};
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || {};
  } catch (err) {
    console.error("Error leyendo carrito:", err);
    cart = {};
  }

  const productos = Object.values(cart);
  contenedorProductos.innerHTML = "";

  if (productos.length === 0) {
    contenedorProductos.innerHTML = `<p class="text-muted text-center">Tu carrito está vacío.</p>`;
    subtotalElem.textContent = "$0.00";
    envioElem.textContent = "$0.00";
    impuestosElem.textContent = "$0.00";
    totalElem.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  productos.forEach(prod => {
    const cantidad = Number(prod.cantidad) || 1;
    const precio = Number(prod.precio) || 0;
    const subtotalItem = cantidad * precio;
    subtotal += subtotalItem;

    const imageSrc = prod.imagen && prod.imagen.trim() ? prod.imagen : '';
    const imageHtml = imageSrc ? `
      <img src="${imageSrc}" alt="${prod.nombre}" class="product-mini-img" onerror="this.style.display='none';">
      <div style="display:none; width:80px; height:60px; background:#f0f0f0; border-radius:4px;"></div>
    ` : '<div style="width:80px; height:60px; background:#f0f0f0; border-radius:4px;"></div>';

    const itemHTML = `
      <div class="product-mini">
        ${imageHtml}
        <div class="product-mini-info">
          <div class="product-mini-name">${prod.nombre}</div>
          <div class="product-mini-qty">Cantidad: ${cantidad}</div>
        </div>
        <div class="product-mini-price">$${subtotalItem.toFixed(2)}</div>
      </div>
    `;
    contenedorProductos.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Calcular totales
  const envio = 15.00;
  const impuestos = subtotal * 0.08;
  const total = subtotal + envio + impuestos;

  // Mostrar precios
  subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  envioElem.textContent = `$${envio.toFixed(2)}`;
  impuestosElem.textContent = `$${impuestos.toFixed(2)}`;
  totalElem.textContent = `$${total.toFixed(2)}`;
}
