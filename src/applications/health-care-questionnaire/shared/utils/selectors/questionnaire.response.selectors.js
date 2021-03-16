const getStatus = questionnaireResponses => {
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

  return (
    questionnaireResponses[questionnaireResponses.length - 1]?.status || null
  );
};

export { getStatus };
