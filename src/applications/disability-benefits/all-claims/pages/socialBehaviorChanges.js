import React from 'react';

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
  'ui:title': ' ',
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
    noneApply: {
      'ui:title': 'None of these apply to me',
    },
  },
  otherExplanation: {
    'ui:title': 'Please specify',
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      maxLength: 32000,
      expandUnder: 'socialBehaviorChanges',
      expandUnderCondition: socialBehaviorChanges =>
        socialBehaviorChanges.other === true,
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
        noneApply: {
          type: 'boolean',
        },
      },
    },
    otherExplanation: {
      type: 'string',
    },
  },
};
