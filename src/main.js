const electron = require('electron');
const path = require('path');
//const { setup: setupPushReceiver } = require('electron-push-receiver');

const {app, BrowserWindow, Menu, Tray, clipboard, globalShortcut} = electron;
const STACK_SIZE = 5; //Max items that will be saved on the stack

let mainWindow = null;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        resizeable: true,
        frame: true
        // webPreferences: {
        //   preload: path.join(__dirname, 'preload.js')
        // }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`); 

    // Call it before 'did-finish-load' with mainWindow a reference to your window
    //setupPushReceiver(mainWindow.webContents);

    mainWindow.openDevTools();

    mainWindow.on('close', _ => {
        mainWindow = null;
    });
}



function checkClipboardForChange(clipboard, onChange) {
    let cache = clipboard.readText();
    let latest = null;

    setInterval(_ => {
        latest = clipboard.readText();
        if (latest !== cache) {
            cache = latest;
            onChange(cache);
        }
    }, 500);
}

function addToStack(item, stack) {
    return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack );
}



app.on('ready', _ => {
    const tray = new Tray(path.join('src', 'images', 'tray.png'));
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
    
    const contextMenu = Menu.buildFromTemplate(template);
    let stack = [];
    Menu.setApplicationMenu(contextMenu);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Win 10 Spike App');

    createWindow();
    checkClipboardForChange(clipboard, text => {
        stack = addToStack(text, stack);
        console.log("stack: ", stack);
    });

    globalShortcut.register('Ctrl+Alt+Cmd+D', _ => {
        mainWindow.webContents.send('capture', app.getPath('pictures'));
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});





