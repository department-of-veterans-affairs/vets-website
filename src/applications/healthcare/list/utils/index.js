const sortQuestionnairesByStatus = questionnaires => {
  let data = questionnaires;
  if (!data) {
    data = [];
  }
  data.sort((first, second) => {
    const f = first.appointment.appointmentTime;
    const s = second.appointment.appointmentTime;
    return new Date(f) - new Date(s);
  });
  const completed = data.filter(f => f.questionnaireResponse?.completed);
  const toDo = data.filter(f => !f.questionnaireResponse?.completed);

  return {
    completed,
    toDo,
  };
};
export { sortQuestionnairesByStatus };
