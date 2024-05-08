function actualizarFechaHora() {
    var fechaElemento = document.getElementById('fecha');
    var horaElemento = document.getElementById('hora');
    var fechaActual = moment().format('YYYY-MM-DD');
    var horaActual = moment().format('HH:mm');
    fechaElemento.textContent = fechaActual;
    horaElemento.textContent = horaActual;
}
setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();


let puntosDeRevision = [];

function buscarPunto() {
  const input = document.getElementById('selector');
  const textoBusqueda = input.value.toLowerCase();
  const selector = document.getElementById('selector');
  selector.innerHTML = '<option value="" selected>Selecciona un punto de revisión</option>'; // Limpiar opciones anteriores

  puntosDeRevision.forEach(punto => {
    const oficinaR = punto.oficinaR.toLowerCase();
    const nomPuntoRevision = punto.nomPuntoRevision.toLowerCase();
    if (oficinaR.includes(textoBusqueda) || nomPuntoRevision.includes(textoBusqueda)) {
      const option = document.createElement('option');
      option.text = punto.oficinaR + ' - ' + punto.nomPuntoRevision;
      option.value = puntosDeRevision.indexOf(punto); // Guardar el índice del punto en el array
      selector.add(option);
    }
  });
}

function mostrarDetalle() {
  const selector = document.getElementById('selector');
  const selectedIndex = selector.value;
  if (selectedIndex !== "") {
    const puntoSeleccionado = puntosDeRevision[selectedIndex];
    alert(`Nombre del Punto de Revisión: ${puntoSeleccionado.nomPuntoRevision}\nOficina: ${puntoSeleccionado.oficinaR}`);
  }
}

// Cargar los datos al cargar la página
fetch('https://ruie.dgcor.com/info/Fuerza', {method: 'GET', headers: {'User-Agent': 'insomnia/8.6.1'}})
  .then(response => response.json())
  .then(data => {
    puntosDeRevision = data;
    buscarPunto(); // Mostrar todos los puntos de revisión al cargar
  })
  .catch(err => console.error(err));