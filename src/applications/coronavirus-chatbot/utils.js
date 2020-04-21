const disableButtons = event => {
  // if user clicked the div, bubble up to parent to disable the button
  const targetButton =
    event.target.tagName === 'BUTTON' ? event.target : event.target.parentNode;
  const siblingButtons = targetButton.parentNode.childNodes;

  for (let i = 0; i < siblingButtons.length; i++) {
    siblingButtons[i].disabled = true;
  }
};

export const watchForButtonClicks = () => {
  setInterval(() => {
    const buttons = document.getElementsByClassName('ac-pushButton');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', disableButtons);
    }
  }, 10);
};
