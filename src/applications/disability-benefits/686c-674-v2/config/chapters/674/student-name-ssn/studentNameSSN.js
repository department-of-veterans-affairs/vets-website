import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { isChapterFieldRequired } from '../../../helpers';
import { validateName, report674 } from '../../../utilities';
import { NotificationText } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    studentNameAndSsn: report674.properties.studentNameAndSsn,
  },
};

export const uiSchema = {
  studentNameAndSsn: {
    'view:674Information': {
      'ui:description': NotificationText,
    },
    fullName: {
      'ui:validations': [validateName],
      first: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'report674'),
        'ui:title': 'Student’s first name',
        'ui:errorMessages': {
          required: 'Enter a first name',
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      middle: {
        'ui:title': 'Student’s middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
        'ui:errorMessages': {
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      last: {
        'ui:required': formData =>
          isChapterFieldRequired(formData, 'report674'),
        'ui:title': 'Student’s last name',
        'ui:errorMessages': {
          required: 'Enter a last name',
          pattern: 'This field accepts alphabetic characters only',
        },
      },
      suffix: {
        'ui:title': 'Student’s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
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
    isParent: {
      'ui:title': "Are you this child's parent?",
      'ui:widget': 'yesNo',
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
    },
    dependentIncome: {
      'ui:title': 'Did this dependent earn an income in the last 365 days?',
      'ui:widget': 'yesNo',
    },
  },
};
