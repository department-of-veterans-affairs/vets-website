import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import { scroller } from 'react-scroll';

// return only enabled questions
export function getEnabledQuestions(questionState) {
  return questionState.filter(question => question.enabled ?? true);
}

// check result of answers
export function checkFormResult(questionState) {
  return getEnabledQuestions(questionState)
    .map(question => {
      const passValues = question.passValues ?? ['no'];
      return passValues.includes(question.value);
    })
    .includes(false)
    ? 'fail'
    : 'pass';
}

// check if all enabled questions have been answered
export function checkFormComplete(questionState) {
  const completedQuestions = getEnabledQuestions(questionState).map(question =>
    Object.prototype.hasOwnProperty.call(question, 'value'),
  );
  return !completedQuestions.includes(false);
}

// check the overall status of the form
export function checkFormStatus(questionState) {
  return !checkFormComplete(questionState)
    ? 'incomplete'
    : checkFormResult(questionState);
}

// record completion event to GA
export function recordCompletion({ formState, setFormState }) {
  if (formState.status !== 'incomplete' && formState.completed === false) {
    recordEvent({
      event: 'covid-screening-tool-result-displayed',
      'screening-tool-result': formState.result,
      'time-to-complete': moment().unix() - formState.startTime,
    });
    setFormState({ ...formState, completed: true });
  }
}

// scroller usage based on https://github.com/department-of-veterans-affairs/veteran-facing-services-tools/blob/master/packages/formation-react/src/components/CollapsiblePanel/CollapsiblePanel.jsx
export function scrollTo(name) {
  scroller.scrollTo(
    name,
    window.VetsGov.scroll || {
      duration: 500,
      delay: 2,
      smooth: true,
    },
  );
}
