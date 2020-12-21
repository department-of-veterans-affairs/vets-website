import ContactInfoCard from '../../components/ContactInfoCard';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

const definitions = {
  phone: {
    type: 'string',
    pattern: '^\\d{10}$',
  },
  email: {
    type: 'string',
    minLength: 6,
    maxLength: 80,
    pattern:
      '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
  },
};

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description':
    'This is the contact information we have on file for you. Please verify that this information is correct.',
  mailingAddress: {
    'ui:field': ContactInfoCard,
  },
  contactInfo: {
    'ui:description':
      "We'll contact you about your request with the phone number and email address below.",
    phoneNumber: {
      ...phoneUI('Phone number'),
      'ui:options': {
        classNames: 'input-size-7',
      },
    },
    primaryEmail: {
      ...emailUI('Email address'),
      'ui:options': {
        classNames: 'input-size-7',
      },
    },
    confirmationEmail: {
      ...emailUI('Re-enter email address'),
      'ui:options': {
        classNames: 'input-size-7',
        hideOnReview: true,
      },
      'ui:validations': [
        {
          validator: (errors, fieldData, formData) => {
            const { primaryEmail, confirmationEmail } = formData.contactInfo;
            if (primaryEmail !== confirmationEmail) {
              errors.addError('Email does not match');
            }
          },
        },
      ],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    mailingAddress: {
      type: 'object',
      properties: {
        streetAddress: {
          type: 'string',
        },
        cityState: {
          type: 'string',
        },
        country: {
          type: 'string',
        },
      },
    },
    contactInfo: {
      type: 'object',
      properties: {
        phoneNumber: definitions.phone,
        primaryEmail: definitions.email,
        confirmationEmail: definitions.email,
      },
    },
  },
};
