const formattedDate = moment().format('DD-MM-YYYY');

document.getElementById("fecha").innerHTML = formattedDate;

document.getElementById("hora").innerHTML = Date();

function actualizarFechaHora() {
    var fechaElemento = document.getElementById('fecha');
    var horaElemento = document.getElementById('hora');

    // Obtener la fecha y la hora actual utilizando moment.js
    var fechaActual = moment().format('YYYY-MM-DD');
    var horaActual = moment().format('HH:mm:ss');

    // Mostrar la fecha y la hora en los elementos correspondientes
    fechaElemento.textContent = fechaActual;
    horaElemento.textContent = horaActual;
}

// Actualizar la fecha y la hora cada segundo
setInterval(actualizarFechaHora, 1000);

// Llamar a la función por primera vez para mostrar la fecha y la hora inicial
actualizarFechaHora();