import {
  emailUI,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your organization’s contact information',
      'We’ll contact your organization at the email address and phone number you provide here.',
    ),
    yourOrganizationContactInfoEmail: {
      ...emailUI(),
      'ui:errorMessages': {
        required: 'Enter an email address',
        format:
          'Enter a valid email address using the format email@domain.com.',
        symbols:
          'You entered a character we can’t accept. Try removing spaces and any special characters like commas or brackets.',
      },
    },
    yourOrganizationContactInfoPhone: {
      ...phoneUI(),
      'ui:errorMessages': {
        required: 'Enter a phone number',
        pattern: 'Phone number should be between 10-15 digits long',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      yourOrganizationContactInfoEmail: {
        type: 'string',
        maxLength: 50,
      },
      yourOrganizationContactInfoPhone: {
        type: 'string',
        maxLength: 15,
        pattern: '^[0-9\\(][0-9\\-\\(\\)\\s]{9,14}$',
      },
    },
    required: [
      'yourOrganizationContactInfoEmail',
      'yourOrganizationContactInfoPhone',
    ],
  },
};
