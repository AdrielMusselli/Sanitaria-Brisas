    // función genérica para armar tablas
function renderTable(data, tableId) {
  const table = document.getElementById(tableId);
  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td>No hay datos</td></tr>";
    return;
  }

  // cabeceras dinámicas
  const headers = Object.keys(data[0]);
  let html = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

  // filas
  data.forEach(row => {
    html += "<tr>" + headers.map(h => `<td>${row[h]}</td>`).join("") + "</tr>";
  });

  table.innerHTML = html;
}

function cambiarFormulario(valor) {
  const label1 = document.getElementById("label1");
  const label2 = document.getElementById("label2");
  const label3 = document.getElementById("label3");
  const label4 = document.getElementById("label4");
  const label5 = document.getElementById("label5");

  const campo1 = document.getElementById("campo1");
  const campo2 = document.getElementById("campo2");
  const campo3 = document.getElementById("campo3");
  const campo4 = document.getElementById("campo4");
  const campo5 = document.getElementById("campo5");

  const boton = document.querySelector("#form-producto button");

  if (valor === "Producto") {
    label1.textContent = "Nombre:";
    label2.textContent = "Categoría:";
    label3.textContent = "Precio:";
    label4.textContent = "Stock:";

    campo1.type = "text";
    campo2.type = "text";
    campo3.type = "number";
    campo3.step = "0.01";
    campo4.type = "number";
    campo4.step = "1";
    campo5.style.display = "none"; 
    label5.style.display = "none";

    boton.setAttribute("onclick", "agregarProducto()");
  } 
  else if (valor === "Usuario") {
    label1.textContent = "Nombre:";
    label2.textContent = "Email:";
    label3.textContent = "Teléfono:";
    label4.textContent = "Contraseña:";

    campo1.type = "text";
    campo2.type = "email";
    campo3.type = "tel";
    campo4.type = "password";
    campo5.style.display = "none"; 
    label5.style.display = "none";

    boton.setAttribute("onclick", "agregarUsuario()");
  } 
  else if (valor === "Pedido") {
    label1.textContent = "ID Usuario:";
    label2.textContent = "Fecha:";
    label3.textContent = "Estado:";
    label4.textContent = "Dirección:";
    label5.textContent = "Monto:";

    campo1.type = "number";
    campo2.type = "date";
    campo3.type = "text";
    campo4.type = "text";
    campo5.type = "number";
    campo5.step = "0.01";

    campo5.style.display = "inline";
    label5.style.display = "inline";

    boton.setAttribute("onclick", "agregarPedido()");
  }
}


    // inicializar formulario como Producto por defecto
    cambiarFormulario("Producto");


// función para pedir datos a la API
async function fetchData(seccion, tableId) {
  try {
    const response = await fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=${seccion}`);
    const data = await response.json();
    renderTable(data, tableId);
  } catch (error) {
    console.error("Error cargando", seccion, error);
  }
}

async function agregarUsuario() {
  const data = {
    id: document.getElementById("campo1").value,
    nombre: document.getElementById("campo2").value,
    email: document.getElementById("campo3").value,
    telefono: document.getElementById("campo4").value,
    contraseña: document.getElementById("campo5").value
  };

  try {
    const response = await fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=usuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log("Usuario agregado:", result);
    fetchData("usuario", "tabla-usuarios"); // refresca tabla
  } catch (error) {
    console.error("Error agregando usuario:", error);
  }
}

// Función para agregar un producto
async function agregarProducto() {
  const data = {
    id: document.getElementById("campo1").value,
    nombre: document.getElementById("campo2").value,
    categoria: document.getElementById("campo3").value,
    precio: document.getElementById("campo4").value,
    stock: document.getElementById("campo5").value
  };

  try {
    const response = await fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=producto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log("Producto agregado:", result);
    fetchData("producto", "tabla-productos"); // refresca tabla
  } catch (error) {
    console.error("Error agregando producto:", error);
  }
}

// Función para agregar un pedido
async function agregarPedido() {
  const data = {
    id_pedido: document.getElementById("campo1").value,
    id_usuario: document.getElementById("campo2").value,
    fecha: document.getElementById("campo3").value,
    estado: document.getElementById("campo4").value,
    direccion: document.getElementById("campo5").value,
    monto: document.getElementById("campo6").value
  };

  try {
    const response = await fetch(`http://localhost/Sanitaria-Brisas/backend/Api/api.php?seccion=pedido`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log("Pedido agregado:", result);
    fetchData("pedido", "tabla-pedidos"); // refresca tabla
  } catch (error) {
    console.error("Error agregando pedido:", error);
  }
}

// cargar todo al inicio
fetchData("usuario", "tabla-usuarios");
fetchData("producto", "tabla-productos");
fetchData("pedido", "tabla-pedidos");
