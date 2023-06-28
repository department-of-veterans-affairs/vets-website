// @ts-check
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import fullNameOldUI from 'platform/forms/definitions/fullName';
import {
  titleSchema,
  titleUI,
  fullNameUI,
  fullNameSchema,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

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
    rjsfTitle: titleUI('RJSF'),
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
    wcTitle: inlineTitleUI('Web component'),
    wcOldSpouseFullName: {
      ...fullNameOldUI,
      first: {
        'ui:title': 'TextWidget - Spouse\u2019s first name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
        'ui:options': {
          uswds: false,
        },
      },
      last: {
        'ui:title': 'TextWidget - Spouse\u2019s last name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
        'ui:options': {
          uswds: false,
        },
      },
      middle: {
        'ui:title': 'TextWidget - Spouse\u2019s middle name',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          uswds: false,
        },
      },
      suffix: {
        'ui:title': 'Select - Spouse\u2019s suffix',
        'ui:webComponentField': VaSelectField,
        'ui:options': {
          uswds: false,
        },
      },
    },
    wcv3Title: inlineTitleUI('Web component v3'),
    wcv3SpouseFullNameNew: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsfTitle: titleSchema,
      spouseFullNameOld: fullNameDef,
      wcTitle: inlineTitleSchema,
      wcOldSpouseFullName: fullNameSchema,
      wcv3Title: inlineTitleSchema,
      wcv3SpouseFullNameNew: fullNameSchema,
    },
    required: [],
  },
};
