const { ipcRenderer } = require('electron');

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  ipcRenderer.send('getWeather', city);
});

ipcRenderer.on('weatherData', (event, data) => {
  if (data && data.main && data.main.temp) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
      <h2>Pogoda w ${data.name}</h2>
      <p>Temperatura: ${data.main.temp}°C</p>
      <p>Wilgotność: ${data.main.humidity}%</p>
      <p>Opis: ${data.weather[0].description}</p>
    `;
  } else {
    console.error("Nieprawidłowe dane pogodowe", data);
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `<p style="color: red;">Błąd w nazwie miejscowości, lub miejscowość nie istnieje</p>`;
  }
});

ipcRenderer.on('weatherError', (event, errorMessage) => {
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
});
