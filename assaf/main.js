const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

const mainWindow = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js');
    }
  });

  mainWindow.loadFile('index.html'); 

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.on('ready', _ => {
  
  const name = electron.app.getName();
  const template = [
    {
      label: name,
      submenu: [{
        label: `About ${name}`,
        click: _ => {
          console.log("About menu clicked.");
        },
        role: 'about'
      }, {
       type: 'separator' 
      }, 
      {
        label: 'Quit', 
        click: _ => { app.quit()},
        accelerator: 'Cmd+Q'
      }]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
})
