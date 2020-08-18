import merge from 'lodash/merge';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { isDependent } from '../../helpers';

export const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      maxLength: 100,
    },
    middleName: {
      type: 'string',
      maxLength: 100,
    },
    lastName: {
      type: 'string',
      maxLength: 100,
    },
    suffix: {
      type: 'string',
      enum: ['Jr', 'Sr'],
    },
    ssn: {
      type: 'string',
    },
    dateOfBirth: {
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
      type: 'string',
    },
  },
};

export const uiSchema = {
  firstName: {
    'ui:title': 'First name',
    'ui:required': formData => isDependent(formData),
  },
  middleName: {
    'ui:title': 'Middle name',
  },
  lastName: {
    'ui:title': 'Middle name',
    'ui:required': formData => isDependent(formData),
  },
  suffix: {},
  ssn: {
    ...ssnUI,
    'ui:required': formData => isDependent(formData),
  },
  dateOfBirth: merge(currentOrPastDateUI('Date of birth'), {
    'ui:required': formData => isDependent(formData),
  }),
};
