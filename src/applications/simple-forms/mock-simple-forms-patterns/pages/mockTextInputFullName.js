// @ts-check
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import fullNameOldUI from 'platform/forms/definitions/fullName';
import {
  titleSchema,
  titleUI,
  fullNameUI,
  fullNameSchema,
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
    rjsf: titleUI('RJSF'),
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
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    spouseFullNameNew: {
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
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
    spouseFullNameNewV3: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      spouseFullNameOld: fullNameDef,
      wc: titleSchema,
      spouseFullNameNew: fullNameSchema,
      wcv3: titleSchema,
      spouseFullNameNewV3: fullNameSchema,
    },
    required: [],
  },
};
