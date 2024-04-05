
const { contextBridge, ipcRenderer } = require('electron')

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










