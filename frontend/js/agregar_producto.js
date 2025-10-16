document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productoForm');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Obtén los valores de los campos por ID
            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const precio = document.getElementById('precio').value;
            const stock = document.getElementById('categoria').value;
            const categoria = document.getElementById('stock').value;

            // Crea el objeto con los datos
            const datos = {
                nombre,
                descripcion,
                precio,
                categoria,
                stock
            };

            try {
                const response = await fetch('../backend/Models/Producto.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
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