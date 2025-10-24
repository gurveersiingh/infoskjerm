export function showDepartures(departures) {
  const container = document.getElementById('departures');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add headers
  const headers = ['Linje & Destinasjon', 'Dra hjemmefra'];
  headers.forEach(headerText => {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'departure-header';
    headerDiv.textContent = headerText;
    container.appendChild(headerDiv);
  });
  
  // Add departure rows
  departures.forEach(dep => {
    const time = new Date(dep.expectedDepartureTime).toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Calculate when to leave home based on Lerkendal stop
    const lineCode = dep.serviceJourney.journeyPattern.line.publicCode;
    let walkTime = 3; // Default 3 minutes
    
    // Determine walk time based on Lerkendal stop
    if (lineCode.includes('1')) {
      walkTime = 3; // Lerkendal 1: 3 min
    } else if (lineCode.includes('2')) {
      walkTime = 2; // Lerkendal 2: 2 min
    } else if (lineCode.includes('3')) {
      walkTime = 4; // Lerkendal 3: 4 min
    } else if (lineCode.includes('4')) {
      walkTime = 3; // Lerkendal 4: 3 min
    }
    
    // Calculate departure time from home
    const departureTime = new Date(dep.expectedDepartureTime);
    const leaveHomeTime = new Date(departureTime.getTime() - (walkTime * 60000));
    const leaveHomeTimeStr = leaveHomeTime.toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Combined line, destination and time cell
    const lineDestTimeDiv = document.createElement('div');
    lineDestTimeDiv.className = 'departure-cell line-destination-time-cell';
    lineDestTimeDiv.innerHTML = `
      <div class="line-destination-content">
        <strong>Linje ${lineCode}</strong><br>${dep.destinationDisplay.frontText}
      </div>
      <div class="time-content">
        <strong>${time}</strong>
      </div>
    `;
    container.appendChild(lineDestTimeDiv);
    
    // Leave home time cell with color coding
    const leaveHomeDiv = document.createElement('div');
    leaveHomeDiv.className = 'departure-cell leave-home-cell';
    
    // Calculate time until departure
    const now = new Date();
    const timeUntilLeave = Math.floor((leaveHomeTime.getTime() - now.getTime()) / 60000); // minutes
    
    let timeClass = '';
    let timeStatus = '';
    
    if (timeUntilLeave < 0) {
        // Time has passed - red
        timeClass = 'time-passed';
        timeStatus = 'Passert';
    } else if (timeUntilLeave <= 2) {
        // Now or 1-2 min - yellow
        timeClass = 'time-urgent';
        timeStatus = timeUntilLeave === 0 ? 'Nå!' : `${timeUntilLeave} min`;
    } else if (timeUntilLeave <= 5) {
        // 3-5 min - green
        timeClass = 'time-good';
        timeStatus = `${timeUntilLeave} min`;
    } else {
        // More than 5 min - normal
        timeClass = 'time-normal';
        timeStatus = `${timeUntilLeave} min`;
    }
    
    leaveHomeDiv.innerHTML = `
      <strong class="${timeClass}">${leaveHomeTimeStr}</strong><br>
      <small class="${timeClass}">${timeStatus} (${walkTime} min gange)</small>
    `;
    container.appendChild(leaveHomeDiv);
  });
  
  // Add last updated timestamp
  const lastUpdated = document.createElement('div');
  lastUpdated.className = 'last-updated';
  lastUpdated.textContent = `Sist oppdatert: ${new Date().toLocaleTimeString('no-NO')}`;
  container.appendChild(lastUpdated);
}

export function showElectricityPrices(prices) {
  const container = document.getElementById('electricity-prices');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add section title
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Strømpriser (Trondheim)';
  container.appendChild(title);
  
  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'electricity-content';
  
  // Add headers
  const headers = ['Tid', 'Pris (øre/kWh)'];
  headers.forEach(headerText => {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'electricity-header';
    headerDiv.textContent = headerText;
    contentWrapper.appendChild(headerDiv);
  });
  
  // Add price rows
  prices.forEach(price => {
    const startTime = new Date(price.time_start).toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const endTime = new Date(price.time_end).toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const timeRange = `${startTime}-${endTime}`;
    
    // Determine if this is current hour
    const now = new Date();
    const priceStart = new Date(price.time_start);
    const isCurrentHour = now.getHours() === priceStart.getHours() && 
                         now.getDate() === priceStart.getDate();
    
    // Time cell
    const timeDiv = document.createElement('div');
    timeDiv.className = `electricity-cell ${isCurrentHour ? 'current-hour' : ''}`;
    timeDiv.textContent = timeRange;
    contentWrapper.appendChild(timeDiv);
    
    // Price cell
    const priceDiv = document.createElement('div');
    priceDiv.className = `electricity-cell ${isCurrentHour ? 'current-hour' : ''}`;
    priceDiv.textContent = `${price.NOK_per_kWh_with_vat} øre`;
    contentWrapper.appendChild(priceDiv);
  });
  
  // Add note about VAT
  const note = document.createElement('div');
  note.className = 'electricity-note';
  note.textContent = 'Priser inkluderer 25% mva. | Kilde: hvakosterstrommen.no';
  contentWrapper.appendChild(note);
  
  // Add content wrapper to container
  container.appendChild(contentWrapper);
}

export function showClockAndWeather(weather) {
  const container = document.getElementById('clock-weather');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add section title
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Klokke & Vær - Holtermannsveg 25';
  container.appendChild(title);
  
  // Create main content container
  const contentDiv = document.createElement('div');
  contentDiv.className = 'clock-weather-content';
  
  // Clock section
  const clockDiv = document.createElement('div');
  clockDiv.className = 'clock-section';
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'current-time';
  timeDiv.id = 'current-time';
  
  const dateDiv = document.createElement('div');
  dateDiv.className = 'current-date';
  dateDiv.id = 'current-date';
  
  clockDiv.appendChild(timeDiv);
  clockDiv.appendChild(dateDiv);
  
  // Weather section
  const weatherDiv = document.createElement('div');
  weatherDiv.className = 'weather-section';
  
  const weatherIcon = document.createElement('div');
  weatherIcon.className = 'weather-icon';
  weatherIcon.innerHTML = `🌤️`; // Fallback icon
  
  const weatherInfo = document.createElement('div');
  weatherInfo.className = 'weather-info';
  
  const tempDiv = document.createElement('div');
  tempDiv.className = 'temperature';
  tempDiv.textContent = `${weather.temperature}°C`;
  
  const descDiv = document.createElement('div');
  descDiv.className = 'weather-description';
  descDiv.textContent = weather.description;
  
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'weather-details';
  detailsDiv.innerHTML = `
    <span>💧 ${weather.humidity}%</span>
    <span>💨 ${weather.windSpeed} km/h</span>
  `;
  
  weatherInfo.appendChild(tempDiv);
  weatherInfo.appendChild(descDiv);
  weatherInfo.appendChild(detailsDiv);
  
  weatherDiv.appendChild(weatherIcon);
  weatherDiv.appendChild(weatherInfo);
  
  contentDiv.appendChild(clockDiv);
  contentDiv.appendChild(weatherDiv);
  container.appendChild(contentDiv);
  
  // Update clock immediately
  updateClock();
  
  // Update clock every second
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const timeElement = document.getElementById('current-time');
  const dateElement = document.getElementById('current-date');
  
  if (timeElement) {
    timeElement.textContent = now.toLocaleTimeString('no-NO', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }
  
  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('no-NO', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}