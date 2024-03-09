const { app, BrowserWindow } = require('electron/main')
const { ipcMain} = require('electron');

let progressInterval
let secondWindow

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false
  })

  win.loadFile('index.html')

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
    show: false, // set show to false initially
  })

  secondWindow.loadFile('index1.html')

  secondWindow.on('closed', function () {
    secondWindow = null
    createThirdWindow();
  })

  secondWindow.once('ready-to-show', () => {
    secondWindow.show()
  })

  ipcMain.on('user-validated', () => {
    console.log("Mensaje 'user-validated' recibido en el proceso principal");

    secondWindow.hide();
    secondWindow.close();
    
  });

}


function createThirdWindow() {
  thirdWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      show: false // set show to false initially
  });

  thirdWindow.loadFile('index2.html');

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







