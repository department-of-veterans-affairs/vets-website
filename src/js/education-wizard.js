{
  function reInitWidget() {
    function toggleClass(element, className) {
      element.classList.toggle(className);
    }
    function setState(element, newState) {
      element.setAttribute('data-state', newState);
    }

    // Toggle the expandable apply fields
    const containers = Array.prototype.slice.call(document.querySelectorAll('.expander-container'));
    containers.forEach((container) => {
      const questionContainer = container.querySelector('.expander-content-inner');
      const questions = container.querySelectorAll('.expander-content-question');
      const button = container.querySelector('.expander-button');
      const openButton = container.querySelector('.apply-go-button');
      const content = container.querySelector('.expander-content');
      const radios = container.querySelectorAll('input');
      //map of all possible questions
      const answers = {
        'new-application': {
          value: false,
          alternative: 'existing-application',
          next: 'is-veteran',
        },
        'existing-application': {
          value: false,
          alternative: 'new-application',
          next: 'is-sponsored',
        },
        'is-veteran': {
          value: false,
          alternative: 'is-not-veteran',
          next: 'national-call-to-service',
        },
        'is-not-veteran': {
          value: false,
          alternative: 'is-veteran',
          next: 'sponsor-status',
        }
      };
      //need to write a check that will update the view when the chain is updated
      var updateList = function(){
        // reduce view
      }
      radios.forEach((radio)=>{
        radio.addEventListener('click', () => {
          // questions.forEach((question) => {
          //this must be recursive so that next questions get updated
          //should it store the current true, set alternative to false and closed, then set current next to closed (and answers to false), if either subs subs answer is true, repeat and new next to open
            console.log('this answer', radio.value);
            answers[radio.value].value = true;
            answers[answers[radio.value].alternative].value = false;
            //check if a nextValue to reveal questions or apply button
            const otherNext = answers[answers[radio.value].alternative].next;
            console.log('otherNext', otherNext);
            const otherNextElement = container.querySelector(`#${otherNext}`);
            console.log('otherNextElement', otherNextElement);
            const otherNextQuestion = otherNextElement.parentNode.parentNode;
            console.log('otherNextQuestion', otherNextQuestion);
            setState(otherNextQuestion, 'closed');
            const next = answers[radio.value].next
            console.log('next', next);
            const nextQuestion = container.querySelector(`#${next}`).parentNode.parentNode;
            console.log('nextQuestion', nextQuestion);
            setState(nextQuestion, 'open');
            // console.log(answers);
          // })
        });
      });
      button.addEventListener('click', () => {
        toggleClass(content, 'expander-content-closed');
        toggleClass(button, 'va-button-primary');
      });
      openButton.addEventListener('click', () => {
        const selectedForm = content.querySelector('input[name="form-selection"]:checked');

        // if (selectedForm) {
        //   location.assign(`/education/apply-for-education-benefits/application/${selectedForm.value}/introduction`);
        // }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', reInitWidget);
}
