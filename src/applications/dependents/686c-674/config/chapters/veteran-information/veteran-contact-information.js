import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  titleUI,
  phoneUI,
  internationalPhoneUI,
  emailUI,
  phoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const dependentsIntPhoneSchema = {
  type: 'string',
  pattern: /^\d{1,11}$/,
};

export const uiSchema = {
  veteranContactInformation: {
    ...titleUI('Phone and email address'),
    phoneNumber: {
      ...phoneUI(),
      'ui:required': () => true,
    },
    internationalPhoneNumber: {
      ...internationalPhoneUI({
        title: 'International phone number',
        international: true,
      }),
      'ui:errorMessages': {
        pattern: 'Enter a valid international phone number up to 11-digits',
      },
    },
    emailAddress: {
      ...emailUI('Email address'),
      'ui:required': () => true,
      'ui:options': {
        classNames: 'vads-u-margin-bottom--3',
      },
    },
    electronicCorrespondence: {
      'ui:title':
        'I agree to receive electronic correspondence from the VA about my claim.',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        messageAriaDescribedby: `I agree to receive electronic correspondence from the VA about my claim`,
        classNames: 'custom-width',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    veteranContactInformation: {
      type: 'object',
      properties: {
        phoneNumber: phoneSchema,
        internationalPhoneNumber: dependentsIntPhoneSchema,
        emailAddress: emailSchema,
        electronicCorrespondence: { type: 'boolean' },
      },
    },
  },
};
