// Link text for review & submit page errors
// key = "name" from `form.formErrors.errors`
// see src/platform/forms-system/docs/reviewErrors.md
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export default {
  hasBeenAdjudicatedBankrupt:
    "Please select whether you've declared bankruptcy (select yes or no)",

  hasRecreationalVehicle:
    'Please select whether you have a recreational vehicle (select yes or no)',
  hasVehicle: 'Please select whether you own a vehicle (select yes or no)',
  hasRealEstate: 'Please select whether you own real estate (select yes or no)',

  resolutionOption: index =>
    `Please select a resolution option for the ${numberToWords(
      index + 1,
    )} selected debt`,

  resolutionComment: index =>
    `Please enter a resolution amount for the ${numberToWords(
      index + 1,
    )} selected debt`,

  resolutionWaiverCheck: index =>
    `Please select whether you agree to the waiver for the ${numberToWords(
      index + 1,
    )} selected debt`,

  monthlyHousingExpenses:
    'Please enter a valid dollar amount for your monthly housing expenses',

  // Household Assets error messages
  monetaryAssets: 'Please provide valid information for all monetary assets',
  realEstateValue:
    'Please enter a valid dollar amount for your real estate value',
  recVehicleAmount:
    'Please enter a valid dollar amount for your recreational vehicle',
  otherAssets: 'Please provide valid information for all other assets',

  // Household Income error messages
  grossMonthlyIncome:
    'Please enter a valid dollar amount for your gross monthly income',
  additionalIncome:
    'Please provide valid information for all additional income sources',
  spouseGrossMonthlyIncome:
    'Please enter a valid dollar amount for your spouse’s gross monthly income',

  _override: (error, fullError) => {
    const errorMapping = {
      questions: {
        chapterKey: 'bankruptcyAttestationChapter',
        pageKey: 'bankruptcyHistory',
      },
      selectedDebtsAndCopays: {
        chapterKey: 'resolutionOptionsChapter',
        pageKey: 'resolutionOption',
      },
      assetsMonetaryAssets: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'monetaryValues',
      },
      assetsRealEstateValue: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'enhancedRealEstateRecords',
      },
      assetsRecVehicleAmount: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'recreationalVehicleRecords',
      },
      assetsOtherAssets: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'otherAssetsSummary',
      },
      hasRecreationalVehicle: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'recreationalVehicleRecords',
      },
      hasVehicle: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'enhancedVehicleRecords',
      },
      hasRealEstate: {
        chapterKey: 'householdAssetsChapter',
        pageKey: 'enhancedRealEstateRecords',
      },
      grossMonthlyIncome: {
        chapterKey: 'householdIncomeChapter',
        pageKey: 'grossMonthlyIncome',
      },
      additionalIncome: {
        chapterKey: 'householdIncomeChapter',
        pageKey: 'additionalIncomeValues',
      },
      spouseGrossMonthlyIncome: {
        chapterKey: 'householdIncomeChapter',
        pageKey: 'enhancedSpouseGrossMonthlyIncome',
      },
    };

    // Extract the relevant key from the error
    const errorKey = error.includes('selectedDebtsAndCopays')
      ? 'selectedDebtsAndCopays'
      : error.split('.').slice(-1)[0];

    if (errorMapping[errorKey]) {
      return errorMapping[errorKey];
    }

    if (fullError?.__errors?.some(str => str.includes('resolution amount'))) {
      return {
        chapterKey: 'resolutionOptionsChapter',
        pageKey: 'resolutionComment',
      };
    }

    // Household Income specific errors
    if (
      fullError?.__errors?.some(str => str.includes('gross monthly income'))
    ) {
      return {
        chapterKey: 'householdIncomeChapter',
        pageKey: 'grossMonthlyIncome',
      };
    }

    if (fullError?.__errors?.some(str => str.includes('additional income'))) {
      return {
        chapterKey: 'householdIncomeChapter',
        pageKey: 'additionalIncomeValues',
      };
    }

    if (
      fullError?.__errors?.some(str =>
        str.includes('spouse’s gross monthly income'),
      )
    ) {
      return {
        chapterKey: 'householdIncomeChapter',
        pageKey: 'enhancedSpouseGrossMonthlyIncome',
      };
    }

    return null;
  },
};
