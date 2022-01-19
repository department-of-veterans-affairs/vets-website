import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

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
  'view:confirmEmail': Object.assign({}, emailUI(), {
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
  }),
};
