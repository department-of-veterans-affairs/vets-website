import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    claimantPhone: phoneUI('Phone number'),
    claimantEmail: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    required: ['claimantEmail'],
    properties: {
      claimantPhone: phoneSchema,
      claimantEmail: emailSchema,
    },
  },
};
