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

export const board = (formValues) => {
  const prevAppType = ['1', '4'].indexOf(formValues['10_prevApplicationType']) > -1;
  const noPrevApp = formValues['8_prevApplication'] === '2';
  const preAppDateBefore = formValues['9_prevApplicationYear'] === '1';
  const courtMartial = formValues['6_courtMartial'] === '2';
  const transgender = formValues['1_reason'] === '5';
  const intention = formValues['3_intention'] === '1';
  const prevAppTypeBoard = ['2', '3'].indexOf(formValues['10_prevApplicationType']) > -1;
  const boardObj = () => {
    if (['1', '3', '4'].indexOf(formValues['10_prevApplicationType']) > -1) {
      return { name: 'Board for Correction of Naval Records (BCNR)', abbr: 'BCNR' };
    }

    return { name: 'Board for Correction of Military Records (BCMR)', abbr: 'BCMR' };
  };

  if (noPrevApp || preAppDateBefore || prevAppType) {
    if (courtMartial || transgender || intention) {
      return boardObj;
    }
    return { name: 'Discharge Review Board (DRB)', abbr: 'DRB' };
  } else if (prevAppTypeBoard) {
    return boardObj;
  }
  return null;
};

export const formNumber = (formValues) => {
  const boardData = board(formValues);
  if (boardData && boardData.abbr === 'DRB') {
    return 293;
  }
  return 149;
};
