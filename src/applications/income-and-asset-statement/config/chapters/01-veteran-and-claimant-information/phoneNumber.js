import {
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Preferred phone number',
  path: 'claimant/phone',
  uiSchema: {
    ...titleUI('Preferred phone number'),
    claimantPhone: phoneUI({
      title: 'Current phone number (optional)',
      hint: 'Enter a 10-digit phone number',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      claimantPhone: phoneSchema,
    },
  },
};
