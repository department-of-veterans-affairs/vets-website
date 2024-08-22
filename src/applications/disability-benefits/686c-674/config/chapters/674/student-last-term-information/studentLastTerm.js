import React from 'react';
import omit from 'lodash/omit';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import {
  isChapterFieldRequired,
  classesPerWeekUiSchema,
  hoursPerWeekUiSchema,
} from '../../../helpers';
import { addressUISchema } from '../../../address-schema';
import { report674 } from '../../../utilities';

export const schema = omit(report674.properties.studentLastTerm, [
  'properties.lastTermSchoolInformation.properties.name',
  'properties.lastTermSchoolInformation.properties.address',
  'properties.lastTermSchoolInformation.properties.classesPerWeek',
  'properties.lastTermSchoolInformation.properties.hoursPerWeek',
]);

export const uiSchema = {
  studentDidAttendSchoolLastTerm: {
    'ui:title': (
      <legend className="vads-u-font-size--base vads-u-font-weight--normal">
        Did student attend school last term? <strong>Note:</strong> This
        includes any kind of school or training, including high school.
      </legend>
    ),
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
    name: {
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
      'ui:title': 'Last term school’s name',
    },
    address: {
      'ui:title': 'Last term school’s address',
      'ui:options': {
        updateSchema: (formData, formSchema) =>
          !formData.studentDidAttendSchoolLastTerm
            ? { required: [] }
            : formSchema,
      },
      ...addressUISchema(
        false,
        'lastTermSchoolInformation.address',
        formData => formData.studentDidAttendSchoolLastTerm,
      ),
    },
    termBegin: {
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
      ...classesPerWeekUiSchema,
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
    },
    hoursPerWeek: {
      ...hoursPerWeekUiSchema,
      'ui:required': formData => formData.studentDidAttendSchoolLastTerm,
    },
  },
};
