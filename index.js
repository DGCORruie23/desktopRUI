const { app, BrowserWindow } = require('electron/main')
const { ipcMain } = require('electron')
const { join } = require("path");
const { setdbPath, executeQuery, executeMany, executeScript, fetchOne, fetchMany, fetchAll } = require("sqlite-electron");

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
    frame: false,
    webPreferences: {
      preload: join(__dirname, "preloaddb.js"),
      nodeIntegration : true,
      enableRemoteModule: true
    }

  })

  win.loadFile('./src/res/ventanas/splashScreen.html')

  const INCREMENT = 0.03
  const INTERVAL_DELAY = 1000 // ms

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

  ipcMain.on('validado', (event, val) => {
    //console.log(`Renderer: ${name}`)

    if( val == 1){
      secondWindow.hide()
      secondWindow.close()
      createWindowDB();
    }
  })

  

  
}


function createThirdWindow() {
  thirdWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      show: false, // set show to false initially
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        preload: path.join(__dirname, 'preloaddb.js')
      }
  });

  thirdWindow.loadFile('./src/res/ventanas/pruebasdb.html');

  thirdWindow.on('closed', function () {
      thirdWindow = null;
  });

  thirdWindow.once('ready-to-show', () => {
      thirdWindow.show();

  });


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
