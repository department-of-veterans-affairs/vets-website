export function formatTimeToCall(timeToCall) {
  if (timeToCall.length === 1) {
    return timeToCall[0].toLowerCase();
  } else if (timeToCall.length === 2) {
    return `${timeToCall[0].toLowerCase()} or ${timeToCall[1].toLowerCase()}`;
  }

  return `${timeToCall[0].toLowerCase()}, ${timeToCall[1].toLowerCase()}, or ${timeToCall[2].toLowerCase()}`;
}
