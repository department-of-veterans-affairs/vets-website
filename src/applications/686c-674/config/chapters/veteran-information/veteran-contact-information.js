import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  titleUI,
  phoneUI,
  internationalPhoneUI,
  emailUI,
  phoneSchema,
  internationalPhoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  veteranContactInformation: {
    ...titleUI('Phone and email address'),
    phoneNumber: {
      ...phoneUI(),
      'ui:required': () => true,
    },
    internationalPhoneNumber: {
      ...internationalPhoneUI('International phone number'),
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
        internationalPhoneNumber: internationalPhoneSchema,
        emailAddress: emailSchema,
        electronicCorrespondence: { type: 'boolean' },
      },
    },
  },
};
