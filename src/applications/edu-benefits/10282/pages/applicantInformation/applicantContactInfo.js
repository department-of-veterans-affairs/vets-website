import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  emailUI,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const { usaPhone, email } = commonDefinitions;

export const uiSchema = {
  contactInfo: {
    ...titleUI('Phone and email address'),
    email: emailUI({
      errorMessages: {
        format:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
        pattern:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      },
    }),
    mobilePhone: {
      ...phoneUI('Mobile phone number'),
      'ui:webComponentField': VaTextInputField,
    },
    homePhone: {
      ...phoneUI('Home phone number'),
      'ui:webComponentField': VaTextInputField,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      required: ['email'],
      properties: {
        email,
        mobilePhone: usaPhone,
        homePhone: usaPhone,
      },
    },
  },
};
