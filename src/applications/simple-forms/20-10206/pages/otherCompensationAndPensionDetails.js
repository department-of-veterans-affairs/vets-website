import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Details about other compensation or pension records',
      'You requested access to another type of record that wasn’t listed. Any extra information you can share will help us find your records.',
    ),
    otherCompAndPenDetails: {
      'ui:title':
        'Describe the compensation or pension records you’d like to request',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required:
          'Describe the compensation or pension records you’re requesting.',
      },
      'ui:options': {
        charcount: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherCompAndPenDetails: {
        type: 'string',
        maxLength: 40,
      },
    },
    required: ['otherCompAndPenDetails'],
  },
};
