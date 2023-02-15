import { intersection, pick } from 'lodash';

import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.ssn, veteranFields.vaFileNumber];
const personalInformation2 = {
  uiSchema: {
    [veteranFields.ssn]: {
      ...ssnUI,
      'ui:title': 'Your social security number',
    },
    [veteranFields.vaFileNumber]: {
      'ui:title': 'Your VA file number',
      'ui:errorMessages': {
        pattern:
          'Please input a valid VA file number: 7 to 9 numeric digits, & may start with a letter "C" or "c".',
      },
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: pick(properties, pageFields),
  },
};

export default personalInformation2;
