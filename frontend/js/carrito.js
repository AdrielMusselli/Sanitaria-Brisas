document.addEventListener("DOMContentLoaded", async () => {
    // Verificar si hay sesión activa
    const user = await checkSession();
    if (!user) {
        // Si no hay sesión, limpiar el carrito y redirigir al login
        localStorage.removeItem('cart');
        window.location.href = 'Login.html';
        return;
    }
    
    const container = document.getElementById('cart-items-container');
    renderCartItems();
});

function getCart() {
    try {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        console.error('Error leyendo carrito desde localStorage', err);
        return {};
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
        console.error('Error guardando carrito en localStorage', err);
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const cart = getCart();
    const items = Object.values(cart);

    if (items.length === 0) {
        container.innerHTML = `<div class="alert alert-info">Tu carrito está vacío. <a href="../paginas/index.html">Ver productos</a></div>`;
        updateTotal();
        return;
    }

    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item p-4 mb-3';
        div.dataset.id = item.id || item.id_producto;

        const imageSrc = item.imagen && item.imagen.trim() && item.imagen.includes('http') ? item.imagen : '';
        
        const imageHtml = imageSrc 
            ? `<img 
                src="${imageSrc}" 
                class="product-image img-fluid" 
                alt="${escapeHtml(item.nombre)}" 
                style="max-width: 100%; height: 120px; object-fit: cover; border-radius: 8px;"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >
            <div style="display:none; width:100%; height:120px; background:#f0f0f0; border-radius:8px; align-items:center; justify-content:center; border:1px solid #ddd;">
                <span class="text-muted small">Imagen no disponible</span>
            </div>`
            : '<div style="width:100%; height:120px; background:#f0f0f0; border-radius:8px; display:flex; align-items:center; justify-content:center; border:1px solid #ddd;"><span class="text-muted small">Sin imagen</span></div>';

        div.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2">
                    ${imageHtml}
                </div>
                <div class="col-md-4">
                    <h5 class="mb-1">${escapeHtml(item.nombre)}</h5>
                    <p class="text-muted mb-0">&nbsp;</p>
                </div>
                <div class="col-md-3">
                    <div class="quantity-controls d-flex align-items-center">
                        <button class="quantity-btn btn btn-light me-2" data-action="decrease" data-id="${item.id || item.id_producto}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input form-control text-center" value="${item.cantidad}" id="qty-${item.id || item.id_producto}" style="width:70px;" readonly>
                        <button class="quantity-btn btn btn-light ms-2" data-action="increase" data-id="${item.id || item.id_producto}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="price-text">UYU $${Number(item.precio).toFixed(2)}</div>
                </div>
                <div class="col-md-1">
                    <button class="remove-btn btn btn-outline-danger" data-action="remove" data-id="${item.id || item.id_producto}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(div);
    });

    container.querySelectorAll('[data-action="increase"]').forEach(btn => btn.addEventListener('click', onIncrease));
    container.querySelectorAll('[data-action="decrease"]').forEach(btn => btn.addEventListener('click', onDecrease));
    container.querySelectorAll('[data-action="remove"]').forEach(btn => btn.addEventListener('click', onRemove));

    updateTotal();
}

function onIncrease(e) {
    const id = e.currentTarget.dataset.id;
    const cart = getCart();
    if (!cart[id]) return;
    cart[id].cantidad = Number(cart[id].cantidad) + 1;
    saveCart(cart);
    // Update input value
    const input = document.getElementById(`qty-${id}`);
    if (input) input.value = cart[id].cantidad;
    updateTotal();
}

function onDecrease(e) {
    const id = e.currentTarget.dataset.id;
    const cart = getCart();
    if (!cart[id]) return;
    if (Number(cart[id].cantidad) > 1) {
        cart[id].cantidad = Number(cart[id].cantidad) - 1;
        saveCart(cart);
        const input = document.getElementById(`qty-${id}`);
        if (input) input.value = cart[id].cantidad;
        updateTotal();
    }
}

function onRemove(e) {
    const id = e.currentTarget.dataset.id;
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    const cart = getCart();
    if (cart[id]) delete cart[id];
    saveCart(cart);
    // Re-render
    renderCartItems();
    // Update cart badge in navbar if present
    if (typeof updateCartCount === 'function') updateCartCount();
}

function updateTotal() {
    const cart = getCart();
    const items = Object.values(cart);

    let subtotal = 0;
    items.forEach(i => subtotal += Number(i.precio) * Number(i.cantidad || 0));

    const envio = 400; // fijo
    const impuestos = subtotal * 0.21; // 21%

    const subtotalElem = document.querySelector('.summary-card .price-text:nth-of-type(1)');
    const envioElem = document.querySelector('.summary-card .price-text:nth-of-type(2)');
    const impuestosElem = document.querySelector('.summary-card .price-text:nth-of-type(3)');
    const totalElem = document.querySelector('.summary-card .total-price');

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    if (envioElem) envioElem.textContent = `$${envio.toFixed(2)}`;
    if (impuestosElem) impuestosElem.textContent = `$${impuestos.toFixed(2)}`;
    if (totalElem) totalElem.textContent = `$${(subtotal + envio + impuestos).toFixed(2)}`;
}



// Simple escape para evitar inyección en nombres
function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, function (s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-proceder-pago");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
        e.preventDefault();

        const cart = getCart();
        const items = Object.values(cart);

        if (items.length === 0) {
            alert("Debes tener al menos un producto en el carrito para proceder al pago.");
            return;
        }

        window.location.href = "checkout.html";
    });
});


