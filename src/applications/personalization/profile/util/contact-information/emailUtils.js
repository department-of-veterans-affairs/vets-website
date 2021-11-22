export const emailFormSchema = {
  type: 'object',
  properties: {
    emailAddress: {
      type: 'string',
      // This regex was taken from the HCA but modified to allow leading and
      // trailing whitespace to reduce false errors. The `convertDataToPayload`
      // method will clean up the whitespace before submission
      pattern:
        '^(\\s)*(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))(\\s)*$',
    },
  },
  required: ['emailAddress'],
};

export const emailUiSchema = {
  emailAddress: {
    'ui:title': 'Email Address',
    'ui:errorMessages': {
      required: 'Please enter your email address, using this format: X@X.com',
      pattern:
        'Please enter your email address again, using this format: X@X.com',
    },
  },
};

export const emailConvertCleanDataToPayload = value => {
  return { ...value, emailAddress: value.emailAddress.trim() };
};
