import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantPhone: phoneUI('Phone number'),
    claimantEmail: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantPhone: phoneSchema,
      claimantEmail: emailSchema,
    },
    required: ['claimantPhone'],
  },
};
