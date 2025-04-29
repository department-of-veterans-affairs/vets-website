import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { insuranceTextOverrides } from '../../../utils/helpers';
import { validateInsurancePolicy } from '../../../utils/validation';
import {
  policyPage,
  summaryPage,
} from '../../../definitions/insurancePolicies';
import content from '../../../locales/en/content.json';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const options = {
  arrayPath: 'providers',
  nounPlural: content['insurance-info--array-noun-plural'],
  nounSingular: content['insurance-info--array-noun-singular'],
  required: false,
  isItemIncomplete: validateInsurancePolicy,
  text: insuranceTextOverrides(),
};

// build schemas based on declared options
const summaryPageSchemas = summaryPage(options);
const policyPageSchemas = policyPage(options);

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const healthInsurancePolicyPages = arrayBuilderPages(options, pagebuilder => ({
  healthInsurancePolicySummary: pagebuilder.summaryPage({
    title: content['insurance-info--summary-page-title'],
    path: 'insurance-information/health-insurance',
    uiSchema: summaryPageSchemas.uiSchema,
    schema: summaryPageSchemas.schema,
  }),
  healthInsurancePolicyInformation: pagebuilder.itemPage({
    title: content['insurance-info--policy-page-title'],
    path: 'insurance-information/health-insurance/:index/policy-information',
    uiSchema: policyPageSchemas.uiSchema,
    schema: policyPageSchemas.schema,
  }),
}));

export default healthInsurancePolicyPages;
