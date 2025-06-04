import {
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3InternationalPhone: {
      ...internationalPhoneUI({
        title: 'Web component v3 file input',
      }),
      'ui:validations': [
        (errors, value) => {
          if (value) {
            if (!value.isValid) {
              if (!value.countryCode) {
                errors.addError('Select a country.');
              } else if (!value.contact) {
                errors.addError('Enter a phone number.');
              }
            }
          } else {
            errors.addError('Select a country and enter a phone number.');
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      wcv3InternationalPhone: internationalPhoneSchema,
    },
    required: ['wcv3InternationalPhone'],
  },
};
