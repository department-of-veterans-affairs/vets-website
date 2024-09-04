import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const ERROR_MESSAGES = {
  BANKRUPTCY:
    "Please select whether you've declared bankruptcy (select yes or no)",
  RECREATIONAL_VEHICLE:
    'Please select whether you have a recreational vehicle (select yes or no)',
  VEHICLE: 'Please select whether you own a vehicle (select yes or no)',
  REAL_ESTATE: 'Please select whether you own real estate (select yes or no)',
  MONTHLY_HOUSING:
    'Please enter a valid dollar amount for your monthly housing expenses',
  MONETARY_ASSETS: 'Please provide valid information for all monetary assets',
  REAL_ESTATE_VALUE:
    'Please enter a valid dollar amount for your real estate value',
  REC_VEHICLE_AMOUNT:
    'Please enter a valid dollar amount for your recreational vehicle',
  OTHER_ASSETS: 'Please provide valid information for all other assets',
};

export const CHAPTER_KEYS = {
  VETERAN_INFORMATION: 'veteranInformationChapter',
  HOUSEHOLD_ASSETS: 'householdAssetsChapter',
  HOUSEHOLD_INCOME: 'householdIncomeChapter',
  DEBTS_AND_COPAYS: 'debtsAndCopaysChapter',
  HOUSEHOLD_EXPENSES: 'householdExpensesChapter',
  ADDITIONAL_INFORMATION: 'additionalInformationChapter',
  BANKRUPTCY_ATTESTATION: 'bankruptcyAttestationChapter',
  RESOLUTION_OPTIONS: 'resolutionOptionsChapter',
};

export const PAGE_KEYS = {
  MONETARY_ASSETS: 'monetaryAssets',
  REAL_ESTATE_INFORMATION: 'realEstateInformation',
  VEHICLE_INFORMATION: 'vehicleInformation',
  OTHER_ASSETS: 'otherAssets',
  SPOUSE_INFORMATION: 'spouseInformation',
  PERSONAL_INFORMATION: 'personalInformation',
  CONTACT_INFORMATION: 'contactInformation',
  DEPENDENT_INFORMATION: 'dependentInformation',
  EMPLOYMENT_INFORMATION: 'employmentInformation',
  ADDITIONAL_INCOME: 'additionalIncome',
  SPOUSE_ADDITIONAL_INCOME: 'spouseAdditionalIncome',
  SPOUSE_BENEFITS: 'spouseBenefits',
  SELECTED_DEBTS: 'selectedDebts',
  EXPENSES_SUMMARY: 'expensesSummary',
  CREDIT_CARD_BILLS: 'creditCardBills',
  UTILITIES: 'utilities',
  OTHER_EXPENSES: 'otherExpenses',
  BANKRUPTCY_INFORMATION: 'bankruptcyInformation',
  ADDITIONAL_COMMENTS: 'additionalComments',
};

const ERROR_MAPPING = {
  assets: {
    monetaryAssets: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.MONETARY_ASSETS,
    },
    realEstateValue: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.REAL_ESTATE_INFORMATION,
    },
    recVehicleAmount: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.VEHICLE_INFORMATION,
    },
    otherAssets: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.OTHER_ASSETS,
    },
    automobiles: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.VEHICLE_INFORMATION,
    },
  },
  personalData: {
    spouseFullName: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.SPOUSE_INFORMATION,
    },
    veteranFullName: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.PERSONAL_INFORMATION,
    },
    dateOfBirth: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.PERSONAL_INFORMATION,
    },
    veteranContactInformation: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.CONTACT_INFORMATION,
    },
    dependents: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.DEPENDENT_INFORMATION,
    },
    employmentHistory: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.EMPLOYMENT_INFORMATION,
    },
  },
  additionalIncome: {
    addlIncRecords: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.ADDITIONAL_INCOME,
    },
    spouse: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.SPOUSE_ADDITIONAL_INCOME,
    },
  },
  benefits: {
    spouseBenefits: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.SPOUSE_BENEFITS,
    },
  },
  selectedDebtsAndCopays: {
    chapterKey: CHAPTER_KEYS.DEBTS_AND_COPAYS,
    pageKey: PAGE_KEYS.SELECTED_DEBTS,
  },
  expenses: {
    expenseRecords: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
      pageKey: PAGE_KEYS.EXPENSES_SUMMARY,
    },
    creditCardBills: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
      pageKey: PAGE_KEYS.CREDIT_CARD_BILLS,
    },
  },
  utilityRecords: {
    chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
    pageKey: PAGE_KEYS.UTILITIES,
  },
  otherExpenses: {
    chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
    pageKey: PAGE_KEYS.OTHER_EXPENSES,
  },
  additionalData: {
    bankruptcy: {
      chapterKey: CHAPTER_KEYS.BANKRUPTCY_ATTESTATION,
      pageKey: PAGE_KEYS.BANKRUPTCY_INFORMATION,
    },
    additionalComments: {
      chapterKey: CHAPTER_KEYS.ADDITIONAL_INFORMATION,
      pageKey: PAGE_KEYS.ADDITIONAL_COMMENTS,
    },
  },
};

const ReviewErrors = {
  hasBeenAdjudicatedBankrupt: ERROR_MESSAGES.BANKRUPTCY,
  hasRecreationalVehicle: ERROR_MESSAGES.RECREATIONAL_VEHICLE,
  hasVehicle: ERROR_MESSAGES.VEHICLE,
  hasRealEstate: ERROR_MESSAGES.REAL_ESTATE,

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

  monthlyHousingExpenses: ERROR_MESSAGES.MONTHLY_HOUSING,
  monetaryAssets: ERROR_MESSAGES.MONETARY_ASSETS,
  realEstateValue: ERROR_MESSAGES.REAL_ESTATE_VALUE,
  recVehicleAmount: ERROR_MESSAGES.REC_VEHICLE_AMOUNT,
  otherAssets: ERROR_MESSAGES.OTHER_ASSETS,

  _override: (error, fullError) => {
    if (typeof error !== 'string') {
      return null;
    }

    const errorParts = error.split('.');
    let currentMapping = ERROR_MAPPING;

    for (const part of errorParts) {
      if (currentMapping[part]) {
        currentMapping = currentMapping[part];
      } else {
        break;
      }
    }

    if (
      typeof currentMapping === 'object' &&
      currentMapping.chapterKey &&
      currentMapping.pageKey
    ) {
      return currentMapping;
    }

    if (fullError?.__errors?.some(str => str.includes('resolution amount'))) {
      return {
        chapterKey: CHAPTER_KEYS.RESOLUTION_OPTIONS,
        pageKey: PAGE_KEYS.RESOLUTION_OPTION,
      };
    }

    return null;
  },
};

export default ReviewErrors;
