const { ipcRenderer } = require('electron');

ipcRenderer.on('user-data', async (event, userData) => {
    // const userDataContainer = document.getElementById('user-data');
    // userDataContainer.innerHTML = `
    //     <div><strong>Nickname:</strong> ${userData.nickname}</div>
    //     <div><strong>Nombre:</strong> ${userData.nombre}</div>
    //     <div><strong>Apellido:</strong> ${userData.apellido}</div>
    //     <div><strong>Password:</strong> ${userData.password}</div>
    //     <div><strong>Estado:</strong> ${userData.estado}</div>
    //     <div><strong>Tipo:</strong> ${userData.tipo}</div>
    // `;
    const estadoMap = {
        '1': 'AGUASCALIENTES',
        '2': 'BAJA CALIFORNIA',
        '3': 'BAJA CALIFORNIA SUR',
        '4': 'CAMPECHE',
        '5': 'COAHUILA',
        '6': 'COLIMA',
        '7': 'CHIAPAS',
        '8': 'CHIHUAHUA',
        '9': 'CDMX',
        '10': 'DURANGO',
        '11': 'GUANAJUATO',
        '12': 'GUERRERO',
        '13': 'HIDALGO',
        '14': 'JALISCO',
        '15': 'EDOMEX',
        '16': 'MICHOACÁN',
        '17': 'MORELOS',
        '18': 'NAYARIT',
        '19': 'NUEVO LEÓN',
        '20': 'OAXACA',
        '21': 'PUEBLA',
        '22': 'QUERÉTARO',
        '23': 'QUINTANA ROO',
        '24': 'SAN LUIS POTOSÍ',
        '25': 'SINALOA',
        '26': 'SONORA',
        '27': 'TABASCO',
        '28': 'TAMAULIPAS',
        '29': 'TLAXCALA',
        '30': 'VERACRUZ',
        '31': 'YUCATÁN',
        '32': 'ZACATECAS'
    };

    const estado = estadoMap[userData.estado] || 'Estado desconocido';
    const header = document.querySelector('header h1');
    header.textContent = `RESCATES OR: ${estado}`;

    const footer = document.querySelector('footer p');
    footer.textContent = `Agente: ${userData.nombre} ${userData.apellido}`;

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    const dateElement = document.getElementById('current-date');
    dateElement.textContent = formattedDate;

    let puntosUnificados = [];

    async function fetchPuntosDeDB() {
        try {
            puntosUnificados = await ipcRenderer.invoke('obtenerPuntosDeDB');
        } catch (err) {
            console.error('Error al obtener puntos de la base de datos:', err);
        }
    }

    let timeoutId;

    function buscarPunto(puntos) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            const input = document.getElementById('nPunto').value.toLowerCase().trim();
            const suggestions = document.getElementById('suggestions');
            suggestions.innerHTML = '';

            if (input.length > 0) {
                const filteredPuntos = puntos.filter(punto => {
                    const nombrePunto = punto.nombre.toLowerCase();
                    return nombrePunto.includes(input);
                });

                filteredPuntos.forEach(punto => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = `${punto.nombre} (${punto.tipo})`;
                    suggestion.onclick = () => seleccionarPunto(punto);
                    suggestions.appendChild(suggestion);
                });
            }
        }, 300);
    }

    function seleccionarPunto(punto) {
        const input = document.getElementById('nPunto');
        input.value = `${punto.nombre} (${punto.tipo})`;
        document.getElementById('suggestions').innerHTML = ''; 
    }

    async function actualizarPuntosPorTipo() {
        const tRescate = document.getElementById('tRescate').value.toLowerCase();

        let puntosFiltrados = [];

        if (tRescate === 'hotel') {
            puntosFiltrados = puntosUnificados.filter(punto => punto.tipo.toLowerCase() === 'hotel');
        } else {
            puntosFiltrados = puntosUnificados.filter(punto => {
                const tipoPunto = punto.tipo.toLowerCase();
                const tipoEquivalente = tipoPunto === 'aereos' ? 'aeropuerto' : tipoPunto === 'terrestres' ? 'carretero' : tipoPunto;
                return tipoEquivalente === tRescate || tipoPunto === tRescate;
            });
        }

        console.log("Puntos Filtrados:", puntosFiltrados);

        document.getElementById('nPunto').removeEventListener('input', buscarPunto);
        document.getElementById('nPunto').addEventListener('input', () => buscarPunto(puntosFiltrados));
    }

    document.getElementById('tRescate').addEventListener('change', actualizarPuntosPorTipo);
    document.getElementById('nPunto').addEventListener('input', () => buscarPunto(puntosUnificados));

    await fetchPuntosDeDB();
    await actualizarPuntosPorTipo();
});



const btnNacionalidad = document.getElementById('btnNacionalidad');
const fillMessage = document.getElementById('fillMessage');


btnNacionalidad.addEventListener('click', function() {
    const inputPunto = document.getElementById('nPunto').value.trim();

    if (inputPunto.length > 0) {

        ipcRenderer.send('abrir-nueva-ventana');
    } else {
        fillMessage.style.display = 'inline-block'; 
        setTimeout(() => {
            fillMessage.style.display = 'none';
        }, 3000);
    }
});

btnFamilia.addEventListener('click', function() {
    const inputPunto = document.getElementById('nPunto').value.trim();

    if (inputPunto.length > 0) {

        ipcRenderer.send('familia');
    } else {
        fillMessage.style.display = 'inline-block'; 
        setTimeout(() => {
            fillMessage.style.display = 'none';
        }, 3000);
    }
});










































