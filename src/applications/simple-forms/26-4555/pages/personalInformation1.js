import { intersection, pick } from 'lodash';

import fullNameUI from 'platform/forms-system/src/js/definitions//fullName';
import fullSchema from '../26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

// TODO: import fullSchema from vets-json-schema once that's available

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.fullName, veteranFields.dateOfBirth];
const personalInformation1 = {
  uiSchema: {
    [veteranFields.fullName]: fullNameUI,
    [veteranFields.dateOfBirth]: {
      'ui:title': 'Your date of birth',
      'ui:widget': 'date',
      'ui:errorMessages': {
        pattern: 'Please select Month, Day, and input a 4-digit Year.',
      },
    },
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: pick(properties, pageFields),
  },
};

export default personalInformation1;
