import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const MaritalStatusInfo = (
  <AdditionalInfo triggerText="Why does my marital status matter?">
    <p>
      We want to make sure we understand your household's financial situation.
    </p>
    <p>
      If you’re married, we also need to understand your spouse’s financial
      situation. This allows us to make a more informed decision regarding your
      request.
    </p>
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': 'Your spouse information',
  questions: {
    maritalStatus: {
      'ui:title': 'Are you married?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
  'view:components': {
    'view:maritalStatus': {
      'ui:description': MaritalStatusInfo,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        maritalStatus: {
          type: 'boolean',
        },
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:maritalStatus': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
