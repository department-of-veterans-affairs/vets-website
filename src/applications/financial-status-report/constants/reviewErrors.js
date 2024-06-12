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
  _override: error => {
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
    // always return null for non-matches
    return null;
  },
};
