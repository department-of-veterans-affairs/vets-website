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
