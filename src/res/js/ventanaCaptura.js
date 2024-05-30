

// function actualizarFechaHora() {
//     var fechaElemento = document.getElementById('fecha');
//     var horaElemento = document.getElementById('hora');
//     var fechaActual = moment().format('YYYY-MM-DD');
//     var horaActual = moment().format('HH:mm');
//     fechaElemento.textContent = fechaActual;
//     horaElemento.textContent = horaActual;
// }
// setInterval(actualizarFechaHora, 1000);
// actualizarFechaHora();


let puntosDeRevision = [];
let puntosInternacion = [];

function buscarPunto() {
  const input = document.getElementById('selector');
  const textoBusqueda = input.value.toLowerCase();
  const selector = document.getElementById('selector');
  selector.innerHTML = '<option value="" selected>Selecciona un punto de revisión</option>'; // Limpiar opciones anteriores
  
  const oficinaR = document.getElementById('oficinaR').value;
  // let ags = puntosDeRevision.filter(puntosDeRevision => puntosDeRevision.oficinaR == estado);
  console.log(oficinaR);

  puntosDeRevision = puntosDeRevision.filter(puntosDeRevision => puntosDeRevision.oficinaR == oficinaR);

  console.log(puntosDeRevision);
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

function buscarPuntoI() {
  const input = document.getElementById('selector');
  const textoBusqueda = input.value.toLowerCase();
  const selector = document.getElementById('selector');
  
  const oficinaR = document.getElementById('oficinaR').value;
  // let ags = puntosDeRevision.filter(puntosDeRevision => puntosDeRevision.oficinaR == estado);
  console.log(oficinaR);

  puntosInternacion = puntosInternacion.filter(puntosInternacion => puntosInternacion.estadoPunto == oficinaR);

  console.log(puntosInternacion);
  puntosInternacion.forEach(punto => {
    const oficinaR = punto.estadoPunto.toLowerCase();
    const nombrePunto = punto.nombrePunto.toLowerCase();
    if (oficinaR.includes(textoBusqueda) || nombrePunto.includes(textoBusqueda)) {
      const option = document.createElement('option');
      option.text = punto.estadoPunto + ' - ' + punto.nombrePunto;
      option.value = puntosInternacion.indexOf(punto); // Guardar el índice del punto en el array
      selector.add(option);
    }
  });
}


// function mostrarDetalle() {
//   const selector = document.getElementById('selector');
//   const selectedIndex = selector.value;
//   if (selectedIndex !== "") {
//     const puntoSeleccionado = puntosDeRevision[selectedIndex];
//     alert(`Nombre del Punto de Revisión: ${puntoSeleccionado.nomPuntoRevision}\nOficina: ${puntoSeleccionado.oficinaR}`);
//   }
// }

function mostrarDetalleI() {
  const selector = document.getElementById('selector');
  const selectedIndex = selector.value;
  if (selectedIndex !== "") {
    const puntoSeleccionado = puntosInternacion[selectedIndex];
    alert(`Nombre del Punto de Revisión: ${puntoSeleccionado.nombrePunto}\nOficina: ${puntoSeleccionado.estadoPunto}`);
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

fetch('https://ruie.dgcor.com/info/PuntosI', {method: 'GET', headers: {'User-Agent': 'insomnia/8.6.1'}})
  .then(response => response.json())
  .then(data => {
    puntosInternacion = data;
    buscarPuntoI(); // Mostrar todos los puntos de revisión al cargar
  })
  .catch(err => console.error(err));


  