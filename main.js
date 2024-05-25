const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 545,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setResizable(false); 
  win.setFullScreenable(false); 

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('getWeather', async (event, city) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=KLUCZ_API&units=metric&lang=pl`;
    console.log(`Fetching weather data from: ${url}`);
    
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    event.reply('weatherData', data);
  } catch (error) {
    console.error(error);
    event.reply('weatherError', 'Nie udało się pobrać danych pogodowych.');
  }
});