function getFavoritos() {
  try {
    const raw = localStorage.getItem('favoritos');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error leyendo favoritos desde localStorage', err);
    return {};
  }
}

function saveFavoritos(favoritos) {
  try {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  } catch (err) {
    console.error('Error guardando favoritos en localStorage', err);
  }
}

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

let filtroActual = 'todos';
let ordenActual = 'reciente';

function mostrarFavoritos(filtro = 'todos', orden = 'reciente') {
  const favoritos = getFavoritos();
  const contenedor = document.querySelector('.row.g-4');
  
  if (!contenedor) return;
  
  let favoritosArray = Object.values(favoritos);
  
   console.log('[v0] Productos favoritos cargados:', favoritosArray);
  favoritosArray.forEach(producto => {
    console.log(`[v0] Producto: ${producto.nombre}, Stock: ${producto.stock}, Categoria: ${producto.categoria}`);
  });
  
  if (filtro === 'stock') {
    favoritosArray = favoritosArray.filter(p => p.stock > 0);
    console.log('[v0] Filtro "En Stock" aplicado. Productos filtrados:', favoritosArray.length);
  } else if (filtro === 'oferta') {
    favoritosArray = favoritosArray.filter(p => p.categoria === 'ofertas');
    console.log('[v0] Filtro "En Oferta" aplicado. Productos filtrados:', favoritosArray.length);
  } else if (filtro === 'agotados') {
    favoritosArray = favoritosArray.filter(p => p.stock === 0);
    console.log('[v0] Filtro "Agotados" aplicado. Productos filtrados:', favoritosArray.length);
  }
  
  if (orden === 'precio-asc') {
    favoritosArray.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
  } else if (orden === 'precio-desc') {
    favoritosArray.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
  } else if (orden === 'nombre') {
    favoritosArray.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  
  if (favoritosArray.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-heart-broken" style="font-size: 64px; color: #ccc;"></i>
        <h3 class="mt-3 text-muted">No tienes productos en tu lista de deseos</h3>
        <p class="text-muted">Agrega productos desde la tienda</p>
        <a href="index.html" class="btn btn-primary mt-3">
          <i class="fas fa-shopping-bag me-2"></i>Ir a la tienda
        </a>
      </div>
    `;
    return;
  }
  
  contenedor.innerHTML = '';
  
  favoritosArray.forEach(producto => {
    const col = document.createElement('div');
    col.classList.add('col-md-6', 'col-lg-4');
    
    const descuento = producto.precioOriginal && producto.precioOriginal > producto.precio
      ? Math.round(((producto.precioOriginal - producto.precio) / producto.precioOriginal) * 100)
      : 0;
    
    let badges = '';
    if (producto.stock === 0) {
      badges = `<span class="stock-badge-out">Agotado</span>`;
    } else {
      badges = descuento > 0 
        ? `<span class="wishlist-badge">-${descuento}%</span>
           <span class="stock-badge">En Stock</span>`
        : `<span class="stock-badge">En Stock</span>`;
    }
    
    const precioHTML = descuento > 0
      ? `<span class="product-price">$${producto.precio}</span>
         <span class="product-old-price">$${producto.precioOriginal}</span>`
      : `<span class="product-price">$${producto.precio}</span>`;
    
    const imagen = producto.imagen || '../assets/pintura.jpeg';
    
    col.innerHTML = `
      <div class="wishlist-card" data-producto-id="${producto.id_producto}" style="cursor: pointer;">
       <a href="producto.html?id=${producto.id_producto}" style="text-decoration: none; color: inherit;">
      <div class="position-relative">
          ${badges}
          <img src="${imagen}" alt="${producto.nombre}" class="wishlist-card-img">
        </div>
        <div class="wishlist-card-body">
          <h5 class="product-title">${producto.nombre}</h5>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
            <span class="rating-count">(4.5)</span>
          </div>
          <div class="mb-3">
            ${precioHTML}
          </div>
          <button class="btn-add-cart" data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart me-2"></i>${producto.stock === 0 ? 'No Disponible' : 'Agregar al Carrito'}
          </button>
          <button class="btn-remove" data-id="${producto.id}">
            <i class="fas fa-trash me-2"></i>Eliminar
          </button>
        </div>
      </div>
    </a>
    `;
    
    contenedor.appendChild(col);
  });
}

function removeFromWishlist(id) {
  const favoritos = getFavoritos();
  delete favoritos[id];
  saveFavoritos(favoritos);
  mostrarFavoritos(filtroActual, ordenActual);
}

function addToCart(id) {
  const favoritos = getFavoritos();
  const producto = favoritos[id];
  
  if (!producto) {
    console.warn('Producto no encontrado en favoritos');
    return;
  }
  
  try {
    const cart = getCart();
    const productId = String(producto.id);
    
    if (cart[productId]) {
      cart[productId].cantidad = Number(cart[productId].cantidad) + 1;
    } else {
      cart[productId] = {
        id: productId,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen,
        id_producto: producto.id_producto
      };
    }
    
    saveCart(cart);
    
    const btn = document.querySelector(`[data-id="${id}"].btn-add-cart`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Agregado';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    }
  } catch (err) {
    console.error('Error agregando al carrito:', err);
    alert('No se pudo agregar el producto al carrito');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarFavoritos();
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const texto = e.target.textContent.toLowerCase();
      if (texto.includes('todos')) {
        filtroActual = 'todos';
      } else if (texto.includes('stock')) {
        filtroActual = 'stock';
      } else if (texto.includes('oferta')) {
        filtroActual = 'oferta';
      } else if (texto.includes('agotados')) {
        filtroActual = 'agotados';
      }
      
      mostrarFavoritos(filtroActual, ordenActual);
    });
  });
  
  const sortSelect = document.querySelector('.form-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const value = e.target.selectedIndex;
      if (value === 0) {
        ordenActual = 'reciente';
      } else if (value === 1) {
        ordenActual = 'precio-asc';
      } else if (value === 2) {
        ordenActual = 'precio-desc';
      } else if (value === 3) {
        ordenActual = 'nombre';
      }
      
      mostrarFavoritos(filtroActual, ordenActual);
    });
  }
  
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.wishlist-card');
    if (card && !e.target.closest('button')) {
      const productoId = card.dataset.productoId;
      if (productoId) {
        window.location.href = `producto.html?id=${productoId}`;
        return;
      }
    }
    
    const btnRemove = e.target.closest('.btn-remove');
    if (btnRemove) {
      e.preventDefault();
      e.stopPropagation();
      const id = btnRemove.dataset.id;
      removeFromWishlist(id);
      return;
    }
    
    const btnAdd = e.target.closest('.btn-add-cart');
    if (btnAdd) {
      e.preventDefault();
      e.stopPropagation();
      const id = btnAdd.dataset.id;
      addToCart(id);
      return;
    }
  });
});
