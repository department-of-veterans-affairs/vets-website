import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import content from '../../../locales/en/content.json';
import {
  includeHouseholdInformationWithV2Prefill,
  includeSpousalInformationWithV2Prefill,
} from '../../../utils/helpers/form-config';
import FinancialInformationReviewWarning from '../../../components/FormAlerts/FinancialInformationReviewWarning';
import { LAST_YEAR } from '../../../utils/constants';
import { VeteranAnnualIncomePage } from '../../../definitions/veteranAnnualIncome';
import { DeductibleExpensesPage } from '../../../definitions/deductibleExpenses';
import { SpouseAnnualIncomePage } from '../../../definitions/spouseAnnualIncome';
import { FinancialSummaryPage } from '../../../definitions/financialSummary';
import FinancialIntroductionPage from '../../../definitions/financialIntroduction';
import FinancialSummaryCardDescription from '../../../components/FormDescriptions/FinancialSummaryCardDescription';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const options = {
  arrayPath: 'financialInformation',
  nounPlural: `income and deductible for ${LAST_YEAR}`,
  nounSingular: `income and deductible for ${LAST_YEAR}`,
  required: false,
  maxItems: 1,
  hideMaxItemsAlert: true,
  text: {
    getItemName: `Your annual income from ${LAST_YEAR}`,
    summaryDescription: FinancialInformationReviewWarning,
    cardDescription: FinancialSummaryCardDescription,
    editSaveButtonText: 'Continue',
    alertItemUpdated: `Your income and deductible for ${LAST_YEAR} has been updated`,
    alertItemDeleted: `Your income and deductible for ${LAST_YEAR} has been deleted`,
    cancelAddButtonText: `Cancel adding your income and deductible for ${LAST_YEAR}`,
    cancelAddDescription: `If you cancel, you’ll lose the information you entered about your income and deductible for ${LAST_YEAR}`,
    cancelAddReviewDescription: `If you cancel, you’ll lose the information you entered about your income and deductible for ${LAST_YEAR} and you will be returned to the form review page.`,
    cancelAddNo: `No, continue adding my income and deductible for ${LAST_YEAR}`,
    cancelAddTitle: `Cancel adding your income and deductible for ${LAST_YEAR}`,
    cancelEditDescription: `If you cancel, you’ll lose any changes you made on this screen and you will be returned to the review page for you ${LAST_YEAR} income and deductible.`,
    cancelEditNo: `No, continue editing my income and deductible for ${LAST_YEAR}`,
    cancelEditTitle: `Cancel editing your income and deductible for ${LAST_YEAR}`,
    deleteDescription: `This will delete all the information from your income and deductible for ${LAST_YEAR}`,
    deleteNo: `No, keep my income and deductible for ${LAST_YEAR}`,
    deleteTitle: `Delete your income and deductible for ${LAST_YEAR}?`,
    deleteYes: `Yes, delete my income and deductible for ${LAST_YEAR}`,
  },
};

// build schemas based on declared options
const summaryPageSchemas = FinancialSummaryPage(options);
const annualIncomePageSchemas = VeteranAnnualIncomePage();
const deductiblePageSchemas = DeductibleExpensesPage();
const spouseAnnualIncomePageSchemas = SpouseAnnualIncomePage();

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const FinancialInformationPages = arrayBuilderPages(options, pageBuilder => ({
  financialInformationIntroduction: pageBuilder.introPage({
    title: content['household-financial-information-introduction-title'],
    path: 'household-information/financial-information-overview',
    depends: includeHouseholdInformationWithV2Prefill,
    uiSchema: FinancialIntroductionPage.uiSchema,
    schema: FinancialIntroductionPage.schema,
  }),
  financialInformationSummary: pageBuilder.summaryPage({
    title: content['household-financial-information-summary-title'],
    path: 'household-information/financial-information',
    depends: includeHouseholdInformationWithV2Prefill,
    uiSchema: summaryPageSchemas.uiSchema,
    schema: summaryPageSchemas.schema,
  }),
  veteranAnnualIncome: pageBuilder.itemPage({
    title:
      content['household-financial-information-veteran-annual-income-title'],
    path:
      'household-information/financial-information/:index/veteran-annual-income',
    depends: includeHouseholdInformationWithV2Prefill,
    uiSchema: annualIncomePageSchemas.uiSchema,
    schema: annualIncomePageSchemas.schema,
  }),
  spouseAnnualIncome: pageBuilder.itemPage({
    title:
      content['household-financial-information-spouse-annual-income-title'],
    path:
      'household-information/financial-information/:index/spouse-annual-income',
    depends: includeSpousalInformationWithV2Prefill,
    uiSchema: spouseAnnualIncomePageSchemas.uiSchema,
    schema: spouseAnnualIncomePageSchemas.schema,
  }),
  veteranDeductible: pageBuilder.itemPage({
    title: content['household-financial-information-deductible-expenses-title'],
    path:
      'household-information/financial-information/:index/deductible-expenses',
    depends: includeHouseholdInformationWithV2Prefill,
    uiSchema: deductiblePageSchemas.uiSchema,
    schema: deductiblePageSchemas.schema,
  }),
}));

export default FinancialInformationPages;
