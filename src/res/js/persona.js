const { ipcRenderer } = require('electron');

ipcRenderer.on('datos-nacionalidad', async (event, datos) => {
    console.log("datosNacionalidad:", datos);

    let pais = document.getElementById("pais");
    pais.value = datos.nacionalidad;
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    fechaNacimientoInput.addEventListener('blur', function () {
        const fechaNacimiento = this.value;
        if (!isValidFechaNacimiento(fechaNacimiento)) {
            alert('Por favor ingrese la fecha de nacimiento en formato DD/MM/AAAA.');
            this.focus();
        }
    });

    function isValidFechaNacimiento(fecha) {
        const regex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
        return regex.test(fecha);
    }


    document.getElementById('backButton').addEventListener('click', () => {
        console.log("presionando botonnn");
        ipcRenderer.send('regresar-nacionalidad');
    });
});