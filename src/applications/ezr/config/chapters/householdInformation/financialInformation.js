import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
// import { insuranceTextOverrides } from '../../../utils/helpers';
// import { validateInsurancePolicy } from '../../../utils/validation';
import {
  veteranAnnualIncomePage,
  spouseAnnualIncomePage,
  deductibleExpensesPage,
  summaryPage,
} from '../../../definitions/financials';
import FinancialOverviewDescription from '../../../components/FormDescriptions/FinancialOverviewInformation';
import { includeSpousalInformation } from '../../../utils/helpers/form-config';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const options = {
  arrayPath: 'financialInformation',
  nounPlural: 'tests',
  nounSingular: 'test',
  required: false,
  // isItemIncomplete: validateInsurancePolicy,
  text: {
    cardDescription: item => {
      return FinancialOverviewDescription(item);
    },
  },
};

// build schemas based on declared options
const summaryPageSchemas = summaryPage(options);
const annualIncomePageSchemas = veteranAnnualIncomePage(options);
const deductiblePageSchemas = deductibleExpensesPage(options);
const spouseAnnualIncomePageSchemas = spouseAnnualIncomePage(options);

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const financialInformationPages = arrayBuilderPages(options, pagebuilder => ({
  financialInformationSummary: pagebuilder.summaryPage({
    title: 'test',
    path: 'household-information/financial-information',
    uiSchema: summaryPageSchemas.uiSchema,
    schema: summaryPageSchemas.schema,
  }),
  veteranFinancialInformation: pagebuilder.itemPage({
    title: 'testing',
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
