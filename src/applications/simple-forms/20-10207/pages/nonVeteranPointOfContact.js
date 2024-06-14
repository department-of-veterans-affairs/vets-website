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
      "Claimant's point of contact",
      'To help us process this request, it helps us to be able to get in touch with the claimant. Please provide the name and telephone number of someone who can help us locate the claimant.',
    ),
    pointOfContactName: {
      'ui:title': "Name of claimant's point of contact",
      'ui:webComponentField': VaTextInputField,
    },
    pointOfContactPhone: phoneUI(
      "Telephone number of claimant's point of contact",
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
