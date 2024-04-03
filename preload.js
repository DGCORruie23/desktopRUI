
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'myAPI', 
  {
    printNameToCLI: (name) => ipcRenderer.send('validado', name),
    printNac: (name) => ipcRenderer.send('nacionalidad', name)
  }
)

window.require = require;










