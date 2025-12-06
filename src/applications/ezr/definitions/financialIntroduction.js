import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';
import { FinancialInformationIntroduction } from '../components/IntroductionPage/FinancialInformation';

/**
 * Declare schema attributes for financial introduction page
 * @returns {PageSchema}
 */
export default {
  uiSchema: {
    ...titleUI(
      content['household-financial-information-introduction-title'],
      content['household-financial-information-introduction-description'],
    ),
    'ui:description': () => <FinancialInformationIntroduction />,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
