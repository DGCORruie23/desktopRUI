const { app, BrowserWindow } = require('electron/main')
const { sequelize } = require('./models')
const postControllers = require('./controllers/postControllers')
const { ipcMain } = require('electron')

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
      nodeIntegration : true,
      enableRemoteModule: true
    }
  })

  win.loadFile('./src/res/ventanas/splashScreen.html')

  const INCREMENT = 0.03
  const INTERVAL_DELAY = 50 // ms

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
      createThirdWindow();
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
        preload: path.join(__dirname, 'preload.js')
      }
  });

  thirdWindow.loadFile('./src/res/ventanas/ventanaCaptura.html');

  thirdWindow.on('closed', function () {
      thirdWindow = null;
  });

  thirdWindow.once('ready-to-show', () => {
      thirdWindow.show();

  });

  sequelize.sync().then(()=>{
    console.log('connection synced')
  })
  postControllers.newPost();
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














