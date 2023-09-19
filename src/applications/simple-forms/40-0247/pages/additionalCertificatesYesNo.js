import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern.jsx';

/* @type {PageSchema} */
export default {
  uiSchema: {
    additionalCertificates: yesNoUI({
      title:
        'Would you like to request additional certificates mailed to a separate address?',
      labels: {
        Y:
          'Yes, I’d like additional certificates mailed to me at a separate address',
        N: 'No, these are the only certificates I’m requesting',
      },
      // can't seem to customize error-message for this field
    }),
  },
  schema: {
    type: 'object',
    properties: {
      additionalCertificates: yesNoSchema,
    },
    required: ['additionalCertificates'],
  },
};
