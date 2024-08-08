const { ipcRenderer } = require('electron');

ipcRenderer.on('datos-capturadosFamilia', async (event, datos) => {
    console.log(datos);
    
});
