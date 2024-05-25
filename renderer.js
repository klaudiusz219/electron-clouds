const { ipcRenderer } = require('electron');

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  ipcRenderer.send('getWeather', city);
});

ipcRenderer.on('weatherData', (event, data) => {
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = '';

  if (data && data.list && data.city) {
    const cityName = data.city.name;

    weatherInfo.innerHTML += `<h2><center>Prognoza pogody w ${cityName} na 5 dni</center></h2>`;

    for (let i = 0; i < data.list.length; i += 8) { 
      const dayData = data.list[i];
      const date = new Date(dayData.dt * 1000).toLocaleDateString();
      const temp = dayData.main.temp;
      const description = dayData.weather[0].description;

      weatherInfo.innerHTML += `
        <div>
          <h3>${date}</h3>
          <p>Temperatura: ${temp}°C</p>
          <p>Opis: ${description}</p>
        </div>
      `;
      weatherInfo.innerHTML += `<br>`;

    }
  } else {
    console.error("Nieprawidłowe dane pogodowe", data);
    weatherInfo.innerHTML = `<p style="color: red;">Błąd w nazwie miejscowości, lub miejscowość nie istnieje</p>`;
  }
});

ipcRenderer.on('weatherError', (event, errorMessage) => {
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
});
