const { ipcRenderer } = require('electron');
let countries = [];

function loadCountries() {
    return ipcRenderer.invoke('obtenerPaisesDeDB').then((loadedCountries) => {
        countries = loadedCountries;
        return countries;
    });
}

function filterCountries(searchTerm) {
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

ipcRenderer.on('datos-capturados', async (event, datos) => {
    console.log(datos);
    
    // Cargar países al iniciar
    await loadCountries();

    // Seleccionar elementos del DOM
    const btnNacionalidad = document.getElementById('btnNacionalidad');
    const fillMessage = document.getElementById('fillMessage');

    // Función para mostrar alerta con la nacionalidad y el texto del input de puntos
    btnNacionalidad.addEventListener('click', function() {
        const inputPais = document.getElementById('searchInput').value.trim();

        if (inputPais.length > 0) {
            const country = countries.find((country) => {
                const countryName = `${country.nombre_pais} (${country.iso3})`;
                return countryName.toLowerCase() === inputPais.toLowerCase();
            });

            if (country) {
                datos.nacionalidad = country.nombre_pais;
                datos.iso3 = country.iso3;
                ipcRenderer.send('cerrarNacionalidadCrearPersona', datos);
            } else {
                fillMessage.textContent = 'La nacionalidad ingresada no existe en la lista de países.';
                fillMessage.style.display = 'inline-block';
                setTimeout(() => {
                    fillMessage.style.display = 'none';
                }, 2000);
            }
        } else {
            fillMessage.style.display = 'inline-block'; // Mostrar mensaje de llenar para continuar
            setTimeout(() => {
                fillMessage.style.display = 'none'; // Ocultar mensaje después de un tiempo
            }, 3000); // Ocultar después de 3 segundos
        }
    });
});
