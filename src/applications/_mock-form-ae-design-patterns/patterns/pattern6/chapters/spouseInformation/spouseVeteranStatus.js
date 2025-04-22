import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export default {
  uiSchema: {
    ...titleUI('Is your spouse a Veteran?'),
    isSpouseVeteran: {
      'ui:title': ' ',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    },
    spouseVeteranInfo: {
      'ui:options': {
        expandUnder: 'isSpouseVeteran',
        expandUnderCondition: true,
      },
      vaFileNumber: {
        'ui:title': 'VA File Number',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          pattern: 'File number must be 8 or 9 digits',
        },
      },
      militaryServiceNumber: {
        'ui:title': 'Military Service Number',
        'ui:webComponentField': VaTextInputField,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['isSpouseVeteran'],
    properties: {
      isSpouseVeteran: {
        type: 'boolean',
      },
      spouseVeteranInfo: {
        type: 'object',
        properties: {
          vaFileNumber: {
            type: 'string',
            pattern: '^[0-9]{8,9}$',
          },
          militaryServiceNumber: {
            type: 'string',
          },
        },
      },
    },
  },
};
