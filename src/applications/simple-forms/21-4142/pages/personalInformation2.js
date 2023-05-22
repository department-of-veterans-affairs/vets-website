import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { pick } from 'lodash';
import { veteranFields } from '../definitions/constants';

const { properties } = fullSchema.properties[veteranFields.parentObject];
const pageFields = [
  veteranFields.ssn,
  veteranFields.vaFileNumber,
  veteranFields.veteranServiceNumber,
];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.ssn]: ssnUI,
      [veteranFields.vaFileNumber]: {
        'ui:title': 'VA file number (if applicable)',
        'ui:errorMessages': {
          pattern: 'Your VA file number must be 8 or 9 digits',
        },
        'ui:options': {
          replaceSchema: () => {
            return {
              type: 'string',
              pattern: '^\\d{8,9}$',
            };
          },
        },
      },
      [veteranFields.veteranServiceNumber]: {
        'ui:title': 'Veteran service number (if applicable)',
        'ui:errorMessages': {
          pattern:
            'Your Veteran service number must start with 0, 1, or 2 letters followed by 5 to 8 digits',
        },
        'ui:options': {
          replaceSchema: () => {
            return {
              type: 'string',
              pattern: '^[a-zA-Z]{0,2}\\d{5,8}$',
            };
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.ssn],
        properties: pick(properties, pageFields),
      },
    },
  },
};
