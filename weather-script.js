// ====== API Configuration ======
const API_KEY = 'a08b0c52cdc22c996125f5c1af95b07b'; // Free tier OpenWeatherMap API
const API_BASE = 'https://api.openweathermap.org/data/2.5';

let currentUnit = 'C';
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let currentCity = 'Bangkok';

// ====== Initialize ======
function init() {
    loadFavorites();
    fetchWeather(currentCity);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
}

// ====== Fetch Weather Data ======
async function fetchWeather(city) {
    try {
        showLoading(true);
        currentCity = city;

        // Fetch current weather
        const currentResponse = await fetch(
            `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!currentResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();

        // Fetch forecast data
        const forecastResponse = await fetch(
            `${API_BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        displayDetails(currentData);
        updateFavoritesDisplay();

    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'Failed to fetch weather data');
    } finally {
        showLoading(false);
    }
}

// ====== Display Current Weather ======
function displayCurrentWeather(data) {
    const weatherIcon = getWeatherIcon(data.weather[0].main);
    const temp = currentUnit === 'C' ? data.main.temp : (data.main.temp * 9/5) + 32;
    const feelsLike = currentUnit === 'C' ? data.main.feels_like : (data.main.feels_like * 9/5) + 32;
    const unit = currentUnit === 'C' ? '°C' : '°F';

    const html = `
        <div class="weather-main">
            <div class="weather-location">${data.name}, ${data.sys.country}</div>
            <div class="weather-icon">${weatherIcon}</div>
            <div class="weather-temp">${Math.round(temp)}${unit}</div>
            <div class="weather-description">${data.weather[0].description}</div>
            <div class="weather-feels-like">Feels like ${Math.round(feelsLike)}${unit}</div>
        </div>
        <div class="weather-info">
            <div class="info-item">
                <div class="info-label">Humidity</div>
                <div class="info-value">${data.main.humidity}%</div>
            </div>
            <div class="info-item">
                <div class="info-label">Wind Speed</div>
                <div class="info-value">${(data.wind.speed * 3.6).toFixed(1)} km/h</div>
            </div>
            <div class="info-item">
                <div class="info-label">Pressure</div>
                <div class="info-value">${data.main.pressure} hPa</div>
            </div>
            <div class="info-item">
                <div class="info-label">UV Index</div>
                <div class="info-value">${data.clouds.all}%</div>
            </div>
        </div>
    `;

    document.getElementById('currentWeather').innerHTML = html;
}

// ====== Display Forecast ======
function displayForecast(data) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    // Get forecast for next 5 days (every 24 hours)
    const dailyForecasts = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });

    Object.entries(dailyForecasts).slice(0, 5).forEach(([date, item]) => {
        const temp = currentUnit === 'C' ? item.main.temp : (item.main.temp * 9/5) + 32;
        const tempMax = currentUnit === 'C' ? item.main.temp_max : (item.main.temp_max * 9/5) + 32;
        const tempMin = currentUnit === 'C' ? item.main.temp_min : (item.main.temp_min * 9/5) + 32;
        const unit = currentUnit === 'C' ? '°C' : '°F';
        const icon = getWeatherIcon(item.weather[0].main);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${date}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">${Math.round(temp)}${unit}</div>
            <div class="forecast-temp-range">${Math.round(tempMax)}° / ${Math.round(tempMin)}°</div>
        `;
        forecastGrid.appendChild(card);
    });
}

// ====== Display Weather Details ======
function displayDetails(data) {
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const visibility = (data.visibility / 1000).toFixed(1);
    const dewpoint = (data.main.temp - ((100 - data.main.humidity) / 5)).toFixed(1);

    const html = `
        <div class="detail-card">
            <div class="detail-label">Sunrise</div>
            <div class="detail-value">🌅 ${sunrise}</div>
        </div>
        <div class="detail-card">
            <div class="detail-label">Sunset</div>
            <div class="detail-value">🌇 ${sunset}</div>
        </div>
        <div class="detail-card">
            <div class="detail-label">Visibility</div>
            <div class="detail-value">👁️ ${visibility} km</div>
        </div>
        <div class="detail-card">
            <div class="detail-label">Dew Point</div>
            <div class="detail-value">💧 ${dewpoint}°</div>
        </div>
    `;

    document.getElementById('detailsGrid').innerHTML = html;
}

// ====== Search Weather ======
function searchWeather() {
    const input = document.getElementById('searchInput').value.trim();
    if (input) {
        fetchWeather(input);
        document.getElementById('searchInput').value = '';
    }
}

// ====== Toggle Temperature Unit ======
function toggleUnit(unit) {
    currentUnit = unit;
    document.getElementById('btnCelsius').classList.toggle('active', unit === 'C');
    document.getElementById('btnFahrenheit').classList.toggle('active', unit === 'F');
    fetchWeather(currentCity);
}

// ====== Get Weather Icon ======
function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '🌋',
        'Squall': '💨',
        'Tornado': '🌪️',
    };
    return iconMap[weatherMain] || '🌤️';
}

// ====== Favorites Management ======
function loadFavorites() {
    updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    favoritesGrid.innerHTML = '';

    favorites.forEach((city, index) => {
        fetchCityWeather(city).then(data => {
            if (data) {
                const temp = currentUnit === 'C' ? data.main.temp : (data.main.temp * 9/5) + 32;
                const unit = currentUnit === 'C' ? '°C' : '°F';
                const icon = getWeatherIcon(data.weather[0].main);

                const card = document.createElement('div');
                card.className = 'favorite-card';
                card.onclick = () => fetchWeather(city);
                card.innerHTML = `
                    <div class="city-name">${data.name}</div>
                    <div>${icon}</div>
                    <div class="temp">${Math.round(temp)}${unit}</div>
                    <div class="description">${data.weather[0].description}</div>
                    <button class="remove-btn" onclick="event.stopPropagation(); removeFavorite(${index})">×</button>
                `;
                favoritesGrid.appendChild(card);
            }
        });
    });
}

async function fetchCityWeather(city) {
    try {
        const response = await fetch(
            `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching city weather:', error);
        return null;
    }
}

function showAddFavorite() {
    document.getElementById('addFavoriteModal').classList.add('show');
    document.getElementById('favoriteCityInput').focus();
}

function closeAddFavorite() {
    document.getElementById('addFavoriteModal').classList.remove('show');
    document.getElementById('favoriteCityInput').value = '';
}

function addFavoriteCity() {
    const city = document.getElementById('favoriteCityInput').value.trim();
    if (city && !favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        updateFavoritesDisplay();
        closeAddFavorite();
    }
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    updateFavoritesDisplay();
}

// ====== Error Handling ======
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('show');
}

function closeErrorModal() {
    document.getElementById('errorModal').classList.remove('show');
}

// ====== Loading Spinner ======
function showLoading(show) {
    document.getElementById('loadingSpinner').classList.toggle('show', show);
}

// Initialize on page load
window.addEventListener('load', init);
