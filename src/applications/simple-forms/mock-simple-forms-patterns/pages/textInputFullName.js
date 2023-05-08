import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import fullNameUI from 'platform/forms/definitions/fullName';
import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

/** @type {PageSchema} */
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
      ...fullNameUI,
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
        'ui:title': 'TextWidget - Spouse\u2019s suffix',
      },
    },
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    spouseFullNameNew: {
      ...fullNameUI,
      first: {
        'ui:title': 'VaTextInputField - Spouse\u2019s first name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      last: {
        'ui:title': 'VaTextInputField - Spouse\u2019s last name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      middle: {
        'ui:title': 'VaTextInputField - Spouse\u2019s middle name',
        'ui:webComponentField': VaTextInputField,
      },
      suffix: {
        'ui:webComponentField': VaSelectField,
        'ui:title': 'VaTextInputField - Spouse\u2019s suffix',
      },
    },
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
    spouseFullNameNewV3: {
      ...fullNameUI,
      first: {
        'ui:title': 'VaTextInputField - Spouse\u2019s first name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
        'ui:options': {
          uswds: true,
        },
      },
      last: {
        'ui:title': 'VaTextInputField - Spouse\u2019s last name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
        'ui:options': {
          uswds: true,
        },
      },
      middle: {
        'ui:title': 'VaTextInputField - Spouse\u2019s middle name',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          uswds: true,
        },
      },
      suffix: {
        'ui:title': 'VaTextInputField - Spouse\u2019s suffix',
        'ui:webComponentField': VaSelectField,
        'ui:options': {
          uswds: true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema(),
      spouseFullNameOld: fullNameDef,
      wc: titleSchema(),
      spouseFullNameNew: fullNameDef,
      wcv3: titleSchema(),
      spouseFullNameNewV3: fullNameDef,
    },
    required: [],
  },
  // initialData: {
  //   spouseFullNameOld: {
  //     first: 'Jane',
  //     last: 'Doe',
  //   },
  //   spouseFullNameNew: {
  //     first: 'John',
  //     last: 'Doe',
  //   },
  // },
};
