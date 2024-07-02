// Link text for review & submit page errors
// key = "name" from `form.formErrors.errors`
// see src/platform/forms-system/docs/reviewErrors.md
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export default {
  hasBeenAdjudicatedBankrupt:
    "Please select whether you've declared bankruptcy (select yes or no)",
  resolutionOption: index => {
    return `Please select a resolution option for the ${numberToWords(
      index + 1,
    )} selected debt`;
  },
  resolutionComment: index => {
    return `Please enter a resolution amount for the ${numberToWords(
      index + 1,
    )} selected debt`;
  },
  resolutionWaiverCheck: index => {
    return `Please select whether you agree to the waiver for the ${numberToWords(
      index + 1,
    )} selected debt`;
  },
  monthlyHousingExpenses:
    'Please enter a valid dollar amount for your monthly housing expenses',
  _override: (error, fullError) => {
    if (error === 'questions') {
      return {
        chapterKey: 'bankruptcyAttestationChapter',
        pageKey: 'bankruptcyHistory',
      };
    }
    if (error.includes('selectedDebtsAndCopays')) {
      return {
        chapterKey: 'resolutionOptionsChapter',
        pageKey: 'resolutionOption',
      };
    }
    if (fullError?.__errors.some(str => str.includes('resolution amount'))) {
      return {
        chapterKey: 'resolutionOptionsChapter',
        pageKey: 'resolutionComment',
      };
    }
    // always return null for non-matches
    return null;
  },
};
