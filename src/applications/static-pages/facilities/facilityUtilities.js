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

// This removes an "x" that appears from the API data.
export const cleanPhoneNumber = number => number.replace(/[ ]?x/, '');
