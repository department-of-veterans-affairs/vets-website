import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { isChapterFieldRequired } from '../../../helpers';
import { validateName, report674 } from '../../../utilities';
import { NotificationText } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    studentNameAndSSN: report674.properties.studentNameAndSSN,
  },
};

export const uiSchema = {
  studentNameAndSSN: {
    'view:674Information': {
      'ui:description': NotificationText,
    },
    fullName: {
      'ui:validation': [validateName],
      first: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'report674'),
        'ui:title': 'Student’s first name',
        'ui:errorMessages': { required: 'Please enter a first name' },
      },
      middle: {
        'ui:title': 'Student’s middle name',
      },
      last: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'report674'),
        'ui:title': 'Student’s last name',
        'ui:errorMessages': { required: 'Please enter a last name' },
      },
      suffix: {
        'ui:title': 'Student’s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    ssn: {
      ...ssnUI,
      ...{
        'ui:title': 'Student’s Social Security number',
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'report674'),
      },
    },
    birthDate: {
      ...currentOrPastDateUI('Student’s date of birth'),
      ...{
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'report674'),
      },
    },
  },
};
