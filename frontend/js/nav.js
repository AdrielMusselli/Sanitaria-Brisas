// Función para verificar si hay sesión activa
async function checkSession() {
  try {
    const response = await fetch(
      'http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=login',
      { credentials: 'include' }
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data && data.success && data.user ? data.user : null;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
}

// Función para actualizar el menú de usuario
async function updateUserMenu() {
  const user = await checkSession();
  const userDropdown = document.querySelector('#userDropdown');
  const profileToggleSpan = document.querySelector(
    '#userDropdownContainer .nav-link .d-none.d-lg-inline'
  );

  if (!userDropdown) {
    console.error('No se encontró #userDropdown en el DOM');
    return;
  }

  if (user) {
    // Si hay usuario logueado
    if (profileToggleSpan) {
      profileToggleSpan.textContent =
        user.nombre || user.name || user.email || '';
      profileToggleSpan.classList.remove('d-none');
    }

    userDropdown.innerHTML = `
      <li><a class="dropdown-item" href="../paginas/pedido.html"><i class="fas fa-box me-2"></i>Mis Pedidos</a></li>
      <li><a class="dropdown-item" href="../paginas/listadeseos.html"><i class="fas fa-heart me-2"></i>Lista de Deseos</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#" id="logout-link"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
    `;

    document
      .getElementById('logout-link')
      ?.addEventListener('click', cerrarSesion);
  } else {
    // Si NO hay sesión
    if (profileToggleSpan) {
      profileToggleSpan.textContent = '';
      profileToggleSpan.classList.add('d-none');
    }

    userDropdown.innerHTML = `
      <li><a id="btnLogin" class="dropdown-item"><i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</a></li>
      <li><a id="btnRegistrarse" class="dropdown-item"><i class="fas fa-user-plus me-2"></i>Registrarse</a></li>
    `;
  }

  document.body.classList.add('nav-ready');
}

// Cerrar sesión
async function cerrarSesion(event) {
  event.preventDefault();
  try {
    const response = await fetch(
      'http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=logout',
      {
        method: 'POST',
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('Network response was not ok');
    await response.json();
    localStorage.removeItem('cart');
    await updateUserMenu();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error closing session:', error);
    alert('Error al cerrar sesión');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Esperar a que el navbar esté en el DOM
  const interval = setInterval(() => {
    if (document.querySelector('#userDropdown')) {
      updateUserMenu();
      clearInterval(interval);
    }
  }, 100);
});
