import moment from 'moment';
import { forIn, upperFirst } from 'lodash';
import { mapboxToken } from 'platform/utilities/facilities-and-mapbox';

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

export const buildHours = (hours, shortDay = false) => {
  const builtHours = [];
  const shortDays = {
    Monday: 'Mon.',
    Tuesday: 'Tue.',
    Wednesday: 'Wed.',
    Thursday: 'Thu.',
    Friday: 'Fri.',
    Saturday: 'Sat.',
    Sunday: 'Sun.',
  };

  forIn(hours, (value, key) => {
    let day = upperFirst(key);
    if (shortDay) {
      day = shortDays[day];
    }

    let dayHours;
    if (value === 'Closed' || value === '24/7') {
      dayHours = value;
    } else {
      const hour = value.split('-').map(time => moment(time, 'hmm A'));
      dayHours = hour.map(time => time.format('h:mm A')).join(' – ');
    }

    builtHours.push(`${day}: ${dayHours}`);
  });

  return builtHours;
};

const formatAMorPM = hour => {
  let result = '';

  if (hour === 24) {
    result = 'a.m.';
  } else {
    result = hour >= 12 ? 'p.m.' : 'a.m.';
  }

  return result;
};

const formatHour = hour => {
  let result = hour;

  if (hour === 24 || hour === 12) {
    result = 12;
  } else {
    result %= 12;
  }

  return result;
};

export const formatHours = hours => {
  // Eg starthours: 700  endhours: 1730
  let hour = Number(
    hours.toString().length > 3
      ? hours.toString().substring(0, 2)
      : hours.toString().substring(0, 1),
  );

  const minutes = Number(
    hours.toString().length > 3
      ? hours.toString().substring(2, 4)
      : hours.toString().substring(1, 4),
  );

  if (
    hours.toString().length >= 3 &&
    hour >= 0 &&
    hour <= 24 &&
    minutes >= 0 &&
    minutes <= 60
  ) {
    const AMorPM = formatAMorPM(hour);
    hour = formatHour(hour);
    return `${hour}:${
      minutes === 0 ? `${minutes}${minutes}` : `${minutes}`
    } ${AMorPM}`;
  }

  return null;
};

export const convertMetersToMiles = meters =>
  Math.round(meters * 0.000621371192);

export const distancesToNearbyVetCenters = (
  originalVetCenterCoordinates,
  nearbyVetCentersCoordinates,
) => {
  const originalVetCenterCoordinatesParam = originalVetCenterCoordinates.join(
    ',',
  );
  const startingCoordinatesParam = nearbyVetCentersCoordinates
    .map(loc => loc.join(','))
    .join(';');
  let sourcesParam = '';

  for (let i = 1; i <= nearbyVetCentersCoordinates.length; i += 1) {
    sourcesParam = `${sourcesParam}${i !== 1 ? ';' : ''}${i}`;
  }

  return `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${originalVetCenterCoordinatesParam};${startingCoordinatesParam}?sources=${sourcesParam}&destinations=0&annotations=distance,duration&access_token=${mapboxToken}`;
};
