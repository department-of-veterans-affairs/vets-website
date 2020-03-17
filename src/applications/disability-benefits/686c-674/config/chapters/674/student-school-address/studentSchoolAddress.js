import { genericSchemas } from '../../../generic-schema';

import { isChapterFieldRequired } from '../../../helpers';
import { addressSchema, addressUISchema } from '../../../address-schema';

import { StudentNameHeader } from '../helpers';

const { genericTextInput } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    schoolInformation: {
      type: 'object',
      properties: {
        schoolName: genericTextInput,
        trainingProgram: genericTextInput,
      },
    },
    schoolAddress: addressSchema,
  },
};

/*
Address requirments - label for state should be State/Province/Region for non USA country.
State/Province/Region should be optional for non USA country.
State/Province/Region should be a text input for non USA country.
Postal Code should be converted to International Postal Code for non USA country.
*/

export const uiSchema = {
  'ui:title': StudentNameHeader,
  schoolInformation: {
    'ui:title': 'School student will attend',
    schoolName: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'School’s name',
      'ui:errorMessages': { required: 'Please enter a school name' },
    },
    trainingProgram: {
      'ui:title': 'Kind of training or educational program',
    },
  },
  schoolAddress: addressUISchema('schoolAddress', 'report674'),
};
