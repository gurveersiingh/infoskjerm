import { fetchDepartures, fetchElectricityPrices, fetchWeather } from './data.js';
import { showDepartures, showElectricityPrices, showClockAndWeather } from './display.js';

function showLoading() {
  const container = document.getElementById('departures');
  container.innerHTML = '<div class="loading">Laster avgangstider...</div>';
}

function showError(message) {
  const container = document.getElementById('departures');
  container.innerHTML = `<div class="error">${message}</div>`;
}

function showElectricityLoading() {
  const container = document.getElementById('electricity-prices');
  container.innerHTML = '<div class="loading">Laster strømpriser...</div>';
}

function showElectricityError(message) {
  const container = document.getElementById('electricity-prices');
  container.innerHTML = `<div class="error">${message}</div>`;
}

function showWeatherLoading() {
  const container = document.getElementById('clock-weather');
  container.innerHTML = '<div class="loading">Laster værdata...</div>';
}

function showWeatherError(message) {
  const container = document.getElementById('clock-weather');
  container.innerHTML = `<div class="error">${message}</div>`;
}

async function updateDepartures() {
  try {
    showLoading();
    const departures = await fetchDepartures();
    
    if (!departures || departures.length === 0) {
      showError('Ingen avgangstider funnet for denne stoppestedet.');
      return;
    }
    
    showDepartures(departures);
  } catch (err) {
    console.error('Failed to fetch departures:', err);
    showError('Kunne ikke laste avgangstider. Sjekk internettforbindelsen.');
  }
}

async function updateElectricityPrices() {
  try {
    showElectricityLoading();
    const prices = await fetchElectricityPrices();
    
    if (!prices || prices.length === 0) {
      showElectricityError('Ingen strømpriser funnet for i dag.');
      return;
    }
    
    showElectricityPrices(prices);
  } catch (err) {
    console.error('Failed to fetch electricity prices:', err);
    showElectricityError('Kunne ikke laste strømpriser. Sjekk internettforbindelsen.');
  }
}

async function updateWeather() {
  try {
    showWeatherLoading();
    const weather = await fetchWeather();
    showClockAndWeather(weather);
  } catch (err) {
    console.error('Failed to fetch weather:', err);
    showWeatherError('Kunne ikke laste værdata. Sjekk internettforbindelsen.');
  }
}

// Initial load
updateDepartures();
updateElectricityPrices();
updateWeather();

// Update every 30 seconds
setInterval(updateDepartures, 30000);
setInterval(updateElectricityPrices, 30000);
setInterval(updateWeather, 300000); // Update weather every 5 minutes