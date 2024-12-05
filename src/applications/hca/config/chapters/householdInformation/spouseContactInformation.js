import merge from 'lodash/merge';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { FULL_SCHEMA } from '../../../utils/imports';

const { spouseAddress: address, spousePhone } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s address and phone number',
    spouseAddress: merge({}, addressUI(null, true), {
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
    spousePhone: phoneUI('Phone number'),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: merge(
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
      spousePhone,
    },
  },
};
