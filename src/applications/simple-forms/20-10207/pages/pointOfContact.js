import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import environment from 'platform/utilities/environment';

/** @type {PageSchema} */
// eslint-disable-next-line import/no-mutable-exports
let pageSchema = {
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

// test on dev before making this change
if (environment.isDev() || environment.isLocalhost()) {
  pageSchema = {
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
        required: formData => !formData.emailAddress,
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
}

export default pageSchema;
