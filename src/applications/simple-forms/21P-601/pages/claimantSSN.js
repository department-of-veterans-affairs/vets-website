import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your identification information'),
    claimantIdentification: {
      ssn: ssnUI(),
    },
  },
  schema: {
    type: 'object',
    required: ['claimantIdentification'],
    properties: {
      claimantIdentification: {
        type: 'object',
        required: ['ssn'],
        properties: {
          ssn: ssnSchema,
        },
      },
    },
  },
};
