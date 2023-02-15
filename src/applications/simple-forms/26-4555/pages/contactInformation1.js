import { intersection } from 'lodash';

import constants from 'vets-json-schema/dist/constants.json';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

const { required } = fullSchema.properties[veteranFields.parentObject];
const pageFields = [veteranFields.address];
const PATTERNS = {
  date: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
  STREET_PATTERN: '^.*\\S.*',
};
const contactInformation1 = {
  uiSchema: {
    [veteranFields.address]: {
      'ui:title': 'Mailing address',
      'ui:description':
        "We'll send any updates about your application to this address.",
      ...addressUiSchema(
        'address',
        'I live on a United States military base outside of the U.S.',
        () => true,
        {},
        false,
      ),
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: {
      // pick(properties, pageFields) didn't work
      // probably because out-of-the-box profileAddress definition is 'special' (?)
      [veteranFields.address]: {
        type: 'object',
        properties: {
          isMilitary: {
            type: 'boolean',
          },
          country: {
            type: 'string',
            enum: constants.countries.map(country => country.value),
            enumNames: constants.countries.map(country => country.label),
          },
          'view:militaryBaseDescription': {
            type: 'object',
            properties: {},
          },
          street: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: PATTERNS.STREET_PATTERN,
          },
          street2: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: PATTERNS.STREET_PATTERN,
          },
          street3: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: PATTERNS.STREET_PATTERN,
          },
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          postalCode: {
            type: 'string',
          },
        },
      },
    },
  },
};

export default contactInformation1;
