import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('How long you’ve known them'),
    knownVeteran: textUI({
      title: 'How long have you known the veteran?',
      hint: 'For example, 5 years or 18 months',
    }),
    knownClaimant: textUI({
      title: 'How long have you known the claimed spouse?',
      hint: 'For example, 5 years or 18 months',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      knownVeteran: textSchema,
      knownClaimant: textSchema,
    },
    required: ['knownVeteran', 'knownClaimant'],
  },
};
