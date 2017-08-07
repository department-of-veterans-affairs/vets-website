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
  const transferWarning = container.querySelector('#transfer-warning');
  const nctsWarning = container.querySelector('#ncts-warning');

  function resetForm() {
    const selections = Array.from(container.querySelectorAll('input:checked'));
    // eslint-disable-next-line no-return-assign, no-param-reassign
    selections.forEach(selection => selection.checked = false);
  }
  apply.addEventListener('click', resetForm);

  content.addEventListener('change', (e) => {
    const radio = e.target;
    const otherChoices = radio.dataset.alternate.split(' ');
    otherChoices.forEach((otherChoice) => {
      const otherNextQuestion = container.querySelector(`#${otherChoice}`).dataset.nextQuestion;
      if (otherNextQuestion) {
        const otherNextQuestionElement = container.querySelector(`[data-question=${otherNextQuestion}]`);
        closeStateAndCheckChild(otherNextQuestionElement, container);
      }
    });

    if ((apply.dataset.state === 'open') && !radio.dataset.selectedForm) {
      closeState(apply);
    }
    if ((transferWarning.dataset.state === 'open') && (radio.id !== 'create-non-transfer')) {
      closeState(transferWarning);
    }
    if ((nctsWarning.dataset.state === 'open') && (radio.id !== 'is-ncts')) {
      closeState(nctsWarning);
    }

    if (radio.dataset.selectedForm) {
      if (apply.dataset.state === 'closed') {
        openState(apply);
      }

      if ((transferWarning.dataset.state === 'closed') && (radio.id === 'create-non-transfer')) {
        openState(transferWarning);
      }
      if ((nctsWarning.dataset.state === 'closed') && (radio.id === 'is-ncts')) {
        openState(nctsWarning);
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

  // Ensure form is reset on page load to prevent unexpected behavior
  resetForm();
}

document.addEventListener('DOMContentLoaded', reInitWidget);
