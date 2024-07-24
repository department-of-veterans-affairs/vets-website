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

  // Error messages for householdAssets
  cashOnHand: 'Please enter a valid dollar amount for cash on hand',
  cashInBank: 'Please provide information about your cash in bank',
  monetaryAssets: 'Please provide information about your monetary assets',
  realEstate: 'Please provide information about your real estate assets',
  vehicles: 'Please provide information about your vehicles',
  recreationalVehicles:
    'Please provide information about your recreational vehicles',
  otherAssets: 'Please provide information about your other assets',

  // Dynamic error messages for array fields in householdAssets
  realEstateRecord: index =>
    `Please provide complete information for your ${numberToWords(
      index + 1,
    )} real estate property`,
  vehicleRecord: index =>
    `Please provide complete information for your ${numberToWords(
      index + 1,
    )} vehicle`,
  recreationalVehicleRecord: index =>
    `Please provide complete information for your ${numberToWords(
      index + 1,
    )} recreational vehicle`,
  otherAssetRecord: index =>
    `Please provide complete information for your ${numberToWords(
      index + 1,
    )} other asset`,

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

    // logic for householdAssets
    if (error === 'cashOnHand') {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'cashOnHand',
      };
    }
    if (error === 'cashInBank') {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'cashInBank',
      };
    }
    if (
      error === 'monetaryAssets' ||
      error.startsWith('assets.monetaryAssets')
    ) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'monetaryValues',
      };
    }
    if (error === 'realEstate' || error.startsWith('assets.realEstate')) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'enhancedRealEstateRecords',
      };
    }
    if (error === 'vehicles' || error.startsWith('assets.automobiles')) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'vehiclesSummary',
      };
    }
    if (
      error === 'recreationalVehicles' ||
      error.startsWith('assets.recreationalVehicles')
    ) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'recreationalVehicleRecords',
      };
    }
    if (error === 'otherAssets' || error.startsWith('assets.otherAssets')) {
      return {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'otherAssetsSummary',
      };
    }

    // always return null for non-matches
    return null;
  },
};
