import MarkdownIt from 'markdown-it';
import markdownitLinkAttributes from 'markdown-it-link-attributes';
import { recordButtonClick } from './gaEvents';

const disableButtons = event => {
  // if user clicked the div, bubble up to parent to disable the button
  const targetButton =
    event.target.tagName.toLowerCase() === 'button'
      ? event.target
      : event.target.parentNode;
  const siblingButtons = targetButton.parentNode.childNodes;

  siblingButtons.forEach((_button, index) => {
    siblingButtons[index].disabled = true;
    siblingButtons[index].setAttribute('aria-disabled', 'true');
  });
};

const disableCheckboxes = () => {
  const checkboxes = [
    ...document.querySelectorAll('#webchat input[type="checkbox"]'),
  ];
  checkboxes.forEach((_input, index) => {
    checkboxes[index].disabled = true;
  });
};

const scrollToNewMessage = () => {
  const messages = [
    ...document.getElementsByClassName('webchat__stacked-layout--from-user'),
  ];
  const lastMessageFromUser = messages[messages.length - 1];
  lastMessageFromUser.scrollIntoView({ behavior: 'smooth' });
  lastMessageFromUser.setAttribute('tabindex', '-1');
  lastMessageFromUser.focus();
};

const handleDisableAndScroll = event => {
  recordButtonClick();
  disableButtons(event);
  disableCheckboxes();
  setTimeout(() => {
    scrollToNewMessage();
  }, 700);
};

export const handleButtonsPostRender = () => {
  setInterval(() => {
    const buttons = [...document.getElementsByClassName('ac-pushButton')];
    buttons.forEach(button => {
      button.addEventListener('click', handleDisableAndScroll);
    });
  }, 10);
};

export const markdownRenderer = MarkdownIt({
  html: true,
}).use(markdownitLinkAttributes, {
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
});
