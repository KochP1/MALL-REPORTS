const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Cargar la aplicación Flask
    mainWindow.setMenuBarVisibility(false); // ocultar la barra de menú
    mainWindow.loadURL('http://localhost:5000');

    // Abrir las herramientas de desarrollo
    // mainWindow.webContents.openDevTools();

    // Manejar el cierre de la ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


app.on('ready', () => {
    // Ejecutar el servidor Flask
    exec('python3 run.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al iniciar Flask: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error en Flask: ${stderr}`);
            return;
        }
        console.log(`Flask iniciado: ${stdout}`);
    });

    createWindow();
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});