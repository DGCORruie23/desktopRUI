const { app, BrowserWindow } = require('electron');

let mainWindow;
let secondWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  setTimeout(() => {
    createSecondWindow();
  }, 5000);
}

function createSecondWindow() {
  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  secondWindow.loadFile('index1.html'); 

  secondWindow.on('closed', function () {
    secondWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
