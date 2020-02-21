import moment from 'moment';

export function formatBestTimeToCall(bestTime) {
  const times = [];
  if (bestTime?.morning) {
    times.push('Morning');
  }

  if (bestTime?.afternoon) {
    times.push('Afternoon');
  }

  if (bestTime?.evening) {
    times.push('Evening');
  }

  if (times.length === 1) {
    return times[0];
  } else if (times.length === 2) {
    return `${times[0]} or ${times[1]}`;
  }

  return 'Anytime during the day';
}

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
