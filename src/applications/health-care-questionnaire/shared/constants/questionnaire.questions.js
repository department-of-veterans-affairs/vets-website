const reasonForVisit = {
  linkId: '01',
  text: 'What is the reason for this appointment?',
};
const reasonForVisitDescription = {
  linkId: '02',
  text:
    'Are there any additional details you’d like to share with your provider about this appointment?',
};
const lifeEvents = {
  linkId: '03',
  text:
    'Are there any other concerns or changes in your life that are affecting you or your health? (For example, a marriage, divorce, new baby, change in your job, retirement, or other medical conditions)',
};
const additionalQuestions = {
  linkId: '04',
  text:
    'Do you have a question you want to ask your provider? Please enter your most important question first.',
};
const AllQuestions = [
  reasonForVisit,
  reasonForVisitDescription,
  lifeEvents,
  additionalQuestions,
];

const getQuestionTextById = id => {
  return AllQuestions.find(f => f.linkId === id)?.text;
};

export { AllQuestions, getQuestionTextById };
