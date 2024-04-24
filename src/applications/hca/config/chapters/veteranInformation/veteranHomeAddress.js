import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from '~/platform/forms/definitions/address';
import { HomeAddressDescription } from '../../../components/FormDescriptions';
import ShortFormAlert from '../../../components/FormAlerts/ShortFormAlert';
import { notShortFormEligible } from '../../../utils/helpers/form-config';
import { emptyObjectSchema } from '../../../definitions';

const { veteranHomeAddress: address } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:homeAddressShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': { hideIf: notShortFormEligible },
    },
    veteranHomeAddress: merge({}, addressUI(null, true), {
      'ui:title': HomeAddressDescription,
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
  },
  schema: {
    type: 'object',
    properties: {
      'view:homeAddressShortFormMessage': emptyObjectSchema,
      veteranHomeAddress: merge(
        {},
        addressSchema({ definitions: { address } }, true),
        {
          properties: {
            city: {
              minLength: 1,
              maxLength: 30,
            },
          },
        },
      ),
    },
  },
};
