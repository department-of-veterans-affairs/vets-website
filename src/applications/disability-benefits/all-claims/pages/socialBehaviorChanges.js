import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const socialDescriptionChanges = (
  <div>
    <h5>Changes in social behavior</h5>
    <p>
      Please tell us about any changes in your social life as a result the
      event(s). You may have experienced some or none of these. (Please check
      any that apply.)
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': socialDescriptionChanges,
  socialBehaviorChanges: {
    breakup: {
      'ui:title': 'Breakup of primary relationship',
    },
    increasedDisregard: {
      'ui:title': 'Increased disregard for military or civilian authority',
    },
    withdrawal: {
      'ui:title': 'Withdrawal from friends',
    },
    unexplained: {
      'ui:title': 'Unexplained social behavior changes',
    },
    other: {
      'ui:title': 'Other',
    },
    otherExplanation: {
      'ui:title': ' ',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        expandUnder: 'other',
      },
    },
    noneApply: {
      'ui:title': 'None of these apply to me',
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    socialBehaviorChanges: {
      type: 'object',
      properties: {
        breakup: {
          type: 'boolean',
        },
        increasedDisregard: {
          type: 'boolean',
        },
        withdrawal: {
          type: 'boolean',
        },
        unexplained: {
          type: 'boolean',
        },
        other: {
          type: 'boolean',
        },
        otherExplanation: {
          type: 'string',
        },
        noneApply: {
          type: 'boolean',
        },
      },
    },
  },
};
