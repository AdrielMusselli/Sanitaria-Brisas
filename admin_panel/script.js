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

// función para pedir datos a la API
async function fetchData(seccion, tableId) {
  try {
    const response = await fetch(`http://localhost/Sanitaria-brisas/backend/Api/api.php?seccion=${seccion}`);
    const data = await response.json();
    renderTable(data, tableId);
  } catch (error) {
    console.error("Error cargando", seccion, error);
  }
}

// cargar todo al inicio
fetchData("usuario", "tabla-usuarios");
fetchData("producto", "tabla-productos");
fetchData("pedido", "tabla-pedidos");