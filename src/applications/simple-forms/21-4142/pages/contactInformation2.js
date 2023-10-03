import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.homePhone, veteranFields.email];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.homePhone]: {
        ...phoneUI('Home phone number'),
        'ui:errorMessages': {
          ...phoneUI()['ui:errorMessages'],
          pattern:
            'Please enter a 10-digit phone number (with or without dashes)',
          required:
            'Please enter a 10-digit phone number (with or without dashes)',
        },
        'ui:options': {
          ...phoneUI()['ui:options'],
          updateSchema: () => ({
            type: 'string',
            pattern: '^\\d{3}-?\\d{3}-?\\d{4}$',
          }),
        },
      },
      [veteranFields.email]: {
        ...emailUI(),
        'ui:errorMessages': {
          format:
            'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
