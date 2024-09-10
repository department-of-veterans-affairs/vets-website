import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const errorMessages = {
  'questions.isMarried':
    'Please select whether you are married (select yes or no)',
  'questions.hasDependents': 'Please enter a valid number for dependents',
  'questions.hasVehicle':
    'Please select whether you own a vehicle (select yes or no)',
  'questions.hasRealEstate':
    'Please select whether you own real estate (select yes or no)',
  'questions.hasRecreationalVehicle':
    'Please select whether you have a recreational vehicle (select yes or no)',
  'questions.hasBeenAdjudicatedBankrupt':
    "Please select whether you've declared bankruptcy (select yes or no)",
  'questions.vetIsEmployed':
    'Please select whether the veteran is employed (select yes or no)',
  'questions.spouseIsEmployed':
    'Please select whether the spouse is employed (select yes or no)',
  'questions.spouseHasBenefits':
    'Please select whether the spouse has benefits (select yes or no)',
  'personalData.dependents.dependentAge':
    'Please enter a valid age for each dependent',
  'personalData.veteran.employmentHistory':
    'Please provide valid employment history',
  'personalData.spouse.employmentHistory':
    'Please provide valid employment history',
  additionalIncome:
    'Please provide valid additional income for all household members',
  benefits: 'Please provide valid benefit information',
  cashOnHand: 'Please enter a valid dollar amount for Cash on hand',
  cashInBank: 'Please enter a valid dollar amount for Cash in bank',
  monetaryAssets: 'Please provide valid information for all monetary assets',
  realEstateValue:
    'Please enter a valid dollar amount for your real estate value',
  recVehicleAmount:
    'Please enter a valid dollar amount for your recreational vehicle',
  otherAssets: 'Please provide valid information for all other assets',
  expenseRecords: 'Please provide valid expenses for all household members',
  installmentContracts:
    'Please provide valid installment contracts for all household members',
  utilityExpenses:
    'Please provide valid utility expenses for all household members',
  otherExpenses:
    'Please provide valid other expenses for all household members',
  monthlyHousingExpenses:
    'Please enter a valid dollar amount for your monthly housing expenses',
  additionalData: 'Please provide valid bankruptcy information',
  bankruptcyHistory: 'Please provide valid bankruptcy information',
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
