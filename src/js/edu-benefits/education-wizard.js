function toggleClass(element, className) {
  element.classList.toggle(className);
}
function openState(element) {
  element.setAttribute('data-state', 'open');
}
function closeState(element) {
  element.setAttribute('data-state', 'closed');
  const selectionElement = element.querySelector('input:checked');
  if (selectionElement) {
    selectionElement.checked = false;
  }
}
function closeStateAndCheckChild(alternateQuestion, container) {
  const selectionElement = alternateQuestion.querySelector('input:checked');
  if (!selectionElement) {
    return closeState(alternateQuestion);
  }
  const descendentQuestion = selectionElement.dataset.nextQuestion;
  if (!descendentQuestion) {
    return closeState(alternateQuestion);
  }
  const descendentElement = container.querySelector(`[data-question=${descendentQuestion}]`);
  closeStateAndCheckChild(descendentElement, container);
  return closeState(alternateQuestion);
}
function reInitWidget() {
  const container = document.querySelector('.wizard-container');
  const button = container.querySelector('.wizard-button');
  const content = container.querySelector('.wizard-content');
  const apply = container.querySelector('#apply-now-button');
  const warning = container.querySelector('#transfer-warning');
  content.addEventListener('change', (e) => {
    const radio = e.target;
    const otherChoice = radio.dataset.alternate;
    const otherNextQuestion = container.querySelector(`#${otherChoice}`).dataset.nextQuestion;
    if (otherNextQuestion) {
      const otherNextQuestionElement = container.querySelector(`[data-question=${otherNextQuestion}`);
      closeStateAndCheckChild(otherNextQuestionElement, container);
    }
    if (!radio.dataset.selectedForm && (apply.dataset.state === 'open')) {
      closeState(apply);
    }
    if (radio.dataset.selectedForm) {
      if (apply.dataset.state === 'closed') {
        openState(apply);
      }
      if ((warning.dataset.state === 'open') && (!radio.id !== 'create-non-transfer')) {
        closeState(warning);
      }
      if ((warning.dataset.state === 'closed') && (radio.id === 'create-non-transfer')) {
        openState(warning);
      }
      apply.href = `/education/apply-for-education-benefits/application/${radio.dataset.selectedForm}/introduction`;
    }
    if (radio.dataset.nextQuestion) {
      const nextQuestion = radio.dataset.nextQuestion;
      const nextQuestionElement = container.querySelector(`[data-question=${nextQuestion}]`);
      openState(nextQuestionElement);
      nextQuestionElement.querySelector('input').focus();
    }
  });
  button.addEventListener('click', () => {
    toggleClass(content, 'wizard-content-closed');
    toggleClass(button, 'va-button-primary');
  });
}

document.addEventListener('DOMContentLoaded', reInitWidget);
