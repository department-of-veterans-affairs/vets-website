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
      return closeState(alternateQuestion);;
    }
    const descendentElement = container.querySelector(`[data-question=${descendentQuestion}]`);
    closeStateAndCheckChild(descendentElement, container);
    return closeState(alternateQuestion);
  }
  function reInitWidget() {
    const container = document.querySelector('.expander-container');
    const button = container.querySelector('.expander-button');
    const content = container.querySelector('.expander-content');
    const radios = container.querySelectorAll('input');
    const apply = container.querySelector('#apply-now-button');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.dataset.selectedForm) {
          if (apply.dataset.state === 'closed') {
            openState(apply);
          }
          apply.href = `/education/apply-for-education-benefits/application/${radio.dataset.selectedForm}/introduction`;
          return false;
        }

        if (apply.dataset.state === 'open') {
          closeState(apply);
        }
        const nextQuestion = radio.dataset.nextQuestion;
        const nextQuestionElement = container.querySelector(`[data-question=${nextQuestion}]`);
        const nextQuestionAlternate = nextQuestionElement.dataset.alternate;
        const nextQuestionAlternateElement = container.querySelector(`[data-question=${nextQuestionAlternate}]`);
        nextQuestionElement.focus();
        openState(nextQuestionElement);
        return closeStateAndCheckChild(nextQuestionAlternateElement, container);
      });
    });
    button.addEventListener('click', () => {
      toggleClass(content, 'expander-content-closed');
      toggleClass(button, 'va-button-primary');
    });
  }

  document.addEventListener('DOMContentLoaded', reInitWidget);
