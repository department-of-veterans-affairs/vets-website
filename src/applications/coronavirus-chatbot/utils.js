const disableButtons = event => {
  // if user clicked the div, bubble up to parent to disable the button
  const targetButton =
    event.target.tagName === 'BUTTON' ? event.target : event.target.parentNode;
  const siblingButtons = targetButton.parentNode.childNodes;

  for (let i = 0; i < siblingButtons.length; i++) {
    siblingButtons[i].disabled = true;
  }
};

const disableCheckboxes = () => {
  [...document.querySelectorAll('#webchat input[type="checkbox"]')].forEach(
    input => {
      const currentInput = input;
      currentInput.disabled = true;
      return currentInput;
    },
  );
};

const scrollToNewMessage = () => {
  const messages = document.getElementsByClassName(
    'webchat__stackedLayout--fromUser',
  );
  const lastMessageFromUser = messages[messages.length - 1];
  lastMessageFromUser.scrollIntoView({ behavior: 'smooth' });
};

const handleDisableAndScroll = event => {
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
  for (let i = 0; i < buttonContainers.length; i++) {
    if (buttonContainers[i].hasAttribute('tabIndex')) {
      buttonContainers[i].setAttribute('tabIndex', '-1');
    }
  }
};

const addEventListenerToButtons = () => {
  const buttons = document.getElementsByClassName('ac-pushButton');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', handleDisableAndScroll);
  }
};

export const handleButtonsPostRender = () => {
  setInterval(() => {
    removeKeyboardFocusFromContainer();
    addEventListenerToButtons();
  }, 10);
};

export const GA_PREFIX = 'chatbot';
