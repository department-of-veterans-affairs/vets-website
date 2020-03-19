import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import { isChapterFieldRequired } from '../../../helpers';
import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';
import { NotificationText } from './helpers';

const {
  fullName,
  genericNumberAndDashInput: identificationPattern,
  date,
} = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    'view:674Information': {
      type: 'object',
      properties: {},
    },
    studentFullName: fullName,
    studentSSN: identificationPattern,
    studentDOB: date,
  },
};

export const uiSchema = {
  'view:674Information': {
    'ui:description': NotificationText,
  },
  studentFullName: {
    'ui:validation': [validateName],
    first: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
      'ui:title': 'Student’s first name',
      'ui:errorMessages': { required: 'Please enter a first name' },
    },
    middle: {
      'ui:title': 'Student’s middle name',
    },
    last: {
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
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
  studentSSN: {
    ...ssnUI,
    ...{
      'ui:title': 'Student’s Social Security number',
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
    },
  },
  studentDOB: {
    ...currentOrPastDateUI('Student’s date of birth'),
    ...{
      'ui:required': formData => isChapterFieldRequired(formData, 'report674'),
    },
  },
};
