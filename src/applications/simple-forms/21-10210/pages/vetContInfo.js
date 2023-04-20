import definitions from 'vets-json-schema/dist/definitions.json';
import { CLAIMANT_TYPE } from '../definitions/constants';

export default {
  uiSchema: {
    veteranPhone: {
      'ui:title': 'Phone number',
    },
    veteranEmail: {
      'ui:title': 'Email address',
    },
    veteranEmailConsent: {
      'ui:title':
        'I agree to receive electronic correspondence from VA in regards to my claim.', // hidden via styling
      'ui:widget': 'checkbox', // Need this widget to support error messages
      'ui:required': formData => !!formData.veteranEmail,
      'ui:errorMessages': {
        required: 'Please agree to receive electronic correspondence.',
      },
      'ui:options': {
        hideIf: formData => formData.claimantType !== CLAIMANT_TYPE.VETERAN,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranPhone'],
    properties: {
      veteranPhone: definitions.usaPhone,
      veteranEmail: definitions.email,
      veteranEmailConsent: {
        type: 'boolean',
      },
    },
  },
};
