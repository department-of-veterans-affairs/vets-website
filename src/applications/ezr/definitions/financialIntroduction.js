import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FinancialInformationIntroduction } from '../components/IntroductionPage/FinancialInformation';

/**
 * Declare schema attributes for financial introduction page
 * @returns {PageSchema}
 */
export const FinancialIntroductionPage = {
  uiSchema: {
    ...titleUI(
      'Your income and deductible',
      "In the next few questions, we'll ask you about your household financial information.",
    ),
    'ui:description': () => <FinancialInformationIntroduction />,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
