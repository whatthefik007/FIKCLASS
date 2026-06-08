# 🌦️ Weather Dashboard

**Real-time Weather Information with 5-Day Forecast**

## ✨ Features

### 🌍 Weather Information:
- 📍 Current weather for any city worldwide
- 🌡️ Temperature (Celsius/Fahrenheit toggle)
- 💨 Wind speed, humidity, pressure
- 👁️ Visibility, dew point
- 🌅 Sunrise & sunset times
- ☁️ Weather description with emoji icons

### 📅 Forecast:
- 5-day weather forecast
- Daily min/max temperatures
- Weather conditions for each day

### ⭐ Favorites:
- Save favorite cities
- Quick access to frequently checked cities
- Click to instantly view weather
- Remove favorites anytime

### 🎨 User Experience:
- Beautiful gradient UI
- Responsive design (mobile, tablet, desktop)
- Loading spinner during data fetch
- Error handling for invalid cities
- Temperature unit toggle (°C / °F)

## 🚀 How to Use

### 1. Access the Dashboard:
```
https://github.com/whatthefik007/fikclass/blob/main/weather.html
```

### 2. Search for City:
- Enter city name in search box
- Click "🔍 Search" or press Enter
- View current weather and forecast

### 3. Add to Favorites:
- Click "+ Add City" button
- Enter city name
- Click "Add"
- Favorites appear as clickable cards

### 4. Change Temperature Unit:
- Click "°C Celsius" or "°F Fahrenheit"
- All temperatures update automatically

### 5. View Details:
- Current weather card shows:
  - Temperature & feels like
  - Humidity, wind speed, pressure
  - Cloud coverage
- Weather details section shows:
  - Sunrise & sunset times
  - Visibility distance
  - Dew point

## 🛠️ Technical Details

### API Used:
- **OpenWeatherMap API** (Free tier)
- Base URL: `https://api.openweathermap.org/data/2.5`
- Endpoints:
  - `/weather` - Current weather
  - `/forecast` - 5-day forecast

### Key Functions:
```javascript
fetchWeather(city)          // Fetch weather data
displayCurrentWeather()     // Show current conditions
displayForecast()          // Show 5-day forecast
addFavoriteCity()          // Add city to favorites
toggleUnit(unit)           // Switch °C / °F
```

### Data Points Displayed:
- Temperature, Feels Like
- Humidity, Wind Speed
- Atmospheric Pressure
- Visibility, Dew Point
- Sunrise & Sunset
- Weather Description

## 📱 Responsive Breakpoints:
- **Desktop**: Full grid layout (3+ columns)
- **Tablet**: 2-column grid
- **Mobile**: Single column

## 🔗 Example Cities to Try:
```
🇹🇭 Bangkok, Tokyo, Singapore, Hong Kong
🇬🇧 London, Paris, Berlin
🇺🇸 New York, Los Angeles, Chicago
🇦🇺 Sydney, Melbourne
🇯🇵 Tokyo, Osaka
```

## 💾 Storage:
- Favorites saved in **LocalStorage**
- Persists across browser sessions
- Can be cleared anytime

## 🎯 Next Steps:
- Add air quality index (AQI)
- Add weather alerts
- Add map integration
- Add hourly forecast
- Add historical weather data

## 📝 Notes:
- Free API key included (limited requests)
- For production: Get your own API key from [OpenWeatherMap](https://openweathermap.org/api)
- Internet connection required
- Weather data updates every few minutes

---

**Created by:** whatthefik007  
**Date:** 2026
