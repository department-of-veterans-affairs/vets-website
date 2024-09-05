export const ERROR_MESSAGES = {
  // Questions
  'questions.hasRepayments':
    'Please provide valid information regarding repayments',
  'questions.hasCreditCardBills':
    'Please provide valid information regarding credit card bills',
  'questions.hasRecreationalVehicle':
    'Please select whether you have a recreational vehicle (select yes or no)',
  'questions.hasVehicle':
    'Please select whether you own a vehicle (select yes or no)',
  'questions.hasRealEstate':
    'Please select whether you own real estate (select yes or no)',
  'questions.spouseHasBenefits':
    'Please provide valid information regarding spouse benefits',
  'questions.isMarried':
    'Please select whether you are married (select yes or no)',
  'questions.hasDependents':
    'Please provide valid information regarding dependents',
  'questions.hasBeenAdjudicatedBankrupt':
    "Please select whether you've declared bankruptcy (select yes or no)",
  'questions.vetIsEmployed':
    'Please provide employment information for the veteran',
  'questions.spouseIsEmployed':
    'Please provide employment information for the spouse',
  'personalData.spouseFullName': 'Please provide valid spouse information',
  'personalData.veteranFullName': 'Please provide valid veteran information',
  'personalData.dateOfBirth': 'Please provide a valid date of birth',
  'personalData.veteranContactInformation':
    'Please provide valid contact information',
  'personalData.dependents': 'Please provide valid dependent information',
  'personalData.address': 'Please provide a valid address',
  'personalData.telephoneNumber': 'Please provide a valid telephone number',
  'personalData.emailAddress': 'Please provide a valid email address',
  'personalData.employmentHistory': 'Please provide valid employment history',
  'assets.monetaryAssets':
    'Please provide valid information for all monetary assets',
  'assets.realEstateValue': 'Please provide valid real estate information',
  'assets.recVehicleAmount':
    'Please provide valid recreational vehicle information',
  'assets.otherAssets': 'Please provide valid information for all other assets',
  'assets.automobiles': 'Please provide valid vehicle information',
  'additionalIncome.addlIncRecords':
    'Please provide valid additional income for all household members',
  'additionalIncome.spouse':
    'Please provide valid additional income for spouse',
  'benefits.spouseBenefits': 'Please provide valid benefits for spouse',
  selectedDebtsAndCopays:
    'Please provide valid debts for all household members',
  'expenses.expenseRecords':
    'Please provide valid expenses for all household members',
  'expenses.creditCardBills':
    'Please provide valid credit card bills for all household members',
  utilityRecords: 'Please provide valid utilities for all household members',
  otherExpenses:
    'Please provide valid other expenses for all household members',
  'additionalData.bankruptcy': 'Please provide valid bankruptcy information',
  'additionalData.additionalComments':
    'Please provide valid additional comments',
  installmentContracts: 'Please provide valid installment contract information',
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
  HAS_REPAYMENTS: 'hasRepayments',
  HAS_CREDIT_CARD_BILLS: 'hasCreditCardBills',
  HAS_RECREATIONAL_VEHICLE: 'hasRecreationalVehicle',
  HAS_VEHICLE: 'hasVehicle',
  HAS_REAL_ESTATE: 'hasRealEstate',
  SPOUSE_HAS_BENEFITS: 'spouseHasBenefits',
  IS_MARRIED: 'isMarried',
  HAS_DEPENDENTS: 'hasDependents',
  HAS_BEEN_ADJUDICATED_BANKRUPT: 'hasBeenAdjudicatedBankrupt',
  VET_IS_EMPLOYED: 'vetIsEmployed',
  SPOUSE_IS_EMPLOYED: 'spouseIsEmployed',
  SPOUSE_FULL_NAME: 'spouseFullName',
  VETERAN_FULL_NAME: 'veteranFullName',
  DATE_OF_BIRTH: 'dateOfBirth',
  VETERAN_CONTACT_INFORMATION: 'veteranContactInformation',
  DEPENDENTS: 'dependents',
  ADDRESS: 'address',
  TELEPHONE_NUMBER: 'telephoneNumber',
  EMAIL_ADDRESS: 'emailAddress',
  EMPLOYMENT_HISTORY: 'employmentHistory',
  MONETARY_ASSETS: 'monetaryAssets',
  REAL_ESTATE_VALUE: 'realEstateValue',
  REC_VEHICLE_AMOUNT: 'recVehicleAmount',
  OTHER_ASSETS: 'otherAssets',
  AUTOMOBILES: 'automobiles',
  ADDL_INC_RECORDS: 'addlIncRecords',
  SPOUSE_ADDITIONAL_INCOME: 'spouse',
  SPOUSE_BENEFITS: 'spouseBenefits',
  SELECTED_DEBTS_AND_COPAYS: 'selectedDebtsAndCopays',
  EXPENSE_RECORDS: 'expenseRecords',
  CREDIT_CARD_BILLS: 'creditCardBills',
  UTILITY_RECORDS: 'utilityRecords',
  OTHER_EXPENSES: 'otherExpenses',
  BANKRUPTCY: 'bankruptcy',
  ADDITIONAL_COMMENTS: 'additionalComments',
  INSTALLMENT_CONTRACTS: 'installmentContracts',
};

export const ERROR_MAPPING = {
  questions: {
    hasRepayments: {
      chapterKey: CHAPTER_KEYS.DEBTS_AND_COPAYS,
      pageKey: PAGE_KEYS.HAS_REPAYMENTS,
    },
    hasCreditCardBills: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
      pageKey: PAGE_KEYS.HAS_CREDIT_CARD_BILLS,
    },
    hasRecreationalVehicle: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.HAS_RECREATIONAL_VEHICLE,
    },
    hasVehicle: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.HAS_VEHICLE,
    },
    hasRealEstate: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.HAS_REAL_ESTATE,
    },
    spouseHasBenefits: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.SPOUSE_HAS_BENEFITS,
    },
    isMarried: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.IS_MARRIED,
    },
    hasDependents: {
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.HAS_DEPENDENTS,
    },
    hasBeenAdjudicatedBankrupt: {
      chapterKey: CHAPTER_KEYS.BANKRUPTCY_ATTESTATION,
      pageKey: PAGE_KEYS.HAS_BEEN_ADJUDICATED_BANKRUPT,
    },
    vetIsEmployed: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.VET_IS_EMPLOYED,
    },
    spouseIsEmployed: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.SPOUSE_IS_EMPLOYED,
    },
  },
  assets: {
    recVehicleAmount: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.REC_VEHICLE_AMOUNT,
    },
    realEstateValue: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.REAL_ESTATE_VALUE,
    },
    monetaryAssets: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.MONETARY_ASSETS,
    },
    otherAssets: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.OTHER_ASSETS,
    },
    automobiles: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.AUTOMOBILES,
    },
  },
  personalData: {
    employmentHistory: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.EMPLOYMENT_HISTORY,
    },
  },
  expenses: {
    expenseRecords: {
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
      pageKey: PAGE_KEYS.EXPENSE_RECORDS,
    },
  },
  creditCardBills: {
    chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
    pageKey: PAGE_KEYS.CREDIT_CARD_BILLS,
  },
  utilityRecords: {
    chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
    pageKey: PAGE_KEYS.UTILITY_RECORDS,
  },
  otherExpenses: {
    chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
    pageKey: PAGE_KEYS.OTHER_EXPENSES,
  },
  selectedDebtsAndCopays: {
    chapterKey: CHAPTER_KEYS.RESOLUTION_OPTIONS,
    pageKey: PAGE_KEYS.SELECTED_DEBTS_AND_COPAYS,
  },
  additionalData: {
    bankruptcy: {
      chapterKey: CHAPTER_KEYS.BANKRUPTCY_ATTESTATION,
      pageKey: PAGE_KEYS.BANKRUPTCY,
    },
    additionalComments: {
      chapterKey: CHAPTER_KEYS.BANKRUPTCY_ATTESTATION,
      pageKey: PAGE_KEYS.ADDITIONAL_COMMENTS,
    },
  },
  installmentContracts: {
    chapterKey: CHAPTER_KEYS.RESOLUTION_OPTIONS,
    pageKey: PAGE_KEYS.INSTALLMENT_CONTRACTS,
  },
};
