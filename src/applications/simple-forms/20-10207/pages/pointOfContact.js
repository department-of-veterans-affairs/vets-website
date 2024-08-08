import {
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your point of contact',
      'To help us process your request, it helps us to be able to get in touch with you. Please provide the name and telephone number of someone who can help us locate you.',
    ),
    pointOfContactName: {
      'ui:title': 'Name of your point of contact',
      'ui:webComponentField': VaTextInputField,
    },
    pointOfContactPhone: phoneUI('Telephone number of your point of contact'),
  },
  schema: {
    type: 'object',
    properties: {
      pointOfContactName: {
        type: 'string',
        maxLength: 40,
      },
      pointOfContactPhone: phoneSchema,
    },
  },
};
