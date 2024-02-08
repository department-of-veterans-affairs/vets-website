import recordEvent from 'platform/monitoring/record-event';
import { IS_RX_SKILL } from '../../chatbox/utils';

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

export const recordButtonClick = event => {
  if (
    event.target.classList.contains('webchat__suggested-action') ||
    event.target.classList.contains('webchat__suggested-action__text')
  ) {
    // This is a click event on a button
    const buttonText = event.target.innerText;
    const isRxSkill = sessionStorage.getItem(IS_RX_SKILL);
    if (isRxSkill === 'true') {
      recordEvent({
        event: 'chatbot-button-click',
        clickText: buttonText,
        topic: 'prescriptions',
      });
    } else {
      recordEvent({
        event: 'chatbot-button-click',
        clickText: buttonText,
        topic: undefined,
      });
    }
  }
};
