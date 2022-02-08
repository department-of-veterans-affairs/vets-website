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

function filterByDay(intDay, vetCenterHoursArray) {
  return vetCenterHoursArray.filter(currentData => {
    return currentData.day === intDay;
  });
}

export const standardizeDateTime = vetCenterHoursArray => {
  const output = [];
  if (
    !vetCenterHoursArray ||
    (vetCenterHoursArray && vetCenterHoursArray.length === 0)
  )
    return output;

  for (let i = 0; i < 7; i++) {
    const tempData = filterByDay(i, vetCenterHoursArray);
    if (tempData.length === 1) {
      output.push(tempData[0]);
    } else {
      const closeDay = {
        starthours: null,
        endhours: null,
        day: i,
        comment: 'Closed',
      };
      output.push(closeDay);
    }
  }
  return output;
};
