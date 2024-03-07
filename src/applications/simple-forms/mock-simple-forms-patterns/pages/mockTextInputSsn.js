import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
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
      vaFileNumber: {
        $ref: '#/definitions/vaFileNumber',
      },
      'view:wcv3Title': inlineTitleSchema,
      wcv3SsnNew: ssnOrVaFileNumberSchema,
    },
    required: ['wcv3SsnNew'],
  },
  initialData: {},
};
