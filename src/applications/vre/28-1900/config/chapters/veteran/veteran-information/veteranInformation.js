import VeteranInformation from '../../../../containers/VeteranInformation';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation: {
      type: 'object',
      properties: {
        fullName: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
            },
            middle: {
              type: 'string',
            },
            last: {
              type: 'string',
            },
            suffix: {
              type: 'string',
              enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
            },
          },
        },
        ssn: {
          type: 'string',
        },
        VAFileNumber: {
          type: 'string',
        },
        dob: {
          type: 'string',
          pattern:
            '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
        },
      },
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:title': 'Veteran Information',
    'ui:field': VeteranInformation,
    fullName: {
      first: {
        'ui:title': 'Your first name',
      },
      middle: {
        'ui:title': 'Your middle name',
      },
      last: {
        'ui:title': 'Your last name',
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
      ...ssnUI,
    },
    VAFileNumber: {
      'ui:title': 'Your VA file number (*If different from SSN)',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    dob: currentOrPastDateUI('Date of birth'),
  },
};
