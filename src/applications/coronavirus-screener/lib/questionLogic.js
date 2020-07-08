// return all questions that are not disabled
export function getEnabledQuestions({ questionState }) {
  return questionState.filter(question => {
    return question.enabled ?? true;
  });
}

// sets enabled value based on question state
export function updateEnabledQuestions({ questionState, customId }) {
  return questionState.map(question => {
    // check if enabled by customId
    const customIdEnabled = question.customId?.includes(customId) ?? true;

    // check if enabled by dependsOn
    const dependsOnEnabled =
      questionState.find(el => el.id === question.dependsOn?.id)?.value ===
      question.dependsOn?.value;

    return { ...question, enabled: customIdEnabled && dependsOnEnabled };
  });
}

// check result of answers
export function checkFormResult({ questionState, customId }) {
  return getEnabledQuestions({ questionState, customId })
    .map(question => {
      const passValues = question.passValues ?? ['no'];
      return passValues.includes(question.value);
    })
    .includes(false)
    ? 'more-screening'
    : 'pass';
}

// check if all enabled questions have been answered
export function checkFormComplete({ questionState, customId }) {
  const completedQuestions = getEnabledQuestions({
    questionState,
    customId,
  }).map(question => Object.prototype.hasOwnProperty.call(question, 'value'));
  return !completedQuestions.includes(false);
}

// check the overall status of the form
export function checkFormStatus({ questionState, customId }) {
  return !checkFormComplete({ questionState, customId })
    ? 'incomplete'
    : checkFormResult({ questionState, customId });
}

// sets value to undefined for every question after given questionId
export function clearValuesAfter({ questionId, questionState }) {
  const questionIndex = questionState.findIndex(
    question => question.id === questionId,
  );
  return questionState.map((question, index) => {
    return {
      ...question,
      value: index > questionIndex ? undefined : question.value,
    };
  });
}
