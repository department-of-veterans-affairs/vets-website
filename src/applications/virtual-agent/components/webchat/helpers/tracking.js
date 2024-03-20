import recordEvent from 'platform/monitoring/record-event';

export const handleTelemetry = event => {
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
};

export const recordRxSession = isRXSkill => {
  if (isRXSkill === 'true') {
    recordEvent({
      event: 'api_call',
      'api-name': 'Enter Chatbot Rx Skill',
      'api-status': 'successful',
    });
  }
};
