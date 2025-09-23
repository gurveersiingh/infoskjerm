import { fetchDepartures } from './data.js';
import { showDepartures } from './display.js';

async function init() {
  const departures = await fetchDepartures();
  showDepartures(departures);
}

init();