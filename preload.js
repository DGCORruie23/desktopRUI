const { contextBridge, ipcRenderer } = require('electron');

const dbManager = {
  executeQuery: async (query, params) => {
    try {
      const result = await ipcRenderer.invoke('executeQuery', query, params);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

contextBridge.exposeInMainWorld('dbManager', dbManager);


contextBridge.exposeInMainWorld(
  'myAPI', 
  {
    printNameToCLI: (name) => ipcRenderer.send('validado', name),
    printFam: (name) => ipcRenderer.send('familia', name),
    returnToCaptura: (name) => ipcRenderer.send('retCap', name),
    printNac: (name) => ipcRenderer.send('nacionalidad', name)
  }
)

window.require = require;



contextBridge.exposeInMainWorld('api', {
  receiveUserData: (callback) => {
    ipcRenderer.on('user-data', (event, user) => callback(user))
  },
  updateUserData: (callback) => {
    ipcRenderer.on('update-data', (event, user) => callback(user));
  }
});

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('main-window-ready');
});

ipcRenderer.on('update-data', (event, userData) => {
  // Aquí manejas los datos del usuario
  console.log('Datos del usuario recibidos:', userData);
  // Actualiza tu UI con los datos del usuario
});


