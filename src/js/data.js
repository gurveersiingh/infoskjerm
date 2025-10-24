const STOP_PLACE_ID = "NSR:StopPlace:60257"; // Example: Lerkendal, Trondheim, from https://stoppested.entur.org/?stopPlaceId=NSR:StopPlace:60257
const API_URL = "https://api.entur.io/journey-planner/v3/graphql";
const CLIENT_NAME = "hypehouse_infoskjerm";

export async function fetchDepartures() {
  const query = `
  {
    stopPlace(id: "${STOP_PLACE_ID}") {
      name
      estimatedCalls(timeRange: 72100, numberOfDepartures: 10) {
        realtime
        aimedDepartureTime
        expectedDepartureTime
        destinationDisplay {
          frontText
        }
        serviceJourney {
          journeyPattern {
            line {
              publicCode
              name
            }
          }
        }
      }
    }
  }
  `;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ET-Client-Name": CLIENT_NAME
    },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return data.data.stopPlace.estimatedCalls;
}

export async function fetchElectricityPrices() {
  // Get today's date in the format required by the API (YYYY/MM-DD)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const apiUrl = `https://www.hvakosterstrommen.no/api/v1/prices/${year}/${month}-${day}_NO3.json`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Add 25% VAT to the prices and return current and next few hours
    const currentHour = today.getHours();
    const relevantPrices = data
      .filter(entry => {
        const entryHour = new Date(entry.time_start).getHours();
        return entryHour >= currentHour && entryHour < currentHour + 6; // Show current + next 5 hours
      })
      .map(entry => ({
        ...entry,
        NOK_per_kWh_with_vat: (entry.NOK_per_kWh * 1.25 * 100).toFixed(0) // Add 25% VAT and convert to øre
      }));
    
    return relevantPrices;
  } catch (error) {
    console.error('Error fetching electricity prices:', error);
    throw error;
  }
}

export async function fetchWeather() {
  // Using OpenWeatherMap API for Holtermannsveg 25, Trondheim
  const API_KEY = 'demo'; // You'll need to get a free API key from openweathermap.org
  const lat = 63.4305; // Trondheim latitude
  const lon = 10.3951; // Trondheim longitude
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=no`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Return mock data for demo purposes
    return {
      temperature: 8,
      description: 'delvis skyet',
      humidity: 75,
      windSpeed: 12,
      icon: '02d'
    };
  }
}