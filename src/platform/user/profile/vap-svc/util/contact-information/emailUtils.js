import VaTextInputField from '~/platform/forms-system/src/js/web-component-fields/VaTextInputField';

export const emailFormSchema = {
  type: 'object',
  properties: {
    emailAddress: {
      type: 'string',
      format: 'email',
      maxLength: 255,
      pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$',
    },
  },
  required: ['emailAddress'],
};

export const emailUiSchema = {
  emailAddress: {
    'ui:title': 'Email address',
    'ui:autocomplete': 'email',
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      required: 'You must enter your email address, using this format: X@X.com',
      pattern:
        'You must enter your email address again, using this format: X@X.com',
    },
    'ui:options': {
      inputType: 'email',
    },
  },
};

export const emailConvertCleanDataToPayload = value => {
  return { ...value, emailAddress: value.emailAddress.trim() };
};
