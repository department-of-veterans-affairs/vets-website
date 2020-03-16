import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { isChapterFieldRequired } from '../../../helpers';
import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';

const { fullName, date } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    childNoLongerAtSchoolName: fullName,
    dateChildLeftSchool: date,
  },
};

export const uiSchema = {
  childNoLongerAtSchoolName: {
    'ui:validations': [validateName],
    first: {
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          'reportChild18OrOlderIsNotAttendingSchool',
        ),
      'ui:title': 'Child’s first name',
      'ui:errorMessages': { required: 'Please enter a first name' },
    },
    middle: { 'ui:title': 'Child’s middle name' },
    last: {
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          'reportChild18OrOlderIsNotAttendingSchool',
        ),
      'ui:title': 'Child’s last name',
      'ui:errorMessages': { required: 'Please enter a last name' },
    },
    suffix: {
      'ui:title': 'Child’s suffix',
      'ui:options': { widgetClassNames: 'form-select-medium' },
    },
  },
  dateChildLeftSchool: {
    ...currentOrPastDateUI('When did child stop attending school?'),
    ...{
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          'reportChild18OrOlderIsNotAttendingSchool',
        ),
    },
  },
};
