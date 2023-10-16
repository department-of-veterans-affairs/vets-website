import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/* @type {PageSchema} */
export default {
  uiSchema: {
    additionalCertificates: yesNoUI({
      title:
        'Would you like to request additional certificates mailed to a separate address?',
      labelHeaderLevel: '3',
      labels: {
        Y:
          'Yes, I’d like additional certificates mailed to me at a separate address',
        N: 'No, these are the only certificates I’m requesting',
      },
      errorMessages: {
        required:
          'Please answer if you would like us to send additional certificates to a different address',
      },
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
