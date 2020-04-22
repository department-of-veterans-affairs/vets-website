import { genericSchemas } from '../../../generic-schema';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';

import { StudentNameHeader } from '../helpers';

const { genericTextInput } = genericSchemas;

const addressSchema = buildAddressSchema(false);

export const schema = {
  type: 'object',
  properties: {
    schoolInformation: {
      type: 'object',
      properties: {
        schoolName: genericTextInput,
        trainingProgram: genericTextInput,
        schoolAddress: addressSchema,
      },
    },
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
    schoolAddress: {
      ...{ 'ui:title': 'School’s address' },
      ...addressUISchema(false, 'schoolInformation.schoolAddress', formData =>
        isChapterFieldRequired(formData, TASK_KEYS.report674),
      ),
    },
  },
};
