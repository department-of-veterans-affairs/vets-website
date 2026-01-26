import {
  yesNoUI,
  yesNoSchema,
  // titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    // ...titleUI(''), // Are we missing a title or is it intentional?
    loanHistory: {
      hadPriorLoans: yesNoUI({
        title: 'Have you used the VA home loan program before?',
        labels: {
          Y: 'Yes — I had a loan in the past or have one now.',
          N: 'No — I’ve never had a VA home loan',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      loanHistory: {
        type: 'object',
        properties: {
          hadPriorLoans: yesNoSchema,
        },
        required: ['hadPriorLoans'],
      },
    },
  },
};
