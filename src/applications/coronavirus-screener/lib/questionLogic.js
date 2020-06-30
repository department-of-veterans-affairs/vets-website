// return only enabled questions
export function getEnabledQuestions({ questionState, customId }) {
  return questionState.filter(question => {
    let customEnabled;
    if (Object.prototype.hasOwnProperty.call(question, 'customId')) {
      if (question.customId === customId) {
        customEnabled = true;
      } else {
        customEnabled = false;
      }
    } else {
      customEnabled = true;
    }
    const questionEnabled = question.enabled ?? true;
    return customEnabled && questionEnabled;
  });
}

// check result of answers
export function checkFormResult(questionState) {
  return getEnabledQuestions(questionState)
    .map(question => {
      const passValues = question.passValues ?? ['no'];
      return passValues.includes(question.value);
    })
    .includes(false)
    ? 'more-screening'
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
