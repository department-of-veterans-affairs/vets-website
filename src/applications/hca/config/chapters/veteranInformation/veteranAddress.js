import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

import { MailingAddressDescription } from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import { isShortFormEligible } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

export default {
  uiSchema: {
    'view:veteranAddressShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: formData => !isShortFormEligible(formData),
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
      'ui:options': {
        hideIf: formData => !formData['view:isLoggedIn'],
      },
    },
    veteranAddress: merge({}, addressUI(null, true), {
      'ui:title': MailingAddressDescription,
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          pattern:
            'Please provide a valid street. Must be at least 1 character.',
        },
      },
      city: {
        'ui:errorMessages': {
          pattern: 'Please provide a valid city. Must be at least 1 character.',
        },
      },
      state: {
        'ui:title': 'State/Province/Region',
        'ui:errorMessages': {
          required: 'Please enter a state/province/region',
        },
      },
    }),
    'view:doesMailingMatchHomeAddress': {
      'ui:title': 'Is your home address the same as your mailing address?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:veteranAddressShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      veteranAddress: merge({}, addressSchema(fullSchemaHca, true), {
        properties: {
          street: {
            minLength: 1,
            maxLength: 30,
          },
          street2: {
            minLength: 1,
            maxLength: 30,
          },
          street3: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
          },
          city: {
            minLength: 1,
            maxLength: 30,
          },
        },
      }),
      'view:doesMailingMatchHomeAddress': {
        type: 'boolean',
      },
    },
  },
};
