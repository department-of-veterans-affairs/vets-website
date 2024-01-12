import recordEvent from 'platform/monitoring/record-event';
import { IS_RX_SKILL } from '../../chatbox/utils';

export const handleTelemetry = event => {
  const { name } = event;
  //   console.log('Event name is: ' + name);
  if (name === 'submitSendBox') {
    // console.log('Triggered submitSendBox!');
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
    // console.log('<==Enter Chatbot Rx Skill!==>');
    recordEvent({
      event: 'api_call',
      'api-name': 'Enter Chatbot Rx Skill',
      'api-status': 'successful',
    });
  }
};

export const recordButtonClick = event => {
  if (event.target.classList.contains('webchat__suggested-action')) {
    // This is a click event on a button
    const buttonText = event.target.innerText;
    // console.log('<==QuickReply Button Clicked with label: ', buttonText);
    const isRxSkill = sessionStorage.getItem(IS_RX_SKILL);
    if (isRxSkill) {
      recordEvent({
        event: 'chatbot-button-click',
        // TO-DO: Change clickText to click_text according to GA Implement Request
        clickText: buttonText,
        topic: 'prescriptions',
      });
    } else {
      recordEvent({
        event: 'chatbot-button-click',
        // TO-DO: Change clickText to click_text according to GA Implement Request
        clickText: buttonText,
      });
    }
  }
};
