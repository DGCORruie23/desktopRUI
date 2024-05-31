const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const checkInternetConnected = require('check-internet-connected');
const { existsSync, readdirSync } = require('fs');

let mainWindow, db, progressInterval, secondWindow, thirdWindow, NacWindow, FamWindow;
let userExists = false;
let userData = null;
let mainWindowReady = false;

function initializeDatabase() {
  const dbFiles = readdirSync(__dirname).filter(file => file.endsWith('.db'));
  let dbPath;

  if (dbFiles.length > 0) {
    dbPath = path.join(__dirname, dbFiles[0]);
    console.log('Base de datos encontrada:', dbPath);
  } else {
    dbPath = path.join(__dirname, 'mydb.db');
    console.log('No se encontró ninguna base de datos existente. Creando nueva base de datos en:', dbPath);
  }

  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error al abrir la base de datos:', err);
    } else {
      console.log('Base de datos SQLite abierta correctamente.');

      if (dbFiles.length === 0) {
        console.log('La base de datos no existía, creando tabla Users.');
        db.run(`CREATE TABLE "Users" (
          "id" INTEGER NOT NULL,
          "nickname" TEXT,
          "nombre" TEXT,
          "apellido" TEXT,
          "password" TEXT,
          "estado" TEXT,
          "tipo" TEXT,
          PRIMARY KEY("id" AUTOINCREMENT)
        )`, (err) => {
          if (err) {
            console.error('Error al crear la tabla Users:', err);
          } else {
            console.log('Tabla Users creada correctamente.');
          }
        });
      }
    }
  });
}

function loadMainWindow() {
  mainWindow.loadFile('./src/res/ventanas/splashScreen.html');
  mainWindow.webContents.on('did-finish-load', async () => {
    console.log('mainWindow cargado');
    mainWindowReady = true;
    const INCREMENT = 0.03;
    const INTERVAL_DELAY = 30; // ms
    let c = 0;

    progressInterval = setInterval(async () => {
      mainWindow.setProgressBar(c);
      console.log(`Progreso: ${c}`);

      if (c >= 0.25 && c < 0.25 + INCREMENT) {
        console.log('Dentro del rango de progreso para comprobar el usuario');
        await checkForUser();
        if (userExists) {
          console.log('Usuario encontrado, esperando a que mainWindow esté listo');
          if (mainWindowReady && mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
            mainWindow.webContents.once('update-data-reply', () => {
              clearInterval(progressInterval);
              mainWindow.setProgressBar(-1);
              mainWindow.hide();
              mainWindow.close();

              if (userExists) {
                createThirdWindowWithUser(userData);
              } else {
                createSecondWindow();
              }
            });
            mainWindow.webContents.send('update-data', userData);
          } else {
            console.error('mainWindow no está disponible o está cerrado');
          }
        } else {
          console.log('Usuario no encontrado, creando segunda ventana');
          createSecondWindow();
        }
      }

      if (c < 1) {
        c += INCREMENT;
      } else {
        console.log('Progreso completo');
        clearInterval(progressInterval);
        mainWindow.setProgressBar(-1);
        mainWindow.hide();
        mainWindow.close();

        if (userExists) {
          createThirdWindowWithUser(userData);
        } else {
          createSecondWindow();
        }
      }
    }, INTERVAL_DELAY);
  });
}


app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const config = {
    timeout: 10000,
    retries: 3,
    domain: 'ruie.dgcor.com'
  };

  checkInternetConnected(config)
    .then(() => {
      console.log("Conexión disponible");
      initializeDatabase();
      loadMainWindow();
    })
    .catch((err) => {
      console.log("No hay conexión", err);
      initializeDatabase();
      loadMainWindow();
    });

  ipcMain.once('validado', handleValidado);
  ipcMain.on('main-window-ready', () => {
    mainWindowReady = true;
    console.log('mainWindow está listo para recibir datos');
    if (userExists && mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
      mainWindow.webContents.send('update-data', userData);
    }
  });
});

async function checkForUser() {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Users LIMIT 1', (err, row) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        userExists = false;
        resolve();
      } else if (row) {
        console.log('Usuario encontrado:', row);
        userExists = true;
        userData = row;
        resolve();
      } else {
        console.log('No se encontró usuario');
        userExists = false;
        resolve();
      }
    });
  });
}

function createSecondWindow() {
  if (secondWindow) return; // Evitar crear múltiples ventanas

  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  secondWindow.loadFile('./src/res/ventanas/log-in.html');

  secondWindow.on('closed', () => {
    secondWindow = null;
    ipcMain.removeListener('validado', handleValidado);
  });

  secondWindow.once('ready-to-show', () => {
    secondWindow.show();
  });

  ipcMain.once('validado', handleValidado);
}

function handleValidado(event, validado) {
  console.log("Lo que trae handleValidado", validado);
  if (validado.val === 1) {
    if (secondWindow) {
      secondWindow.hide();
      secondWindow.close();
      secondWindow = null;
    }
    const userData = {
      nickname: validado.nickname,
      nombre: validado.nombre,
      apellido: validado.apellido,
      estado: validado.estado,
      tipo: validado.tipo
    };
    createThirdWindowWithUser(userData);
  } else {
    createSecondWindow();
  }
}

function createThirdWindowWithUser(user) {
  if (thirdWindow) return; // Evitar crear múltiples ventanas

  try {
    console.log("Creating third window with user data:", user);

    thirdWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      show: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    thirdWindow.loadFile('./src/res/ventanas/captura.html');

    thirdWindow.on('closed', () => {
      console.log('Third window closed');
      ipcMain.removeListener('nacionalidad', handleNacionalidad);
      ipcMain.removeListener('familia', handleFamilia);
      thirdWindow = null;
    });

    thirdWindow.once('ready-to-show', () => {
      console.log("Third window ready to show");
      thirdWindow.webContents.send('user-data', user);
      thirdWindow.show();
    });

    ipcMain.once('nacionalidad', handleNacionalidad);
    ipcMain.once('familia', handleFamilia);

    console.log("Third window setup complete");
  } catch (error) {
    console.error('Error al crear la tercera ventana:', error);
  }
}

function handleNacionalidad(event, nac) {
  if (nac === 1) {
    if (thirdWindow) {
      thirdWindow.hide();
      thirdWindow.close();
      thirdWindow = null; // Asegurar que se libera la referencia
    }
    createNacWindow();
  }
}

function handleFamilia(event, fam) {
  if (fam === 1) {
    if (thirdWindow) {
      thirdWindow.hide();
      thirdWindow.close();
      thirdWindow = null; // Asegurar que se libera la referencia
    }
    createFamWindow();
  }
}

function createNacWindow() {
  if (NacWindow) return; // Evitar crear múltiples ventanas

  NacWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  NacWindow.loadFile('./src/res/ventanas/nacionalidad.html');

  NacWindow.on('closed', () => {
    NacWindow = null;
    ipcMain.removeListener('retCap', handleRetCapNac);
  });

  NacWindow.once('ready-to-show', () => {
    NacWindow.show();
  });

  ipcMain.once('retCap', handleRetCapNac);
}

function handleRetCapNac(event, retCaptura) {
  if (retCaptura === 1) {
    if (NacWindow) {
      NacWindow.hide();
      NacWindow.close();
      NacWindow = null; // Asegurar que se libera la referencia
    }
    createThirdWindowWithUser(userData);
  }
}

function createFamWindow() {
  if (FamWindow) return; // Evitar crear múltiples ventanas

  FamWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  FamWindow.loadFile('./src/res/ventanas/familia.html');

  FamWindow.on('closed', () => {
    FamWindow = null;
    ipcMain.removeListener('retCap', handleRetCapFam);
  });

  FamWindow.once('ready-to-show', () => {
    FamWindow.show();
  });

  ipcMain.once('retCap', handleRetCapFam);
}

function handleRetCapFam(event, retCaptura) {
  if (retCaptura === 1) {
    if (FamWindow) {
      FamWindow.hide();
      FamWindow.close();
      FamWindow = null; // Asegurar que se libera la referencia
    }
    createThirdWindowWithUser(userData);
  }
}

ipcMain.handle('executeQuery', async (event, query, params) => {
  console.log('Ejecutando consulta:', query, 'con parametros:', params);
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        reject(err);
      } else {
        console.log('Consulta ejecutada correctamente, filas:', rows);
        resolve(rows);
      }
    });
  });
});

app.on('window-all-closed', () => {
  db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  clearInterval(progressInterval);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSecondWindow();
  }
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.enableSandbox();
