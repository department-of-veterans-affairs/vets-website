// @ts-check
import fullNameOldUI from 'platform/forms/definitions/fullName';
import {
  titleUI,
  fullNameUI,
  fullNameSchema,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const fullNameDef = {
  type: 'object',
  properties: {
    first: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    middle: {
      type: 'string',
    },
    last: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
    },
    suffix: {
      type: 'string',
      enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
    },
  },
  required: ['first', 'last'],
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    spouseFullNameOld: {
      ...fullNameOldUI,
      first: {
        'ui:title': 'TextWidget - Spouse\u2019s first name',
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      last: {
        'ui:title': 'TextWidget - Spouse\u2019s last name',
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      middle: {
        'ui:title': 'TextWidget - Spouse\u2019s middle name',
      },
      suffix: {
        'ui:title': 'Select - Spouse\u2019s suffix',
      },
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3SpouseFullNameNew: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      spouseFullNameOld: fullNameDef,
      'view:wcv3Title': inlineTitleSchema,
      wcv3SpouseFullNameNew: fullNameSchema,
    },
    required: [],
  },
};
