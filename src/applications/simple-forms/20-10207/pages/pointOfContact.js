import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { PREPARER_TYPES } from '../config/constants';

/** @type {PageSchema} */
const pageSchema = {
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
    pointOfContactEmail: emailToSendNotificationsUI({
      hint:
        'We’ll use this email to send your point of contact notifications about your form submission',
      required: formData =>
        (formData.preparerType === PREPARER_TYPES.VETERAN &&
          !formData.veteranEmailAddress) ||
        (formData.preparerType === PREPARER_TYPES.NON_VETERAN &&
          !formData.nonVeteranEmailAddress),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      pointOfContactName: {
        type: 'string',
        maxLength: 40,
      },
      pointOfContactPhone: phoneSchema,
      pointOfContactEmail: emailToSendNotificationsSchema,
    },
  },
};

export default pageSchema;
