import definitions from 'vets-json-schema/dist/definitions.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

export default {
  uiSchema: {
    veteranPhone: {
      'ui:title': 'Phone number',
    },
    veteranEmail: emailUI(),
    veteranEmailConsent: {
      'ui:title':
        'I agree to receive electronic correspondence from VA in regards to my claim.', // hidden via styling
      'ui:widget': 'checkbox', // Need this widget to support error messages
      'ui:required': formData => !!formData.veteranEmail,
      'ui:errorMessages': {
        required: 'Please agree to receive electronic correspondence.',
      },
      'ui:options': {
        hideIf: formData =>
          formData.claimantType === CLAIMANT_TYPES.NON_VETERAN ||
          (formData.claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY &&
            formData.claimantType === CLAIMANT_TYPES.VETERAN),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranPhone'],
    properties: {
      veteranPhone: definitions.phone,
      veteranEmail: definitions.email,
      veteranEmailConsent: {
        type: 'boolean',
      },
    },
  },
};
