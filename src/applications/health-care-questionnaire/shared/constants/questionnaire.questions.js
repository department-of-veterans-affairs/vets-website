const QUESTION_IDS = {
  REASON_FOR_VISIT: '01',
  REASON_FOR_VISIT_DESCRIPTION: '02',
  LIFE_EVENTS: '03',
  ADDITIONAL_QUESTIONS: '04',
};

const reasonForVisit = {
  linkId: QUESTION_IDS.REASON_FOR_VISIT,
  text: 'What is the reason for this appointment?',
};
const reasonForVisitDescription = {
  linkId: QUESTION_IDS.REASON_FOR_VISIT_DESCRIPTION,
  text:
    'Are there any additional details you’d like to share with your provider about this appointment?',
};
const lifeEvents = {
  linkId: QUESTION_IDS.LIFE_EVENTS,
  text:
    'Are there any other concerns or changes in your life that are affecting you or your health? (For example, a marriage, divorce, new baby, change in your job, retirement, or other medical conditions)',
};
const additionalQuestions = {
  linkId: QUESTION_IDS.ADDITIONAL_QUESTIONS,
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

export { AllQuestions, getQuestionTextById, QUESTION_IDS };
