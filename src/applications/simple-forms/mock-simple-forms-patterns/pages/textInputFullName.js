import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import fullNameUI from 'platform/forms/definitions/fullName';

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

export default {
  uiSchema: {
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
        'ui:title': 'VaTextInputField - Spouse\u2019s suffix',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      spouseFullNameOld: fullNameDef,
      spouseFullNameNew: fullNameDef,
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
