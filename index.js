const { error } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;
let progressInterval;
let secondWindow;
let thirdWindow = null;
let NacWindow;
let FamWindow;
let userExists = false;
let userData = null;

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

  const checkInternetConnected = require('check-internet-connected');

    const config = {
      timeout: 5000, //timeout connecting to each try (default 5000)
      retries: 3,//number of retries to do before failing (default 5)
      domain: 'google.com'//the domain to check DNS record of
    }

    checkInternetConnected(config)
      .then(() => {
        console.log("Connection available");

        const dbPath = path.join(__dirname, 'mydb.db');
        console.log('Ruta de la base de datos:', dbPath);
        db = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.error('Error al abrir la base de datos:', err);
          } else {
            console.log('Base de datos SQLite abierta correctamente.');
          }
        });
      
      
        mainWindow.loadFile('./src/res/ventanas/splashScreen.html');
        const INCREMENT = 0.03;
        const INTERVAL_DELAY = 30; // ms
      
        let c = 0;
        progressInterval = setInterval(async () => {
          mainWindow.setProgressBar(c);
      
          if (c >= 0.25 && c < 0.25 + INCREMENT) {
            await checkForUser();
            if (userExists) {
              // await updateUser(userData.nickname,userData.password)
              // createThirdWindowWithUser(userData);
              mainWindow.webContents.send('update-data', userData);


            } else {
              createSecondWindow();
            }
          }
      
          if (c < 1) {
            c += INCREMENT;
          } else {

              clearInterval(progressInterval);
              mainWindow.setProgressBar(-1);
              mainWindow.hide();
              mainWindow.close();

          }
        }, INTERVAL_DELAY);
      }).catch((err) => {
        console.log("No connection", err);









          const dbPath = path.join(__dirname, 'mydb.db');
  console.log('Ruta de la base de datos:', dbPath);
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error al abrir la base de datos:', err);
    } else {
      console.log('Base de datos SQLite abierta correctamente.');
    }
  });


  mainWindow.loadFile('./src/res/ventanas/splashScreen.html');
  const INCREMENT = 0.03;
  const INTERVAL_DELAY = 30; // ms

  let c = 0;
  progressInterval = setInterval(async () => {
    mainWindow.setProgressBar(c);

    if (c >= 0.25 && c < 0.25 + INCREMENT) {
      await checkForUser();
    }

    if (c < 1) {
      c += INCREMENT;
    } else {
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

      
  ipcMain.once('validado', handleValidado);
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
        userExists = false;
        resolve();
      }
    });
  });
}

function createSecondWindow() {
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
  console.log("Lo que trae handleValidado")
  console.log(validado);
  if (validado.val === 1) {
    if (secondWindow) {
      secondWindow.hide();
      secondWindow.close();
      secondWindow = null;  // Asegúrate de liberar la referencia
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

    console.log("Loading file './src/res/ventanas/captura.html'");
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
    }
    createNacWindow();
  }
}

function handleFamilia(event, fam) {
  if (fam === 1) {
    if (thirdWindow) {
      thirdWindow.hide();
      thirdWindow.close();
    }
    createFamWindow();
  }
}

function createNacWindow() {
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
    }
    createThirdWindowWithUser(userData);
  }
}

function createFamWindow() {
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
        console.log('Consulta ejecutada correctamente:', rows.length, 'filas obtenidas.');
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
    createSecondWindow(); // O crea otra ventana principal según tu lógica
  }
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.enableSandbox();








async function updateUser(nickname,password) {



  // const data = JSON.stringify({
  //     "nickname": nickname,
  //     "password": password
  // });

  // try {
  //   console.log("usuario actualice ");
  //   console.log(data);
  //     const response = await fetch("https://ruie.dgcor.com/login/validar/", {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'User-Agent': 'insomnia/8.6.0'
  //         },
  //         body: data
  //     });
  //     console.log("entro aqui")
  //     console.log(response);
  //     if (response.ok) {
  //         const responseData = await response.json();
  //         const valPasswd = responseData['password'];
  //         console.log(valPasswd);
  //         console.log(responseData);
  //         if (valPasswd === 'ok') {
  //           //   validado = 1;
  //           //   console.log("Usuario correcto");
  //           //   console.log(validado);

            
  //           const nickname = responseData['nickname'];
  //           const nombre = responseData['nombre'];
  //           const apellido = responseData['apellido'];
  //           const estado = responseData['estado'];
  //           const tipo = responseData['tipo'];

  //           const validado = {
  //               nickname: nickname,
  //               nombre: nombre,
  //               apellido: apellido,
  //               estado: estado,
  //               tipo: tipo,
  //               password: password,
  //           };
  //           console.log("insertando usuario....")
  //           insertUser(nickname, nombre, apellido, password, estado, tipo);

  //         } else {
  //             validado = 0;
  //             console.log("Hubo un cambio en la contraseña");
  //             createSecondWindow();
  //         }
  //     } else {
  //       console.log("pepe");
  //       console.log(error);
  //     }
  // } catch (error) {
  //     console.error('Error:', error);
  // } finally {
  // }
  // validateUser();
}