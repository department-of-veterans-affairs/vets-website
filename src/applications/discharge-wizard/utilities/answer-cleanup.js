import { questionsToClearMap } from '../constants';

export const cleanUpAnswers = (
  responsesInStore,
  updateCleanedFormStore,
  currentQuestionName,
) => {
  const responsesToClean = responsesInStore;
  if (questionsToClearMap[currentQuestionName].length) {
    for (const question of questionsToClearMap[currentQuestionName]) {
      responsesToClean[question] = null;
    }
    updateCleanedFormStore(responsesToClean);
  }
};
