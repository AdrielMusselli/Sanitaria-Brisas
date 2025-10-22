document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch('../../backend/Api/api.php', {
        method: 'POST',
        body: formData,
        credentials: 'include' // 🔑 para enviar/recibir cookies de sesión
      });

      if (!res.ok) throw new Error("Error de red");

      const data = await res.json();

      if (data.success) {
        window.location.href = "index.html"; // o tu página protegida
      } else {
        alert(data.message || "Credenciales incorrectas");
      }

    } catch (err) {
      console.error("Error:", err);
    }
  });
});