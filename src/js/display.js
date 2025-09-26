export function showDepartures(departures) {
  const container = document.getElementById('departures');
  container.innerHTML = '';
  departures.forEach(dep => {
    const time = new Date(dep.expectedDepartureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.gap = '20px';
    div.style.fontFamily = 'monospace';
    div.innerHTML = `
      <span style="width: 1fr; display: inline-block;">Linje ${dep.serviceJourney.journeyPattern.line.publicCode}</span>
      <span style="width: 2fr; display: inline-block;">${dep.destinationDisplay.frontText}</span>
      <span style="width: 1fr; display: inline-block;">${time}</span>
    `;
    container.appendChild(div);
  });
}