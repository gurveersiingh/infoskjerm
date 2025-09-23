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