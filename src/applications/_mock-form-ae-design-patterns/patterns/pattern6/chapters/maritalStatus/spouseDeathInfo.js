import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export default {
  uiSchema: {
    ...titleUI("Date and location of your spouse's death"),
    dateOfSpouseDeath: currentOrPastDateUI('Date'),
    locationOfSpouseDeath: {
      'ui:title': 'Location',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: "Please enter the location of your spouse's death",
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfSpouseDeath', 'locationOfSpouseDeath'],
    properties: {
      dateOfSpouseDeath: currentOrPastDateSchema,
      locationOfSpouseDeath: {
        type: 'string',
      },
    },
  },
};
