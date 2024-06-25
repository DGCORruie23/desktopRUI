const { ipcRenderer } = require('electron');

ipcRenderer.on('datos-nacionalidad', async (event, datos) => {
    console.log("datosNacionalidad:", datos);

    let pais = document.getElementById("pais");
    pais.value = datos.nacionalidad;

    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    const fechaNacimientoError = document.getElementById('fechaNacimientoError');
    const nombreError = document.getElementById('nombreError');
    const apellidosError = document.getElementById('apellidosError');
    const sexoError = document.getElementById('sexoError');

    fechaNacimientoInput.addEventListener('blur', function () {
        const fechaNacimiento = this.value;
        if (!isValidFechaNacimiento(fechaNacimiento)) {
            fechaNacimientoError.textContent = 'Por favor ingrese la fecha de nacimiento válida en formato DD/MM/AAAA (1920 - hoy).';
        } else {
            fechaNacimientoError.textContent = '';
        }
    });

    function isValidFechaNacimiento(fecha) {
        const regex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!regex.test(fecha)) {
            return false;
        }

        const [dia, mes, año] = fecha.split('/').map(Number);
        const hoy = new Date();
        const añoActual = hoy.getFullYear();
        const mesActual = hoy.getMonth() + 1; // Los meses son de 0 a 11
        const diaActual = hoy.getDate();

        if (año < 1920 || año > añoActual) {
            return false;
        }

        if (año === añoActual && (mes > mesActual || (mes === mesActual && dia > diaActual))) {
            return false;
        }

        if (!esDiaValido(dia, mes, año)) {
            return false;
        }

        return true;
    }

    function esDiaValido(dia, mes, año) {
        const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Verifica si es un año bisiesto
        if (mes === 2 && (año % 4 === 0 && (año % 100 !== 0 || año % 400 === 0))) {
            diasPorMes[1] = 29;
        }
        
        return dia > 0 && dia <= diasPorMes[mes - 1];
    }

    document.getElementById('backButton').addEventListener('click', () => {
        ipcRenderer.send('regresar-nacionalidad');
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        const nombre = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const sexo = document.querySelector('input[name="sexo"]:checked') ? document.querySelector('input[name="sexo"]:checked').value : null;

        let valid = true;

        if (!nombre) {
            nombreError.textContent = 'El nombre es obligatorio.';
            valid = false;
        } else {
            nombreError.textContent = '';
        }

        if (!apellidos) {
            apellidosError.textContent = 'Los apellidos son obligatorios.';
            valid = false;
        } else {
            apellidosError.textContent = '';
        }

        if (!fechaNacimiento) {
            fechaNacimientoError.textContent = 'La fecha de nacimiento es obligatoria.';
            valid = false;
        } else if (!isValidFechaNacimiento(fechaNacimiento)) {
            fechaNacimientoError.textContent = 'Por favor ingrese la fecha de nacimiento válida en formato DD/MM/AAAA (1920 - hoy).';
            valid = false;
        } else {
            fechaNacimientoError.textContent = '';
        }

        if (!sexo) {
            sexoError.textContent = 'El sexo es obligatorio.';
            valid = false;
        } else {
            sexoError.textContent = '';
        }

        if (!valid) {
            return;
        }

        const edad = calcularEdad(fechaNacimiento);

        const lista = {
            nombre: nombre,
            apellidos: apellidos,
            noIdentidad: "00",
            parentesco: "",
            fechaNacimiento: fechaNacimiento,
            sexo: sexo === 'hombre',
            embarazo: false,
            numFamilia: "",
            edad: edad
        };

        datos = { ...datos, ...lista };

        console.log("datos: ", datos);
        ipcRenderer.send('guardarRegistro', datos);
    });

    function calcularEdad(fecha) {
        const [dia, mes, año] = fecha.split('/').map(Number);
        const hoy = new Date();
        let edad = hoy.getFullYear() - año;
        const mesActual = hoy.getMonth() + 1;
        const diaActual = hoy.getDate();
        if (mes > mesActual || (mes === mesActual && dia > diaActual)) {
            edad--;
        }
        return edad;
    }
});
