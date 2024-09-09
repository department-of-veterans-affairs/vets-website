import {
  ERROR_MAPPING,
  questionErrors,
  personalDataErrors,
  incomeAndBenefitsErrors,
  expensesErrors,
  assetsErrors,
  additionalDataErrors,
  resolutionErrors,
} from '../constants/errorMessages';

const _override = (error, fullError) => {
  const [category, key] = error.split('.');

  if (category === 'questions' && ERROR_MAPPING.questions[key]) {
    return ERROR_MAPPING.questions[key];
  }

  if (error === 'selectedDebtsAndCopays') {
    if (fullError && fullError.__errors && Array.isArray(fullError.__errors)) {
      const hasResolutionAmountError = fullError.__errors.some(
        err => typeof err === 'string' && err.includes('resolution amount'),
      );

      if (hasResolutionAmountError) {
        return {
          chapterKey: 'resolutionOptionsChapter',
          pageKey: 'resolutionComment',
        };
      }
    }
    return ERROR_MAPPING.selectedDebtsAndCopays;
  }

  return null;
};

export default {
  ...Object.entries(questionErrors).reduce(
    (acc, [key, value]) => ({ ...acc, [`questions.${key}`]: value }),
    {},
  ),
  ...Object.entries(personalDataErrors).reduce(
    (acc, [key, value]) => ({ ...acc, [`personalData.${key}`]: value }),
    {},
  ),
  ...incomeAndBenefitsErrors,
  ...expensesErrors,
  ...assetsErrors,
  ...additionalDataErrors,
  ...resolutionErrors,
  monthlyHousingExpenses: expensesErrors.monthlyHousingExpenses,
  _override,
};
