import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const errorMessages = {
  'questions.isMarried': "Select whether you're married (select yes or no)",
  'questions.hasDependents': 'Enter a valid number for dependents',
  'questions.hasVehicle': 'Select whether you own a vehicle (select yes or no)',
  'questions.hasRealEstate':
    'Select whether you own real estate (select yes or no)',
  'questions.hasRecreationalVehicle':
    'Select whether you have a recreational vehicle (select yes or no)',
  'questions.hasBeenAdjudicatedBankrupt':
    "Select whether you've declared for bankruptcy (select yes or no)",
  'questions.vetIsEmployed':
    "Select whether you're employed (select yes or no)",
  'questions.spouseIsEmployed':
    'Select whether your spouse is employed (select yes or no)',
  'questions.spouseHasBenefits':
    'Select whether your spouse has benefits (select yes or no)',
  'questions.hasCreditCardBills':
    'Select whether you have credit card bills (select yes or no)',
  'questions.hasRepayments':
    'Select whether you have repayments (select yes or no)',
  'personalData.dependents.dependentAge':
    'Enter a valid age for each dependent',
  'personalData.veteran.employmentHistory': 'Provide valid employment history',
  'personalData.spouse.employmentHistory': 'Provide valid employment history',
  additionalIncome: 'Provide valid additional income',
  benefits: 'Provide valid benefit information',
  cashOnHand: 'Enter a valid dollar amount for your cash on hand',
  cashInBank: 'Enter a valid dollar amount for your cash in bank',
  monetaryAssets: 'Provide valid information for all your monetary assets',
  realEstateValue:
    'Enter a valid dollar amount for the value of your real estate assets',
  recVehicleAmount:
    'Enter a valid dollar amount for your recreational vehicle(s)',
  otherAssets: 'Provide valid information for all other assets',
  expenseRecords: 'Provide valid expenses',
  installmentContracts: 'Provide valid installment contracts',
  utilityExpenses: 'Provide valid utility expenses',
  otherExpenses: 'Provide valid other expenses',
  monthlyHousingExpenses:
    'Enter a valid dollar amount for your monthly housing expenses',
  additionalData: 'Provide valid bankruptcy information',
  bankruptcyHistory: 'Provide valid bankruptcy information',
  resolutionOption: index =>
    `Select a resolution option for the ${numberToWords(
      index + 1,
    )} selected debt`,
  resolutionComment: index =>
    `Enter a resolution amount for the ${numberToWords(
      index + 1,
    )} selected debt`,
  resolutionWaiverCheck: index =>
    `Select whether you agree to the waiver for the ${numberToWords(
      index + 1,
    )} selected debt`,
};

export const ERROR_MAPPING = {
  isMarried: {
    chapterKey: 'veteranInformationChapter',
    pageKey: 'spouseInformation',
  },
  hasDependents: {
    chapterKey: 'veteranInformationChapter',
    pageKey: 'dependentCount',
  },
  dependentAge: {
    chapterKey: 'veteranInformationChapter',
    pageKey: 'dependentAges',
  },
  vetIsEmployed: {
    chapterKey: 'householdIncomeChapter',
    pageKey: 'employmentQuestion',
  },
  spouseIsEmployed: {
    chapterKey: 'householdIncomeChapter',
    pageKey: 'spouseEmploymentQuestion',
  },
  employmentHistory: {
    chapterKey: 'householdIncomeChapter',
    pageKey: 'enhancedEmploymentRecords',
  },
  additionalIncome: {
    chapterKey: 'householdIncomeChapter',
    pageKey: 'additionalIncomeValues',
  },
  benefits: {
    chapterKey: 'householdIncomeChapter',
    pageKey: 'benefitsEnhanced',
  },
  hasVehicle: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'enhancedVehicleRecords',
  },
  hasRealEstate: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'enhancedRealEstateRecords',
  },
  hasRecreationalVehicle: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'recreationalVehicleRecords',
  },
  cashOnHand: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'cashOnHand',
  },
  cashInBank: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'cashInBank',
  },
  monetaryAssets: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'monetaryAssets',
  },
  realEstateValue: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'enhancedRealEstateRecords',
  },
  recVehicleAmount: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'recreationalVehicleRecords',
  },
  otherAssets: {
    chapterKey: 'householdAssetsChapter',
    pageKey: 'otherAssets',
  },
  expenseRecords: {
    chapterKey: 'householdExpensesChapter',
    pageKey: 'expenseRecords',
  },
  installmentContracts: {
    chapterKey: 'householdExpensesChapter',
    pageKey: 'installmentContracts',
  },
  utilityExpenses: {
    chapterKey: 'householdExpensesChapter',
    pageKey: 'utilityExpenses',
  },
  otherExpenses: {
    chapterKey: 'householdExpensesChapter',
    pageKey: 'otherExpenses',
  },
  monthlyHousingExpenses: {
    chapterKey: 'householdExpensesChapter',
    pageKey: 'monthlyHousingExpenses',
  },
  hasBeenAdjudicatedBankrupt: {
    chapterKey: 'bankruptcyAttestationChapter',
    pageKey: 'bankruptcyHistory',
  },
  additionalData: {
    chapterKey: 'bankruptcyAttestationChapter',
    pageKey: 'bankruptcyDetails',
  },
  bankruptcyHistory: {
    chapterKey: 'bankruptcyAttestationChapter',
    pageKey: 'bankruptcyHistory',
  },
  resolutionOption: {
    chapterKey: 'resolutionOptionsChapter',
    pageKey: 'resolutionOption',
  },
  resolutionComment: {
    chapterKey: 'resolutionOptionsChapter',
    pageKey: 'resolutionComment',
  },
  resolutionWaiverCheck: {
    chapterKey: 'resolutionOptionsChapter',
    pageKey: 'resolutionWaiverCheck',
  },
  selectedDebtsAndCopays: {
    chapterKey: 'resolutionOptionsChapter',
    pageKey: 'resolutionOption',
  },
};
