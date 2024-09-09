import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const questionErrors = {
  hasRepayments: 'Please provide valid information regarding repayments',
  hasCreditCardBills:
    'Please provide valid information regarding credit card bills',
  hasRecreationalVehicle:
    'Please select whether you have a recreational vehicle (select yes or no)',
  hasVehicle: 'Please select whether you own a vehicle (select yes or no)',
  hasRealEstate: 'Please select whether you own real estate (select yes or no)',
  spouseHasBenefits:
    'Please provide valid information regarding spouse benefits',
  isMarried: 'Please select whether you are married (select yes or no)',
  hasDependents: 'Please provide valid information regarding dependents',
  hasBeenAdjudicatedBankrupt:
    "Please select whether you've declared bankruptcy (select yes or no)",
  vetIsEmployed: 'Please provide employment information for the veteran',
  spouseIsEmployed: 'Please provide employment information for the spouse',
};

export const personalDataErrors = {
  dateOfBirth: 'Please provide a valid date of birth',
  veteranContactInformation: 'Please provide valid contact information',
  address: 'Please provide a valid address',
  telephoneNumber: 'Please provide a valid telephone number',
  emailAddress: 'Please provide a valid email address',
  employmentHistory: 'Please provide valid employment history',
};

export const incomeAndBenefitsErrors = {
  'additionalIncome.addlIncRecords':
    'Please provide valid additional income for all household members',
  'additionalIncome.spouse':
    'Please provide valid additional income for spouse',
  'benefits.spouseBenefits': 'Please provide valid benefits for spouse',
};

export const expensesErrors = {
  'expenses.expenseRecords':
    'Please provide valid expenses for all household members',
  'expenses.creditCardBills':
    'Please provide valid credit card bills for all household members',
  monthlyHousingExpenses:
    'Please enter a valid dollar amount for your monthly housing expenses',
};

export const assetsErrors = {
  'assets.monetaryAssets':
    'Please provide valid information for all monetary assets',
  'assets.realEstateValue': 'Please provide valid real estate information',
  'assets.recVehicleAmount':
    'Please provide valid recreational vehicle information',
  'assets.otherAssets': 'Please provide valid information for all other assets',
  'assets.automobiles': 'Please provide valid vehicle information',
};

export const additionalDataErrors = {
  'additionalData.bankruptcy': 'Please provide valid bankruptcy information',
  'additionalData.additionalComments':
    'Please provide valid additional comments',
};

export const resolutionErrors = {
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
  questions: {
    hasBeenAdjudicatedBankrupt: {
      chapterKey: 'bankruptcyAttestationChapter',
      pageKey: 'bankruptcyHistory',
    },
    isMarried: {
      chapterKey: 'veteranInformationChapter',
      pageKey: 'spouseInformation',
    },
    hasDependents: {
      chapterKey: 'veteranInformationChapter',
      pageKey: 'hasDependents',
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
  },
  selectedDebtsAndCopays: {
    chapterKey: 'resolutionOptionsChapter',
    pageKey: 'resolutionOption',
  },
};
