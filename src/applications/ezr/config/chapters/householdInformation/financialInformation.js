import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
// import { insuranceTextOverrides } from '../../../utils/helpers';
// import { validateInsurancePolicy } from '../../../utils/validation';
import {
  veteranAnnualIncomePage,
  spouseAnnualIncomePage,
  deductibleExpensesPage,
  summaryPage,
  introPage,
} from '../../../definitions/financials';
import FinancialOverviewDescription from '../../../components/FormDescriptions/FinancialOverviewInformation';
import { includeSpousalInformation } from '../../../utils/helpers/form-config';
import { FinancialInformationReviewAlert } from '../../../components/FormDescriptions/IncomeDescriptions';
import { LAST_YEAR } from '../../../utils/constants';

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
  // isItemIncomplete: validateInsurancePolicy,
  text: {
    // summaryTitleWithoutItems: 'Your income and deductible',
    summaryDescription: FinancialInformationReviewAlert,
    // summaryDescriptionWithoutItems: "In the next few questions, we'll ask you about your household financial information.",
    cardDescription: item => {
      return FinancialOverviewDescription(item);
    },
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
const financialIntroPage = introPage;
const summaryPageSchemas = summaryPage(options);
const annualIncomePageSchemas = veteranAnnualIncomePage(options);
const deductiblePageSchemas = deductibleExpensesPage(options);
const spouseAnnualIncomePageSchemas = spouseAnnualIncomePage(options);

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const financialInformationPages = arrayBuilderPages(options, pagebuilder => ({
  financialInformationIntro: pagebuilder.introPage({
    title: '[noun plural]',
    path: 'household-information/financial-information-introduction',
    uiSchema: financialIntroPage.uiSchema,
    schema: financialIntroPage.schema,
  }),
  financialInformationSummary: pagebuilder.summaryPage({
    title: 'Your income and deductible',
    path: 'household-information/financial-information',
    uiSchema: summaryPageSchemas.uiSchema,
    schema: summaryPageSchemas.schema,
  }),
  veteranFinancialInformation: pagebuilder.itemPage({
    title: 'your annual income',
    path: 'household-information/financial-information/:index/annual-income',
    uiSchema: annualIncomePageSchemas.uiSchema,
    schema: annualIncomePageSchemas.schema,
  }),
  spouseFinancialInformation: pagebuilder.itemPage({
    title: 'spouse annual income',
    path: 'household-information/financial-information/:index/spousal-income',
    depends: includeSpousalInformation,
    uiSchema: spouseAnnualIncomePageSchemas.uiSchema,
    schema: spouseAnnualIncomePageSchemas.schema,
  }),
  veteranDeductibleInformation: pagebuilder.itemPage({
    title: 'deductible page',
    path: 'household-information/financial-information/:index/deductible',
    uiSchema: deductiblePageSchemas.uiSchema,
    schema: deductiblePageSchemas.schema,
  }),
}));

export default financialInformationPages;
