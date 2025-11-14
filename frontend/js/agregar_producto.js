document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productoForm');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const precio = document.getElementById('precio').value;
            const categoria = document.getElementById('categoria').value;
            const stock = document.getElementById('stock').value;

            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('precio', precio);
            formData.append('categoria', categoria);
            formData.append('stock', stock);
            formData.append('accion', 'producto');
            
            // Agregar archivo de imagen si existe
            const imagenInput = document.getElementById('imagenes');
            if (imagenInput && imagenInput.files.length > 0) {
                formData.append('imagenes', imagenInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost/Sanitaria-Brisas/backend/Api/api.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert('Producto agregado correctamente');
                    form.reset();
                } else {
                   console.error(result); // para inspección
                alert('Error al agregar el producto: ' + result.message);
                }
            } catch (error) {
                alert('Error de conexión con el servidor');
            }
        });
    }
});
