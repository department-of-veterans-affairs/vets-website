import definitions from 'vets-json-schema/dist/definitions.json';

export default {
  uiSchema: {
    witnessPhone: {
      'ui:title': 'Phone number',
    },
    witnessEmail: {
      'ui:title': 'Email address',
    },
    witnessEmailConsent: {
      'ui:title':
        'I agree to receive electronic correspondence from VA in regards to my claim.', // hidden via styling
      'ui:widget': 'checkbox', // Need this widget to support error messages
      'ui:required': formData => !!formData.claimantEmail,
      'ui:errorMessages': {
        required: 'Please agree to receive electronic correspondence.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['witnessPhone'],
    properties: {
      witnessPhone: definitions.phone,
      witnessEmail: definitions.email,
      witnessEmailConsent: {
        type: 'boolean',
      },
    },
  },
};
