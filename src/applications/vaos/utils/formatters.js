import { first, includes, last, replace, split, toLower } from 'lodash';
import moment from 'moment';

export function formatTimeToCall(timeToCall) {
  if (timeToCall.length === 1) {
    return timeToCall[0].toLowerCase();
  } else if (timeToCall.length === 2) {
    return `${timeToCall[0].toLowerCase()} or ${timeToCall[1].toLowerCase()}`;
  }

  return `${timeToCall[0].toLowerCase()}, ${timeToCall[1].toLowerCase()}, or ${timeToCall[2].toLowerCase()}`;
}

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
  const sanitizedOperatingHours = replace(operatingHours, ' ', '');

  // Escape early if it is 'Sunrise - Sunset'.
  if (toLower(sanitizedOperatingHours) === 'sunrise-sunset') {
    return 'All Day';
  }

  // Derive if the hours are closed.
  const isClosed =
    sanitizedOperatingHours === '-' ||
    includes(toLower(sanitizedOperatingHours), 'close');

  // Escape early if it is '-' or 'Closed'.
  if (isClosed) {
    return 'Closed';
  }

  // Derive the opening and closing hours.
  const hours = split(sanitizedOperatingHours, '-');
  const openingHour = first(hours);
  const closingHour = last(hours);

  // Format the hours based on 'hmmA' format.
  let formattedOpeningHour = moment(openingHour, 'hmmA').format('h:mma');
  let formattedClosingHour = moment(closingHour, 'hmmA').format('h:mma');

  // Attempt to format the hours based on 'h:mmA' if theere's a colon.
  if (includes(openingHour, ':')) {
    formattedOpeningHour = moment(openingHour, 'h:mmA').format('h:mma');
  }
  if (includes(closingHour, ':')) {
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
