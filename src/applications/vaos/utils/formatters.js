export function formatTimeToCall(timeToCall) {
  if (timeToCall.length === 1) {
    return timeToCall[0].toLowerCase();
  } else if (timeToCall.length === 2) {
    return `${timeToCall[0].toLowerCase()} or ${timeToCall[1].toLowerCase()}`;
  }

  return `${timeToCall[0].toLowerCase()}, ${timeToCall[1].toLowerCase()}, or ${timeToCall[2].toLowerCase()}`;
}

export function formatTypeOfCare(careLabel) {
  if (careLabel.startsWith('MOVE') || careLabel.startsWith('CPAP')) {
    return careLabel;
  }

  return careLabel.slice(0, 1).toLowerCase() + careLabel.slice(1);
}
