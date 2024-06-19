const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    checkAndCreateDatabase: () => ipcRenderer.invoke('check-and-create-db'),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, progress) => callback(progress)),
    saveUserToDatabase: (userData) => ipcRenderer.send('save-user-to-db', userData),
    thenLogin: (validado) => ipcRenderer.send('createThenLogin', validado)
});

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

