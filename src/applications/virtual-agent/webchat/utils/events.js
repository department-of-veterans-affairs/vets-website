export function sendWindowEventWithActionPayload(eventType, action) {
  const event = new Event(eventType);
  event.data = action.payload.activity;
  window.dispatchEvent(event);
}
