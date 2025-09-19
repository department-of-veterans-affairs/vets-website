import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your Veteran status'),
    isVeteran: {
      ...radioUI({
        title: 'Are you a Veteran?',
        options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        errorMessages: {
          required: 'Select Yes or No',
        },
      }),
      'ui:options': { useV3: true },
    },
  },
  schema: {
    type: 'object',
    required: ['isVeteran'],
    properties: {
      isVeteran: {
        type: 'string',
        enum: ['yes', 'no'],
        enumNames: ['Yes', 'No'],
      },
    },
  },
};
