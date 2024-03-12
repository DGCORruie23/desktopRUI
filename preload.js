
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'myAPI', 
  {
    printNameToCLI: (name) => ipcRenderer.send('validado', name)
  }
)

