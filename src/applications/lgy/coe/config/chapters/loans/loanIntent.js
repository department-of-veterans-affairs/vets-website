import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import { loanIntent } from '../../schemaImports';

const LoanIntentHelpText = () => (
  <>
    <AdditionalInfo status="info" triggerText="Which one should I choose?">
      <span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </span>
    </AdditionalInfo>
  </>
);

export const schema = {
  type: 'object',
  properties: {
    ...loanIntent.properties,
    'view:loanIntentHelpText': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  intent: {
    'ui:widget': 'radio',
    'ui:title': 'How will you use your Certificate of Eligibility?',
    'ui:required': formData => formData?.existingLoan,
  },
  'view:loanIntentHelpText': {
    'ui:description': LoanIntentHelpText,
  },
};
