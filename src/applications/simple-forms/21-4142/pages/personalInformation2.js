import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [
  veteranFields.ssn,
  veteranFields.vaFileNumber,
  veteranFields.veteranServiceNumber,
];

export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.ssn]: ssnUI,
      [veteranFields.vaFileNumber]: {
        'ui:title': 'VA file number (if applicable)',
        'ui:errorMessages': {
          pattern:
            'Please input a valid VA file number: 7 to 9 numeric digits, & may start with a letter "C" or "c".',
        },
      },
      [veteranFields.veteranServiceNumber]: {
        'ui:title': 'Veteran Service Number (if applicable)',
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
