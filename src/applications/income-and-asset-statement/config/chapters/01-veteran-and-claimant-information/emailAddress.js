import {
  emailUI,
  emailSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Current email',
  path: 'claimant/email',
  depends: formData => {
    return formData?.claimantType !== 'VETERAN';
  },
  uiSchema: {
    ...titleUI('Current email'),
    email: emailUI({
      title: 'Email',
      hint:
        'We may use your contact information so we can get in touch with you if we have questions about your application.',
    }),
  },
  schema: {
    type: 'object',
    required: ['email'],
    properties: {
      email: emailSchema,
    },
  },
};
