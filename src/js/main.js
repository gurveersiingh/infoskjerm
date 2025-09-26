import { fetchDepartures } from './data.js';
import { showDepartures } from './display.js';

async function updateDepartures() {
  try {
    const departures = await fetchDepartures();
    showDepartures(departures);
  } catch (err) {
    console.error('Failed to fetch departures:', err);
    document.getElementById('departures').textContent = 'Could not load departures.';
  }
}

// Initial load
updateDepartures();

// Update every 30 seconds
setInterval(updateDepartures, 30000);