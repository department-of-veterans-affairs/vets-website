import {
  addressSchema,
  addressUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  dateOfDeathSchema,
  dateOfDeathUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

import { dateOfDeathValidation } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran personal information'),
    veteranAddress: merge(
      {},
      addressUI({
        omit: [
          'isMilitary',
          'country',
          'street',
          'street2',
          'street3',
          'postalCode',
        ],
      }),
      {
        city: {
          'ui:title': 'Birth city',
          'ui:required': false,
        },
        state: {
          'ui:title': 'Birth state',
        },
      },
    ),
    veteranDateOfBirth: merge({}, dateOfBirthUI(), {
      'ui:errorMessages': {
        required: 'Enter a date',
      },
    }),
    veteranDateOfDeath: merge({}, dateOfDeathUI(), {
      'ui:errorMessages': {
        required: 'Enter a date',
      },
    }),
    'ui:validations': [dateOfDeathValidation],
  },
  schema: {
    type: 'object',
    properties: {
      veteranAddress: merge(
        {},
        addressSchema({
          omit: [
            'isMilitary',
            'country',
            'street',
            'street2',
            'street3',
            'postalCode',
          ],
        }),
        {
          properties: {
            city: {
              maxLength: 100,
            },
            state: {
              maxLength: 100,
            },
          },
        },
      ),
      veteranDateOfBirth: dateOfBirthSchema,
      veteranDateOfDeath: dateOfDeathSchema,
    },
    required: ['veteranDateOfBirth', 'veteranDateOfDeath'],
  },
};
