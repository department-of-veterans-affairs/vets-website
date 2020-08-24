import { isVeteran } from '../../helpers';
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
        vaFileNumber: {
          type: 'string',
        },
        ssn: {
          type: 'string',
        },
      },
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    fullName: {
      first: {
        'ui:title': 'First Name',
        'ui:required': formData => isVeteran(formData),
      },
      middle: {
        'ui:title': 'Middle Name',
      },
      last: {
        'ui:title': 'Last Name',
        'ui:required': formData => isVeteran(formData),
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },
    },
    vaFileNumber: {
      'ui:title': 'Your VA file number',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    ssn: {
      ...ssnUI,
    },
  },
};
