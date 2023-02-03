import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

const { email, phone } = commonDefinitions;

const contactInformation2 = {
  uiSchema: {
    homePhone: phoneUI('Home phone number'),
    mobilePhone: phoneUI('Cell phone number'),
    email: {
      'ui:title': 'Email address',
    },
  },
  schema: {
    type: 'object',
    required: ['homePhone'],
    properties: {
      homePhone: phone,
      mobilePhone: phone,
      email,
    },
  },
};

export default contactInformation2;
