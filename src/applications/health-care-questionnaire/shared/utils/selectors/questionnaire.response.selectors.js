const getQuestionnaireResponse = questionnaireResponses => {
  if (!questionnaireResponses) {
    return null;
  }

  if (!questionnaireResponses.length) {
    return null;
  }
  questionnaireResponses.sort((first, second) => {
    const f = first.submittedOn;
    const s = second.submittedOn;
    return new Date(f) - new Date(s);
  });

  return questionnaireResponses[questionnaireResponses.length - 1] || null;
};

const getStatus = questionnaireResponses => {
  return getQuestionnaireResponse(questionnaireResponses)?.status || null;
};

export { getStatus, getQuestionnaireResponse };
