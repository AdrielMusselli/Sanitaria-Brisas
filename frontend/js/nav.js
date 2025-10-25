// Función para verificar si hay sesión activa
// Devuelve el objeto `user` si hay sesión, o null si no
async function checkSession() {
    try {
        const response = await fetch('http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=login', {
            credentials: 'include' // importante para enviar/recibir cookies
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        return (data && data.success && data.user) ? data.user : null;
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

// Función para actualizar el menú de usuario según el estado de la sesión
async function updateUserMenu() {
    const user = await checkSession();
    const userDropdown = document.querySelector('.navbar-nav .nav-item.dropdown:last-child .dropdown-menu');
    const profileToggleSpan = document.querySelector('.navbar-nav .nav-item.dropdown:last-child .nav-link .d-none.d-lg-inline');

    if (!userDropdown) return;

    if (user) {
        // Mostrar nombre del usuario en el trigger (si existe)
        if (profileToggleSpan) {
            profileToggleSpan.textContent = user.nombre || user.name || user.email || '';
            profileToggleSpan.classList.remove('d-none');
        }

        // Menú para usuarios logueados
        userDropdown.innerHTML = `
            <li><a class="dropdown-item" href="../paginas/pedido.html"><i class="fas fa-box me-2"></i>Mis Pedidos</a></li>
            <li><a class="dropdown-item" href="../paginas/listadeseos.html"><i class="fas fa-heart me-2"></i>Lista de Deseos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" id="logout-link"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
        `;

        // Añadir listener para cerrar sesión
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) logoutLink.addEventListener('click', cerrarSesion);
    } else {
        // Ocultar nombre si no hay sesión
        if (profileToggleSpan) {
            profileToggleSpan.textContent = '';
            profileToggleSpan.classList.add('d-none');
        }

        // Menú para usuarios no logueados
        userDropdown.innerHTML = `
            <li><a class="dropdown-item" href="../paginas/Login.html"><i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</a></li>
            <li><a class="dropdown-item" href="../paginas/registrarse.html"><i class="fas fa-user-plus me-2"></i>Registrarse</a></li>
        `;
    }
}

// Función para cerrar sesión
async function cerrarSesion(event) {
    event.preventDefault();
    try {
        const response = await fetch('http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=logout', {
            method: 'POST',
            credentials: 'include'
        });
        
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
        // Limpiar el carrito
        localStorage.removeItem('cart');
    
        // Actualizar menú y redirigir
        await updateUserMenu();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error closing session:', error);
        alert('Error al cerrar sesión');
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', updateUserMenu);