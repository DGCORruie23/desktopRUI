let puntosDeRevision = [];
let puntosInternacion = [];
let puntosUnificados = [];

// Función para realizar fetch de datos y unificar los resultados
async function fetchData() {
  try {
    const [data1, data2] = await Promise.all([
      fetch('https://ruie.dgcor.com/info/Fuerza').then(response => response.json()),
      fetch('https://ruie.dgcor.com/info/PuntosI').then(response => response.json())
    ]);

    puntosDeRevision = data1.map(punto => ({
      nombre: punto.nomPuntoRevision,
      estado: punto.oficinaR,
      tipo: punto.tipoP
    }));

    puntosInternacion = data2.map(punto => ({
      nombre: punto.nombrePunto,
      estado: punto.estadoPunto,
      tipo: punto.tipoPunto
    }));

    puntosUnificados = [...puntosDeRevision, ...puntosInternacion];
    buscarPunto(); // Mostrar todos los puntos al cargar
  } catch (err) {
    console.error(err);
  }
}

// Función para buscar y filtrar puntos
function buscarPunto() {
  const input = document.getElementById('selector');
  const textoBusqueda = input.value.toLowerCase().trim();
  const selector = document.getElementById('selector');
  selector.innerHTML = '<option value="" selected>Selecciona un punto de revisión</option>'; // Limpiar opciones anteriores
  
  const oficinaR = document.getElementById('oficinaR').value.toLowerCase().trim();

  puntosUnificados.forEach((punto, index) => {
    const nombrePunto = punto.nombre.toLowerCase();
    const estadoPunto = punto.estado.toLowerCase();
    const coincideOficina = oficinaR === '' || estadoPunto === oficinaR;
    
    const coincideBusqueda = textoBusqueda === '' || 
      nombrePunto.split(/\s+/).some(palabra => palabra === textoBusqueda) || 
      estadoPunto.split(/\s+/).some(palabra => palabra === textoBusqueda);

    if (coincideOficina && coincideBusqueda) {
      const option = document.createElement('option');
      option.text = `${punto.estado} - ${punto.nombre} - ${punto.tipo}`;
      option.value = index; // Guardar el índice del punto en el array unificado
      selector.add(option);
    }
  });
}

// Función para mostrar detalles del punto seleccionado
function mostrarDetalle() {
  const selector = document.getElementById('selector');
  const selectedIndex = selector.value;
  if (selectedIndex !== "") {
    const puntoSeleccionado = puntosUnificados[selectedIndex];
    alert(`Nombre del Punto: ${puntoSeleccionado.nombre}\nEstado: ${puntoSeleccionado.estado}\nTipo: ${puntoSeleccionado.tipo}`);
  }
}

// Función para actualizar los puntos según el tipo de rescate
async function actualizarPuntosPorTipo() {
  const tRescate = document.getElementById('tRescate').value.toLowerCase();
  const oficinaR = document.getElementById('oficinaR').value.toLowerCase();
  const nPunto = document.getElementById('nPunto');
  nPunto.innerHTML = '<option value="" selected>Selecciona un nombre del punto</option>'; // Limpiar opciones anteriores

  let puntosFiltrados = puntosUnificados;

  // Si el tipo de rescate es "Hotel", realizar un nuevo fetch
  if (tRescate === 'hotel') {
    try {
      const response = await fetch('http://ruie.dgcor.com/info/Municipios');
      const data = await response.json();

      puntosFiltrados = data.filter(punto => punto.estado.toLowerCase() === oficinaR).map(punto => ({
        nombre: punto.nomMunicipio,
        estado: punto.estado,
        tipo: 'Hotel'
      }));
    } catch (err) {
      console.error(err);
      return;
    }
  } else {
    puntosFiltrados = puntosUnificados.filter(punto => {
      const tipoPunto = punto.tipo.toLowerCase();
      const tipoEquivalente = tipoPunto === 'aereos' ? 'aeropuerto' : tipoPunto === 'terrestres' ? 'carretero' : tipoPunto;
      return (tipoEquivalente === tRescate || punto.tipo.toLowerCase() === tRescate) && punto.estado.toLowerCase() === oficinaR;
    });
  }

  puntosFiltrados.forEach(punto => {
    const option = document.createElement('option');
    option.text = punto.nombre;
    option.value = punto.nombre;
    nPunto.add(option);
  });
}

// Cargar los datos al cargar la página
fetchData();

// Event listener para el cambio en el tipo de rescate
document.getElementById('tRescate').addEventListener('change', actualizarPuntosPorTipo);

