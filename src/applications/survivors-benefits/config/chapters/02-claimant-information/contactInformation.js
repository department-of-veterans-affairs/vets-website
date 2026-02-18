import {
  emailSchema,
  emailUI,
  internationalPhoneUI,
  internationalPhoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Email address and phone number'),
    claimantEmail: emailUI('Email'),
    claimantPhone: internationalPhoneUI('Primary phone number'),
  },
  schema: {
    type: 'object',
    required: ['claimantEmail', 'claimantPhone'],
    properties: {
      claimantEmail: emailSchema,
      claimantPhone: internationalPhoneSchema(),
    },
  },
};
