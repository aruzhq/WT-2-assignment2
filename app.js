const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

require('dotenv').config();

app.use(express.static('public'));

app.get('/', async (req, res) => {
  const city = req.query.city || 'Astana';
  const weatherApiKey = process.env.OPENWEATHER_API_KEY;
  const newsApiKey = process.env.GNEWS_API_KEY;

  try {
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    const weatherData = weatherResponse.data;

    if (weatherData.cod !== 200) {
      throw new Error(weatherData.message);
    }

    const weatherIcon = weatherData.weather[0].icon;
    const weatherDescription = weatherData.weather[0].description;

    const newsResponse = await axios.get(`https://gnews.io/api/v4/search?q=${city}&token=${newsApiKey}`);
    const articles = newsResponse.data.articles;
    let newsRows = '';
    articles.forEach(article => {
      newsRows += `
        <div class="news-item">
          <a href="${article.url}" target="_blank"><h3>${article.title}</h3></a>
          <p>${article.description}</p>
        </div>
      `;
    });

    const airQualityResponse = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${weatherApiKey}`);
    const airQualityData = airQualityResponse.data;

    const result = `
      <html>
      <head>
        <title>Weather, news, and air quality in ${city}</title>
        <link rel="stylesheet" href="/styles.css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Weather, news, and air quality in ${city}, ${weatherData.sys.country}</h1>
            <form action="/" method="get" class="search-form">
              <input type="text" id="cityInput" name="city" placeholder="Enter city" required>
              <button type="submit">Search</button>
            </form>
          </header>

          <div class="content">
            <div class="weather card">
              <h2>Current weather</h2>
              <p><img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDescription}"> ${weatherDescription}</p>
              <p>Temperature: <strong>${weatherData.main.temp}°C</strong></p>
              <p>Feels like: <strong>${weatherData.main.feels_like}°C</strong></p>
              <p>Humidity: <strong>${weatherData.main.humidity}%</strong></p>
              <p>Pressure: <strong>${weatherData.main.pressure} hPa</strong></p>
              <p>Wind speed: <strong>${weatherData.wind.speed} m/s</strong></p>
              <p>Coordinates: <strong>(${weatherData.coord.lat}, ${weatherData.coord.lon})</strong></p>
              <p>Rain volume: <strong>${weatherData.rain ? weatherData.rain['1h'] : 0} mm</strong></p>
              <div id="map" style="height: 500px; margin-top: 10px;"></div>
            </div>

            <div class="air-quality card">
              <h2>Air quality</h2>
              <p>AQI: <strong>${airQualityData.list[0].main.aqi}</strong></p>
              <p>Pollutants:</p>
              <ul class="air-quality-list">
                <li>CO: <strong>${airQualityData.list[0].components.co} µg/m³</strong></li>
                <li>NO: <strong>${airQualityData.list[0].components.no} µg/m³</strong></li>
                <li>NO2: <strong>${airQualityData.list[0].components.no2} µg/m³</strong></li>
                <li>O3: <strong>${airQualityData.list[0].components.o3} µg/m³</strong></li>
                <li>SO2: <strong>${airQualityData.list[0].components.so2} µg/m³</strong></li>
                <li>PM2.5: <strong>${airQualityData.list[0].components.pm2_5} µg/m³</strong></li>
                <li>PM10: <strong>${airQualityData.list[0].components.pm10} µg/m³</strong></li>
                <li>NH3: <strong>${airQualityData.list[0].components.nh3} µg/m³</strong></li>
              </ul>
            </div>

            <div class="news card">
              <h2>Latest news</h2>
              ${newsRows}
            </div>
          </div>

          <footer>
            <div class="footer-links">
              <a href="/">Home | Aruzhan Nurlanova BDA-2301</a>
            </div>
          </footer>
        </div>

        <script>
          var map = L.map('map').setView([${weatherData.coord.lat}, ${weatherData.coord.lon}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          var marker = L.marker([${weatherData.coord.lat}, ${weatherData.coord.lon}]).addTo(map);
          marker.bindPopup('Location: ${city}').openPopup();
        </script>

        <script>
          function showError(message) {
            const errorModal = document.createElement('div');
            errorModal.style.position = 'fixed';
            errorModal.style.top = '0';
            errorModal.style.left = '0';
            errorModal.style.width = '100%';
            errorModal.style.height = '100%';
            errorModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            errorModal.style.color = 'white';
            errorModal.style.display = 'flex';
            errorModal.style.alignItems = 'center';
            errorModal.style.justifyContent = 'center';
            errorModal.style.zIndex = '9999';
            errorModal.innerHTML = \`
              <div style="text-align: center; background: #333; padding: 20px; border-radius: 10px;">
                <h2>Invalid city name</h2>
                <p>\${message}</p>
                <button onclick="document.body.removeChild(this.parentElement.parentElement)">OK</button>
              </div>
            \`;
            document.body.appendChild(errorModal);
          }

          if (window.location.search.includes('error')) {
            showError("The city name you entered is not valid. Please try again.");
          }
        </script>

        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          header {
            text-align: center;
            margin-bottom: 20px;
          }
          header h1 {
            color: #2c3e50;
          }
          .search-form {
            margin-top: 10px;
          }
          .search-form input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: calc(70% - 22px);
            margin-right: 10px;
          }
          .search-form button {
            padding: 10px;
            background-color: #2980b9;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .search-form button:hover {
            background-color: #3498db;
          }
          .content {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            flex-wrap: wrap;
          }
          .card {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            flex: 1 1 30%;
            min-width: 300px;
            margin-bottom: 20px;
          }
          .weather img {
            vertical-align: middle;
            margin-right: 10px;
          }
          .air-quality {
            text-align: center;
          }
          .news-item {
            margin-bottom: 15px;
          }
          .news-item h3 {
            margin: 0;
            font-size: 1.2em;
            color: #2980b9;
            transition: color 0.3s;
          }
          .news-item h3:hover {
            color: #3498db;
          }
          .air-quality-list {
            list-style-type: none; 
            padding: 0; 
          }
          footer {
            margin: 20px 0;
            padding: 10px;
            background-color: #f1f1f1;
            text-align: center;
            border-top: 1px solid #ccc;
          }
          footer a {
            color: #2980b9;
            text-decoration: none;
            transition: color 0.3s;
          }
          footer a:hover {
            color: #3498db;
          }
        </style>
      </body>
      </html>
    `;

    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.redirect('/?error=true');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
