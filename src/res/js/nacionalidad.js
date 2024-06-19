const { ipcRenderer } = require('electron');

function loadCountries() {
    return ipcRenderer.invoke('obtenerPaisesDeDB');
}

function filterCountries(searchTerm) {
    loadCountries().then((countries) => {
        const countriesList = document.getElementById('countriesList');
        countriesList.innerHTML = '';
        countriesList.style.display = 'none';

        const uniqueCountries = [];
        countries.forEach((country) => {
            const countryName = `${country.nombre_pais} (${country.iso3})`;
            if (countryName.toLowerCase().includes(searchTerm) && !uniqueCountries.includes(countryName)) {
                uniqueCountries.push(countryName);
                const countryElement = document.createElement('p');
                countryElement.textContent = countryName;
                countryElement.addEventListener('click', () => {
                    document.getElementById('searchInput').value = countryName;
                    countriesList.style.display = 'none';
                });
                countriesList.appendChild(countryElement);
                countriesList.style.display = 'block';
            }
        });

        if (uniqueCountries.length === 0) {
            countriesList.style.display = 'none';
        }
    }).catch((error) => {
        console.error('Error al cargar países:', error);
    });
}

function clearCountriesList() {
    const countriesList = document.getElementById('countriesList');
    countriesList.innerHTML = '';
    countriesList.style.display = 'none';
}


document.getElementById('searchInput').addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    if (searchTerm) {
        filterCountries(searchTerm);
    } else {
        clearCountriesList();
    }
});

document.getElementById('backButton').addEventListener('click', () => {
    ipcRenderer.send('regresar-capturaOnline');
});

























// Seleccionar elementos del DOM
const btnNacionalidad = document.getElementById('btnNacionalidad');
const fillMessage = document.getElementById('fillMessage');

// Función para mostrar alerta con la nacionalidad y el texto del input de puntos
btnNacionalidad.addEventListener('click', function() {
    const inputPais = document.getElementById('searchInput').value.trim();

    if (inputPais.length > 0) {

        ipcRenderer.send('cerrarNacionalidadCrearPersona');
    } else {
        fillMessage.style.display = 'inline-block'; // Mostrar mensaje de llenar para continuar
        setTimeout(() => {
            fillMessage.style.display = 'none'; // Ocultar mensaje después de un tiempo
        }, 3000); // Ocultar después de 3 segundos
    }
});


