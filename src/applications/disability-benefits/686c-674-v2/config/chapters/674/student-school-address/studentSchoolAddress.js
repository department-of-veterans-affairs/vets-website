import cloneDeep from 'platform/utilities/data/cloneDeep';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';
import { report674 } from '../../../utilities';
import { kindOfTraining } from './helpers';

const addressSchema = buildAddressSchema(false);

const schoolInformationSchema = cloneDeep(
  report674.properties.studentSchoolAddress,
);
schoolInformationSchema.properties.schoolInformation.properties.address = addressSchema;

export const schema = schoolInformationSchema;

export const uiSchema = {
  schoolInformation: {
    'ui:title': 'School student will attend',
    name: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'School’s name',
      'ui:errorMessages': { required: 'Enter a school name' },
    },
    schoolType: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'Type of School',
    },
    trainingProgram: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': kindOfTraining,
    },
    address: {
      ...{ 'ui:title': 'School’s address' },
      ...addressUISchema(false, 'schoolInformation.address', formData =>
        isChapterFieldRequired(formData, TASK_KEYS.report674),
      ),
    },
  },
};
