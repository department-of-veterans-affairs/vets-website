import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import summaryPage, { insuranceArrayOptions } from './policySummary';
import policyInformation from './policyInformation';
import content from '../../../locales/en/content.json';

const healthInsurancePolicyPages = arrayBuilderPages(
  insuranceArrayOptions,
  pagebuilder => ({
    healthInsurancePolicySummary: pagebuilder.summaryPage({
      title: content['insurance-info--summary-page-title'],
      path: 'insurance-information/health-insurance',
      ...summaryPage,
    }),
    healthInsurancePolicyInformation: pagebuilder.itemPage({
      title: content['insurance-info--policy-page-title'],
      path: 'insurance-information/health-insurance/:index/policy-information',
      ...policyInformation,
    }),
  }),
);

export default healthInsurancePolicyPages;
