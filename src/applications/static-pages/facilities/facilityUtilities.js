export const facilityApiAlertTitle =
  'There was a problem retrieving locations.';

export const facilitiesApiAlertMessage = `Our location finder isn’t working right now. We’re sorry about that. Please check back a bit later. Or, if you need location details right away, you can try searching for <a href="https://www.google.com/maps/search/?api=1&query=VA+locations+near+me" target="_blank" rel="noopener noreferrer">“VA locations near me” in Google Maps</a>.`;

export function sortFacilitiesByName(facilities) {
  facilities.sort((a, b) => {
    const aName = a.attributes.name;
    const bName = b.attributes.name;
    if (aName < bName) {
      return -1;
    }

    if (aName > bName) {
      return 1;
    }

    return 0;
  });
  return facilities;
}
