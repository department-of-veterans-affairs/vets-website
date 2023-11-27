import set from 'platform/utilities/data/set';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import * as address from 'platform/forms/definitions/address';

import { validateCentralMailPostalCode } from '../validation';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Mailing address',
    veteranAddress: set(
      'ui:validations[1]',
      validateCentralMailPostalCode,
      address.uiSchema('Mailing address'),
    ),
  },
  schema: {
    type: 'object',
    required: ['veteranAddress'],
    properties: {
      veteranAddress: address.schema(fullSchemaPensions, true),
    },
  },
};
