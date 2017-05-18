{
  function toggleClass(element, className) {
    element.classList.toggle(className);
  }
  function openState(element) {
    element.setAttribute('data-state', 'open');
  }
  function closeState(element) {
    element.setAttribute('data-state', 'closed');
  }
  function isParent(element) {
    const isParentElement = !element.dataset.selectedForm;
    return isParentElement;
  }
  function closeStateAndCheckChild(alternateQuestion, container) {
    closeState(alternateQuestion);
    if (!isParent(alternateQuestion)) {
      return;
    }
    const optionsElements = alternateQuestion.querySelectorAll('input');
    const options = Array.prototype.slice.call(optionsElements);
    options.forEach(option => {
      if (option.dataset.nextQuestion) {
        const alternateChild = option.dataset.nextQuestion;
        const alternateChildElement = container.querySelector(`[data-question=${alternateChild}]`);
        return closeStateAndCheckChild(alternateChildElement, container);
      }
      return false;
    });
  }
  function reInitWidget() {
    const container = document.querySelector('.expander-container');
    const button = container.querySelector('.expander-button');
    const content = container.querySelector('.expander-content');
    const radios = container.querySelectorAll('input');
    const apply = container.querySelector('#apply-now-button');
    radios.forEach(radio => {
      radio.addEventListener('click', () => {
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
}
