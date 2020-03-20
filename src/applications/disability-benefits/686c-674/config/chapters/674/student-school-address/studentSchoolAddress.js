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
  schoolAddress: addressUISchema(false, 'schoolAddress', 'report674'),
};
