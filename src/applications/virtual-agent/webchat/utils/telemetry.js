import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

export default function handleTelemetry(event) {
  const { name } = event;
  if (name === 'submitSendBox') {
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'default',
      'button-click-label': 'submitSendBox',
      'button-background-color': 'gray',
      time: new Date(),
    });
  }
}
