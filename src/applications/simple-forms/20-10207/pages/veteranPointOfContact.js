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
      "Veteran's point of contact",
      'To help us process this request, it helps us to be able to get in touch with the Veteran. Please provide the name and telephone number of someone who can help us locate the Veteran.',
    ),
    pointOfContactName: {
      'ui:title': "Name of Veteran's point of contact",
      'ui:webComponentField': VaTextInputField,
    },
    pointOfContactPhone: phoneUI(
      "Telephone number of Veteran's point of contact",
    ),
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
