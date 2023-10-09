import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';

export const title = 'Additional contact information';

export const schema = {
  type: 'object',
  title,
  properties: {
    phone: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    email: {
      type: 'string',
      maxLength: 256,
      format: 'email',
    },
    'view:confirmEmail': {
      type: 'string',
      maxLength: 256,
      format: 'email',
    },
  },
  required: ['phone', 'email'],
};

export const uiSchema = {
  phone: {
    ...phoneUI(),
    'ui:title': 'Phone number',
  },
  email: emailUI(),
  'view:confirmEmail': {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          if (
            formData.email.toLowerCase() !==
            formData['view:confirmEmail'].toLowerCase()
          ) {
            errors.addError(
              'This email does not match your previously entered email',
            );
          }
        },
      },
    ],
  },
};
