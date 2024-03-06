import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    ssn: ssnUI('Social security number'),
    vaFileNumber: {
      'ui:title': 'VA file number',
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3SsnNew: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ssn: {
        $ref: '#/definitions/ssn',
      },
      vaFileNumber: {
        $ref: '#/definitions/vaFileNumber',
      },
      'view:wcv3Title': inlineTitleSchema,
      wcv3SsnNew: ssnOrVaFileNumberSchema,
    },
    required: ['ssn', 'wcv3SsnNew'],
  },
  initialData: {},
};
