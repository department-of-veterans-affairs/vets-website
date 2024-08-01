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
  // Household Assets error messages
  monetaryAssets: 'Please provide valid information for all monetary assets',
  realEstateValue:
    'Please enter a valid dollar amount for your real estate value',
  recVehicleAmount:
    'Please enter a valid dollar amount for your recreational vehicle',
  otherAssets: 'Please provide valid information for all other assets',

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
    if (error.startsWith('assets.monetaryAssets')) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'monetaryValues',
      };
    }
    if (error === 'assets.realEstateValue') {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'enhancedRealEstateRecords',
      };
    }
    if (error === 'assets.recVehicleAmount') {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'recreationalVehicleRecords',
      };
    }
    if (error.startsWith('assets.otherAssets')) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'otherAssetsSummary',
      };
    }
    // always return null for non-matches
    return null;
  },
};
