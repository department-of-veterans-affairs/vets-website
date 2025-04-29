import merge from 'lodash/merge';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { veteranAddress: address } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['vet-info--mailing-address-title'],
      content['vet-info--mailing-address-description'],
    ),
    veteranAddress: merge({}, addressUI(null, true), {
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
      veteranAddress: merge(
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
      'view:doesMailingMatchHomeAddress': {
        type: 'boolean',
      },
    },
  },
};
