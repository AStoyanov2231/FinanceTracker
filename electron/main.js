const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html from the app
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173' // Vite dev server URL
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Data file path
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'finance-data.json');

// Initialize data file
function initDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    const initialData = {
      expenses: [],
      savingGoals: []
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
  }
}

// IPC handlers for data operations
ipcMain.handle('get-data', () => {
  initDataFile();
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
});

ipcMain.handle('save-data', (event, data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  return true;
}); 