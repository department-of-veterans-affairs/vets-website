import definitions from 'vets-json-schema/dist/definitions.json';
import { CLAIMANT_TYPES } from '../definitions/constants';

export default {
  uiSchema: {
    claimantPhone: {
      'ui:title': 'Phone number',
    },
    claimantEmail: {
      'ui:title': 'Email address',
    },
    claimantEmailConsent: {
      'ui:title':
        'I agree to receive electronic correspondence from VA in regards to my claim.', // hidden via styling
      'ui:widget': 'checkbox', // Need this widget to support error messages
      'ui:required': formData => !!formData.claimantEmail,
      'ui:errorMessages': {
        required: 'Please agree to receive electronic correspondence.',
      },
      'ui:options': {
        hideIf: formData => formData.claimantType !== CLAIMANT_TYPES.VETERAN,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantPhone'],
    properties: {
      claimantPhone: definitions.phone,
      claimantEmail: definitions.email,
      claimantEmailConsent: {
        type: 'boolean',
      },
    },
  },
};
