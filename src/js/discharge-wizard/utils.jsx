import { questionLabels } from './config';

export const shouldShowQuestion = (currentKey, validQuestions) => {
  const lastQuestion = validQuestions[validQuestions.length - 1];
  const num = currentKey.split('_')[0];
  const nextNum = lastQuestion.split('_')[0];

  const isValid = validQuestions.indexOf(currentKey) > -1;
  const isNotFutureQuestion = parseInt(num, 10) <= parseInt(nextNum, 10);
  const formIsComplete = lastQuestion === 'END';
  return isValid && (isNotFutureQuestion || formIsComplete);
};

export const branchOfService = (key) => {
  return questionLabels['7_branchOfService'][key === 'marines' ? 'navy' : key];
};
