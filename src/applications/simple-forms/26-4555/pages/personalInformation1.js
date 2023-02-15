import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import customFullNameUI from '../definitions/customFullNameUI';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.fullName, veteranFields.dateOfBirth];
const personalInformation1 = {
  uiSchema: {
    // we're importing our own fullName ui-schema to diplay custom labels
    [veteranFields.fullName]: customFullNameUI({
      firstNameLabel: 'Your first name',
      lastNameLabel: 'Your last name',
      middleNameLabel: 'Your middle name',
    }),
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
