const sortQuestionnairesByStatus = questionnaires => {
  let data = questionnaires;
  if (!data) {
    data = [];
  }
  const completed = data.filter(f => f.questionnaireResponse?.completed);
  const toDo = data.filter(f => !f.questionnaireResponse?.completed);

  return {
    completed,
    toDo,
  };
};
export { sortQuestionnairesByStatus };
