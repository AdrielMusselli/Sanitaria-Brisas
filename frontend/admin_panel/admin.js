async function obtenerPedidos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=pedido");
    
    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pedidos recibidos:", data);

    // Si querés mostrarlos en una tabla o lista, podés hacerlo así:
    const contenedor = document.getElementById("lista-pedidos");
    if (contenedor) {
      contenedor.innerHTML = "";
      data.forEach(pedido => {
        const item = document.createElement("li");
        item.textContent = `ID: ${pedido.id_pedido} | Usuario: ${pedido.id_usuario} | Estado: ${pedido.estado}`;
        contenedor.appendChild(item);
      });
    }

  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
  }
}

async function obtenerProductos() {
  try {
    const response = await fetch("http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=producto");

    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos recibidos:", data);

    // Si querés mostrarlos en una tabla o lista, podés hacerlo así:
    const contenedor = document.getElementById("lista-productos");
    if (contenedor) {
      contenedor.innerHTML = "";
      data.forEach(producto => {
        const item = document.createElement("li");
        item.textContent = `ID: ${producto.id_producto} | Nombre: ${producto.nombre} | Categoria: ${producto.categoria} | Precio: ${producto.precio} | Stock: ${producto.stock}`;
        contenedor.appendChild(item);
      });
    }

  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

async function obtenerUsuarios() {
  try {
    const response = await fetch("http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=usuario");

    // Verificamos si la respuesta HTTP es válida
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Usuarios recibidos:", data);

    // Si querés mostrarlos en una tabla o lista, podés hacerlo así:
    const contenedor = document.getElementById("lista-usuarios");
    if (contenedor) {
      contenedor.innerHTML = "";
      data.forEach(usuario => {
        const item = document.createElement("li");
        item.textContent = `ID: ${usuario.id_usuario} | Nombre: ${usuario.nombre} | Email: ${usuario.email} | Rol: ${usuario.rol}`;
        contenedor.appendChild(item);
      });
    }

  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}
  

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", obtenerPedidos);
document.addEventListener("DOMContentLoaded", obtenerProductos);
document.addEventListener("DOMContentLoaded", obtenerUsuarios);
