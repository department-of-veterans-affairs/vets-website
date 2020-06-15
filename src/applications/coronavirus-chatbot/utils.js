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

  siblingButtons.forEach((_button, index) => {
    siblingButtons[index].disabled = true;
  });
};

const disableCheckboxes = () => {
  const checkboxes = document.querySelectorAll(
    '#webchat input[type="checkbox"]',
  );
  checkboxes.forEach((_input, index) => {
    checkboxes[index].disabled = true;
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

export const handleButtonsPostRender = () => {
  setInterval(() => {
    const buttons = document.getElementsByClassName('ac-pushButton');
    buttons.forEach(button => {
      button.addEventListener('click', handleDisableAndScroll);
    });
  }, 10);
};
