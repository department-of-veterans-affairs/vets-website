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
  cashOnHand: 'Please enter a valid dollar amount for cash on hand',
  cashInBank: 'Please enter a valid dollar amount for cash in bank',
  monetaryAssets: 'Please provide valid information for all monetary assets',
  realEstateValue:
    'Please enter a valid dollar amount for your real estate value',
  recVehicleAmount:
    'Please enter a valid dollar amount for your recreational vehicle',
  automobiles: 'Please provide valid information for all vehicles',
  otherAssets: 'Please indicate if you have any other assets',

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

    // Household Assets
    if (error === 'assets.cashOnHand') {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'cashOnHand',
      };
    }
    if (error === 'assets.cashInBank') {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'cashInBank',
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

    if (
      error === 'questions.hasVehicle' ||
      error.includes('automobiles') ||
      (fullError?.assets?.automobiles &&
        fullError.assets.automobiles.some(
          auto => auto.value === null || auto.value === undefined,
        ))
    ) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'vehiclesSummary',
      };
    }

    // always return null for non-matches
    return null;
  },
};
