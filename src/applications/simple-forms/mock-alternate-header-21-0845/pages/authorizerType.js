import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerType: radioUI({
      title: "Who's submitting this authorization?",
      labels: {
        veteran: "I'm a Veteran submitting on my own behalf",
        nonVeteran:
          "I'm a non-Veteran beneficiary or claimant submitting on behalf of a Veteran",
      },
      labelHeaderLevel: '1',
    }),
  },
  schema: {
    type: 'object',
    required: ['authorizerType'],
    properties: {
      authorizerType: radioSchema(['veteran', 'nonVeteran']),
    },
  },
};
