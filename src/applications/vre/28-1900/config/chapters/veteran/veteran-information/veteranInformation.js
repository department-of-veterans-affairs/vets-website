import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

import { isFieldRequired } from '../../../helpers';

const { veteranInformation } = fullSchema.properties;

export const schema = {
  type: 'object',
  properties: {
    veteranInformation,
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:title': 'Veteran Information',
    fullName: {
      first: {
        'ui:title': 'Your first name',
        'ui:required': formData => !isFieldRequired(formData, 'isLoggedIn'),
      },
      middle: {
        'ui:title': 'Your middle name',
      },
      last: {
        'ui:title': 'Your last name',
        'ui:required': formData => !isFieldRequired(formData, 'isLoggedIn'),
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    ssn: {
      'ui:title': 'Your Social Security number',
      'ui:required': formData => !isFieldRequired(formData, 'isLoggedIn'),
      ...ssnUI,
    },
    vaFileNumber: {
      'ui:title': 'Your VA file number (*If different from SSN)',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    dob: {
      ...currentOrPastDateUI('Date of birth'),
      'ui:required': formData => !isFieldRequired(formData, 'isLoggedIn'),
    },
  },
};
