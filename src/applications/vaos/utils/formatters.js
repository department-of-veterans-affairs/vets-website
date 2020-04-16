import moment from 'moment';

export function formatTypeOfCare(careLabel) {
  if (careLabel.startsWith('MOVE') || careLabel.startsWith('CPAP')) {
    return careLabel;
  }

  return careLabel.slice(0, 1).toLowerCase() + careLabel.slice(1);
}

export const formatOperatingHours = operatingHours => {
  if (!operatingHours) return operatingHours;
  // Remove all whitespace.
  const sanitizedOperatingHours = operatingHours.replace(' ', '');

  // Escape early if it is 'Sunrise - Sunset'.
  if (sanitizedOperatingHours.toLowerCase() === 'sunrise-sunset') {
    return 'All Day';
  }

  // Derive if the hours are closed.
  const isClosed =
    sanitizedOperatingHours === '-' ||
    sanitizedOperatingHours.toLowerCase().includes('close');

  // Escape early if it is '-' or 'Closed'.
  if (isClosed) {
    return 'Closed';
  }

  // Derive the opening and closing hours.
  const hours = sanitizedOperatingHours.split('-');
  const openingHour = hours[0];
  const closingHour = hours[hours.length - 1];

  // Format the hours based on 'hmmA' format.
  let formattedOpeningHour = moment(openingHour, 'hmmA').format('h:mma');
  let formattedClosingHour = moment(closingHour, 'hmmA').format('h:mma');

  // Attempt to format the hours based on 'h:mmA' if theere's a colon.
  if (openingHour.includes(':')) {
    formattedOpeningHour = moment(openingHour, 'h:mmA').format('h:mma');
  }
  if (closingHour.includes(':')) {
    formattedClosingHour = moment(closingHour, 'h:mmA').format('h:mma');
  }

  // Derive the formatted operating hours.
  const formattedOperatingHours = `${formattedOpeningHour} - ${formattedClosingHour}`;

  // Return original string if invalid date.
  if (formattedOperatingHours.search(/Invalid date/i) === 0) {
    return operatingHours;
  }

  // Return the formatted operating hours.
  return formattedOperatingHours;
};

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sentenceCase(str) {
  return str
    .split(' ')
    .map((word, index) => {
      if (/^[^a-z]*$/.test(word)) {
        return word;
      }

      if (index === 0) {
        return `${word.charAt(0).toUpperCase()}${word
          .substr(1, word.length - 1)
          .toLowerCase()}`;
      }

      return word.toLowerCase();
    })
    .join(' ');
}

export function lowerCase(str = '') {
  return str
    .split(' ')
    .map(word => {
      if (/^[^a-z]*$/.test(word)) {
        return word;
      }

      return word.toLowerCase();
    })
    .join(' ');
}

/**
 * Returns formatted address from facility details object
 *
 * @param {*} facility - facility details object
 */
export function formatFacilityAddress(facility) {
  return `${facility.address.physical.address1} ${
    facility.address.physical.city
  }, ${facility.address.physical.state} ${facility.address.physical.zip}`;
}
