export function showDepartures(departures) {
  const container = document.getElementById('departures');
  container.innerHTML = '';
  departures.forEach(dep => {
    const div = document.createElement('div');
    div.textContent = `Line ${dep.serviceJourney.journeyPattern.line.publicCode} to ${dep.destinationDisplay.frontText} at ${dep.expectedDepartureTime}`;
    container.appendChild(div);
  });
}