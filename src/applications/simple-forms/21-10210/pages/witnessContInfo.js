import definitions from 'vets-json-schema/dist/definitions.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';

export default {
  uiSchema: {
    witnessPhone: {
      'ui:title': 'Phone number',
    },
    witnessEmail: emailUI(),
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
