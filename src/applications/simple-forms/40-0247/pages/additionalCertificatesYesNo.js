// can't use v3 yesNoUI because it doesn't support JSX ui:title
/* @type {PageSchema} */
export default {
  uiSchema: {
    additionalCertificates: {
      // can't use JSX to custom-style label; not supported by yesNo widget
      'ui:title':
        'Would you like to request additional certificates mailed to a separate address?',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y:
            'Yes, I’d like additional certificates mailed to me at a separate address',
          N: 'No, these are the only certificates I’m requesting',
        },
      },
      'ui:errorMessages': {
        required: 'Please select whether you want additional certificates',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalCertificates: {
        type: 'boolean',
      },
    },
    required: ['additionalCertificates'],
  },
};
