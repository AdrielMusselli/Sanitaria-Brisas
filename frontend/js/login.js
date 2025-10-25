document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si ya hay sesión activa
  const isLoggedIn = await checkSession();
  if (isLoggedIn) {
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger d-none mt-3";
  form.appendChild(errorDiv);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Deshabilitar el botón de submit durante el proceso
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando sesión...';

    // Ocultar mensaje de error previo si existe
    errorDiv.classList.add("d-none");
    
    const formData = new FormData(form);

    try {
      const res = await fetch('http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=login', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) throw new Error("Error de red");

      const data = await res.json();

      if (data.success) {
        // Actualizar UI antes de redirigir
        await updateUserMenu();
        window.location.href = "index.html";
      } else {
        // Mostrar error en el div de error
        errorDiv.textContent = data.message || "Credenciales incorrectas";
        errorDiv.classList.remove("d-none");
      }

    } catch (err) {
      console.error("Error:", err);
      errorDiv.textContent = "Error al conectar con el servidor. Por favor, intente nuevamente.";
      errorDiv.classList.remove("d-none");
    } finally {
      // Restaurar el botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});