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