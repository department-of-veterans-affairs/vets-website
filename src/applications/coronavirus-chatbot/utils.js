import recordEvent from 'platform/monitoring/record-event';

export const GA_PREFIX = 'chatbot';

export const recordLinkClicks = () => {
  const root = document.getElementById('webchat');
  root.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'a') {
      recordEvent({
        event: `${GA_PREFIX}-resource-link-click`,
        'error-key': undefined,
      });
    }
  });
};

const disableButtons = event => {
  // if user clicked the div, bubble up to parent to disable the button
  const targetButton =
    event.target.tagName.toLowerCase() === 'button'
      ? event.target
      : event.target.parentNode;
  const siblingButtons = targetButton.parentNode.childNodes;

  siblingButtons.forEach(button => {
    const currentButton = button;
    currentButton.disabled = true;
  });
};

const disableCheckboxes = () => {
  document
    .querySelectorAll('#webchat input[type="checkbox"]')
    .forEach(input => {
      const currentInput = input;
      currentInput.disabled = true;
    });
};

const scrollToNewMessage = () => {
  const messages = document.getElementsByClassName(
    'webchat__stackedLayout--fromUser',
  );
  const lastMessageFromUser = messages[messages.length - 1];
  lastMessageFromUser.scrollIntoView({ behavior: 'smooth' });
};

const handleDisableAndScroll = event => {
  recordEvent({
    event: `${GA_PREFIX}-button-click`,
    'error-key': undefined,
  });

  disableButtons(event);
  disableCheckboxes();
  setTimeout(() => {
    scrollToNewMessage();
  }, 700);
};

/*
https://github.com/department-of-veterans-affairs/covid19-chatbot/issues/98
Bot framework renders button containers with tab index 0. This method sets
tab index to -1 so button containers have javascript-only focus.
*/
const removeKeyboardFocusFromContainer = () => {
  const buttonContainers = document.getElementsByClassName('ac-adaptiveCard');
  buttonContainers.forEach(buttonContainer => {
    if (buttonContainer.hasAttribute('tabIndex')) {
      buttonContainer.setAttribute('tabIndex', '-1');
    }
  });
};

const addEventListenerToButtons = () => {
  const buttons = document.getElementsByClassName('ac-pushButton');
  buttons.forEach(button => {
    button.addEventListener('click', handleDisableAndScroll);
  });
};

export const handleButtonsPostRender = () => {
  setInterval(() => {
    removeKeyboardFocusFromContainer();
    addEventListenerToButtons();
  }, 10);
};
