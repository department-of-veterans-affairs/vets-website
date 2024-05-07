import React from 'react';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { report674 } from '../../../utilities';

export const schema = report674.properties.studentLastTerm;

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
  },
};
