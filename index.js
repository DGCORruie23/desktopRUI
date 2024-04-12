const { app, BrowserWindow } = require('electron/main')
const { ipcMain } = require('electron')
const { join } = require("path");
const { setdbPath, executeQuery, executeMany, executeScript, fetchOne, fetchMany, fetchAll } = require("sqlite-electron");

const sqlite = require("sqlite-electron");

const path = require('path')

let progressInterval
let secondWindow

function createWindowPrueba () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })


  mainWindow.loadFile('prueba.html')

}





function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 500,

    webPreferences: {
      preload: join(__dirname, "preloaddb.js"),
      nodeIntegration : true,
      enableRemoteModule: true
    }

  })

  win.loadFile('./src/res/ventanas/splashScreen.html')

  const INCREMENT = 0.03
  const INTERVAL_DELAY = 500 // ms

  let c = 0
  progressInterval = setInterval(() => {
    // update progress bar to next value
    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
    win.setProgressBar(c)

    // increment or reset progress bar
    if (c < 1) {
      c += INCREMENT
    } else {
      clearInterval(progressInterval) // clear the progress interval
      win.setProgressBar(-1) // reset progress bar


      win.hide()
      win.close()
      

      createSecondWindow()
    }
  }, INTERVAL_DELAY)
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
  })

  secondWindow.loadFile('./src/res/ventanas/log-in.html')

  secondWindow.on('closed', function () {
    secondWindow = null
  })

  secondWindow.once('ready-to-show', () => {
    secondWindow.show()


    

  })

  ipcMain.once('validado', (event, val) => {
    //console.log(`Renderer: ${name}`)

    if( val == 1){
      secondWindow.hide()
      secondWindow.close()
      createThirdWindow();
      val = 0;
    }
    val = 0;
  })



}


function createThirdWindow() {
  thirdWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      show: false, // set show to false initially
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
      }
  });

  thirdWindow.loadFile('./src/res/ventanas/captura.html');

  thirdWindow.on('closed', function () {
      thirdWindow = null;
  });

  thirdWindow.once('ready-to-show', () => {
      thirdWindow.show();


  });

  
  ipcMain.once('nacionalidad', (event, nac) => {
    //console.log(`Renderer: ${name}`)
    console.log('nac vale');
    console.log(nac);
    if( nac == 1){
      thirdWindow.hide()
      thirdWindow.close()
      createNacWindow();
      nac = 0;
    }
    nac = 0;
    ipcMain.removeListener('nacionalidad', (event, nac));
  })

  ipcMain.once('familia', (event, fam) => {
    //console.log(`Renderer: ${name}`)
    console.log('fam vale');
    console.log(fam);
    if( fam == 1){
      thirdWindow.hide()
      thirdWindow.close()
      createFamWindow();
      fam = 0;
    }
    fam = 0;
    ipcMain.removeListener('familia', (event, fam));
  })
}


function createNacWindow() {
  NacWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      show: false, // set show to false initially
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
      }
  });

  NacWindow.loadFile('./src/res/ventanas/nacionalidad.html');

  NacWindow.on('closed', function () {
    NacWindow = null;
  });

  NacWindow.once('ready-to-show', () => {
    NacWindow.show();

  });

  ipcMain.once('retCap', (event, retCaptura) => {
    //console.log(`Renderer: ${name}`)
    console.log('retCaptura vale');
    console.log(retCaptura);
    if( retCaptura == 1){
      NacWindow.hide()
      NacWindow.close()
      createThirdWindow();
      retCaptura = 0;
    }
    retCaptura = 0;
    ipcMain.removeListener('retCap', (event, retCaptura));
  })


}


function createFamWindow() {
  FamWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      show: false, // set show to false initially
      webPreferences: {
        contextIsolation:  true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
      }
  });

  FamWindow.loadFile('./src/res/ventanas/familia.html');

  FamWindow.on('closed', function () {
    FamWindow = null;
  });

  FamWindow.once('ready-to-show', () => {
    FamWindow.show();

  });

  ipcMain.once('retCap', (event, retCaptura) => {
    //console.log(`Renderer: ${name}`)
    console.log('retCaptura vale');
    console.log(retCaptura);
    if( retCaptura == 1){
      FamWindow.hide()
      FamWindow.close()
      createThirdWindow();
      retCaptura = 0;
    }
    retCaptura = 0;
    ipcMain.removeListener('retCap', (event, retCaptura));
  })


}


app.whenReady().then(createWindow)

// before the app is terminated, clear both timers
app.on('before-quit', () => {
  clearInterval(progressInterval)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})











function createWindowDB() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preloaddb.js"),
    },
  });

  win.loadFile("pruebasdb.html");
}
app.enableSandbox();



ipcMain.handle("potd", async (event, dbPath, isuri) => {
  try {
    return await setdbPath(dbPath, isuri)
  } catch (error) {
    return error
  }
});

ipcMain.handle("executeQuery", async (event, query, value) => {
  try {
    return await executeQuery(query, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("fetchone", async (event, query, value) => {
  try {
    return await fetchOne(query, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("fetchmany", async (event, query, size, value) => {
  try {
    return await fetchMany(query, size, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("fetchall", async (event, query, value) => {
  try {
    return await fetchAll(query, value);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("executeMany", async (event, query, values) => {
  try {
    return await executeMany(query, values);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("executeScript", async (event, scriptpath) => {
  try {
    return await executeScript(scriptpath);
  } catch (error) {
    return error;
  }
});


