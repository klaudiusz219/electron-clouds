const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false 
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('getWeather', async (event, city) => {
  try {
    const fetchWeather = async (city) => {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=API_KEY&units=metric`);
      return response.json();
    };

    const data = await fetchWeather(city);
    event.reply('weatherData', data);
  } catch (error) {
    console.error(error);
    event.reply('weatherError', 'Nie udało się pobrać danych pogodowych.');
  }
});
