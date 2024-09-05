import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import {
  ERROR_MAPPING,
  ERROR_MESSAGES,
  CHAPTER_KEYS,
  PAGE_KEYS,
} from '../constants/reviewErrors';

export const ReviewErrors = {
  hasRepayments: ERROR_MESSAGES['questions.hasRepayments'],
  hasCreditCardBills: ERROR_MESSAGES['questions.hasCreditCardBills'],
  hasRecreationalVehicle: ERROR_MESSAGES['questions.hasRecreationalVehicle'],
  hasVehicle: ERROR_MESSAGES['questions.hasVehicle'],
  hasRealEstate: ERROR_MESSAGES['questions.hasRealEstate'],
  spouseHasBenefits: ERROR_MESSAGES['questions.spouseHasBenefits'],
  isMarried: ERROR_MESSAGES['questions.isMarried'],
  hasDependents: ERROR_MESSAGES['questions.hasDependents'],
  hasBeenAdjudicatedBankrupt:
    ERROR_MESSAGES['questions.hasBeenAdjudicatedBankrupt'],
  vetIsEmployed: ERROR_MESSAGES['questions.vetIsEmployed'],
  spouseIsEmployed: ERROR_MESSAGES['questions.spouseIsEmployed'],
  monetaryAssets: ERROR_MESSAGES['assets.monetaryAssets'],
  realEstateValue: ERROR_MESSAGES['assets.realEstateValue'],
  recVehicleAmount: ERROR_MESSAGES['assets.recVehicleAmount'],
  otherAssets: ERROR_MESSAGES['assets.otherAssets'],
  automobiles: ERROR_MESSAGES['assets.automobiles'],
  spouseInformation: ERROR_MESSAGES['personalData.spouseFullName'],
  personalInformation: ERROR_MESSAGES['personalData.veteranFullName'],
  contactInformation: ERROR_MESSAGES['personalData.veteranContactInformation'],
  dependentInformation: ERROR_MESSAGES['personalData.dependents'],
  employmentHistory: ERROR_MESSAGES['personalData.employmentHistory'],
  additionalIncome: ERROR_MESSAGES['additionalIncome.addlIncRecords'],
  spouseAdditionalIncome: ERROR_MESSAGES['additionalIncome.spouse'],
  spouseBenefits: ERROR_MESSAGES['benefits.spouseBenefits'],
  selectedDebtsAndCopays: ERROR_MESSAGES.selectedDebtsAndCopays,
  expensesSummary: ERROR_MESSAGES['expenses.expenseRecords'],
  creditCardBills: ERROR_MESSAGES['expenses.creditCardBills'],
  utilities: ERROR_MESSAGES.utilityRecords,
  otherExpenses: ERROR_MESSAGES.otherExpenses,
  bankruptcyInformation: ERROR_MESSAGES['additionalData.bankruptcy'],
  additionalComments: ERROR_MESSAGES['additionalData.additionalComments'],

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

  _override: (error, fullError) => {
    const parts = error.split('.');
    const category = parts[0];
    const subCategory = parts[1];

    if (ERROR_MAPPING[category] && ERROR_MAPPING[category][subCategory]) {
      return ERROR_MAPPING[category][subCategory];
    }

    if (ERROR_MAPPING[category] && !subCategory) {
      return ERROR_MAPPING[category];
    }

    if (fullError?.__errors?.some(str => str.includes('resolution amount'))) {
      return {
        chapterKey: CHAPTER_KEYS.RESOLUTION_OPTIONS,
        pageKey: PAGE_KEYS.SELECTED_DEBTS_AND_COPAYS,
      };
    }
    return null;
  },
};

export default ReviewErrors;
