import _ from 'lodash';

{
  function toggleClass(element, className) {
    element.classList.toggle(className);
  }
  function openState(element) {
    console.log("Opening", element);
    element.setAttribute('data-state', 'open');
  }
  function closeState(element) {
    console.log("Closing", element);
    element.setAttribute('data-state', 'closed');
  }
  function isParent(element) {
    console.log("Checking if is parent ", element);
    const isParent = !element.dataset.selectedForm;
    console.log("Is a Parent?", isParent);
    return isParent;
  }
  function closeStateAndCheckChild(alternateQuestion, container) {
    console.log("Closing State and Checking Children of ", alternateQuestion);
    closeState(alternateQuestion);
    if(!isParent(alternateQuestion)){
      console.log(alternateQuestion, "is not a parent, closing state and returning");
      return;
    }
      console.log("There should be no selected form to proceed", alternateQuestion.dataset.selectedForm);
      const optionsElements = alternateQuestion.querySelectorAll('input');
      console.log('optionsElements', optionsElements);
      const options = Array.prototype.slice.call(optionsElements);
      console.log('options', options);
      options.forEach( option => {
        console.log('current option', option);
        if(option.dataset.nextQuestion){
          const alternateChild = option.dataset.nextQuestion;
          console.log('alternateChild', alternateChild);
          const alternateChildElement = container.querySelector(`[data-question=${alternateChild}]`);
          console.log('alternateChildElement', alternateChildElement);
          console.log("rinse and repeat check for alternateChildElement");
          return closeStateAndCheckChild(alternateChildElement, container);
        }
      });
  }
  function reInitWidget() {

    // Toggle the expandable apply fields
    const containers = Array.prototype.slice.call(document.querySelectorAll('.expander-container'));
    containers.forEach(container => {
      const button = container.querySelector('.expander-button');
      const openButton = container.querySelector('.apply-go-button');
      const content = container.querySelector('.expander-content');
      const radios = container.querySelectorAll('input');
      const apply = container.querySelector('#apply-now-button');
      radios.forEach(radio => {
        radio.addEventListener('click', () => {
          console.log(radio.parentNode.parentNode.dataset.question, " question answered with:", radio.value)
          if (radio.dataset.selectedForm) {
            console.log("End of form reached, can now navigate to ", radio.dataset.selectedForm);
            if (apply.dataset.state === 'closed') {
               openState(apply);
            }
            return apply.href = `/education/apply-for-education-benefits/application/${radio.dataset.selectedForm}/introduction`;
          }
          console.log("End of form not reached");

          if (apply.dataset.state === 'open') {
            console.log("Apply button visible, hiding button");
             closeState(apply);
          }
          const nextQuestion = radio.dataset.nextQuestion;
          console.log('nextQuestion', nextQuestion);
          const nextQuestionElement = container.querySelector(`[data-question=${nextQuestion}]`);
          console.log('nextQuestionElement', nextQuestionElement);
          const nextQuestionAlternate = nextQuestionElement.dataset.alternate
          console.log('nextQuestionAlternate', nextQuestionAlternate);
          const nextQuestionAlternateElement = container.querySelector(`[data-question=${nextQuestionAlternate}]`);
          // var alternateQuestionChild = container.querySelector(`[data-question=${alternateQuestion.alternate}]`);
          console.log('nextQuestionAlternateElement', nextQuestionAlternateElement);
          console.log("opening nextQuestionElement");
          openState(nextQuestionElement);
          console.log("closing nextQuestionAlternateElement")
          closeStateAndCheckChild(nextQuestionAlternateElement, container);
        });
      });
      button.addEventListener('click', () => {
        toggleClass(content, 'expander-content-closed');
        toggleClass(button, 'va-button-primary');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', reInitWidget);
}
