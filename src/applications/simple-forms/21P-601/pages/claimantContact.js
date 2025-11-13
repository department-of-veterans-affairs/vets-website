import {
  titleUI,
  addressUI,
  addressSchema,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Contact information'),
    claimantAddress: addressUI(),
    claimantPhone: phoneUI('Phone number'),
    claimantEmail: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    required: ['claimantAddress', 'claimantEmail'],
    properties: {
      claimantAddress: addressSchema(),
      claimantPhone: phoneSchema,
      claimantEmail: emailSchema,
    },
  },
};
