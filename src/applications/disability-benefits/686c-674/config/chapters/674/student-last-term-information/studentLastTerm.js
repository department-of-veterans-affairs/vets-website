import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';

import { StudentNameHeader } from '../helpers';

const { date, genericTextInput } = genericSchemas;

const addressSchema = buildAddressSchema(false);

export const schema = {
  type: 'object',
  properties: {
    studentDidAttendSchoolLastTerm: {
      type: 'boolean',
    },
    lastTermSchoolInformation: {
      type: 'object',
      properties: {
        schoolName: genericTextInput,
        schoolAddress: addressSchema,
        dateTermBegan: date,
        dateTermEnded: date,
        classesPerWeek: {
          type: 'number',
        },
        hoursPerWeek: {
          type: 'number',
        },
      },
    },
  },
};

export const uiSchema = {
  'ui:title': StudentNameHeader,
  studentDidAttendSchoolLastTerm: {
    'ui:title': 'Did student attend school last term?',
    'ui:widget': 'yesNo',
    'ui:required': formData =>
      isChapterFieldRequired(formData, TASK_KEYS.report674),
  },
  lastTermSchoolInformation: {
    'ui:options': {
      expandUnder: 'studentDidAttendSchoolLastTerm',
      expandUnderCondition: true,
    },
    'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
    schoolName: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Last term school’s name',
    },
    schoolAddress: {
      'ui:title': 'Last term school’s address',
      'ui:options': {
        updateSchema: (formData, formSchema) =>
          !formData.studentDidAttendSchoolLastTerm
            ? { required: [] }
            : formSchema,
      },
      ...addressUISchema(
        false,
        'lastTermSchoolInformation.schoolAddress',
        formData => formData.studentDidAttendSchoolLastTerm,
      ),
    },
    dateTermBegan: {
      ...currentOrPastDateUI('Date term began'),
      ...{
        'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      },
    },
    dateTermEnded: {
      ...currentOrPastDateUI('Date term ended'),
      ...{
        'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      },
    },
    classesPerWeek: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Number of classes a week',
      'ui:errorMessages': { required: 'Please enter a number' },
    },
    hoursPerWeek: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Hours a week',
      'ui:errorMessages': { required: 'Please enter a number' },
    },
  },
};
