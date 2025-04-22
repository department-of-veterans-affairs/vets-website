import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export default {
  uiSchema: {
    ...titleUI('Date and location of marriage'),
    dateOfMarriage: currentOrPastDateUI('Date'),
    locationOfMarriage: {
      'ui:title': 'Location',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter the location of your marriage',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfMarriage', 'locationOfMarriage'],
    properties: {
      dateOfMarriage: currentOrPastDateSchema,
      locationOfMarriage: {
        type: 'string',
      },
    },
  },
};
