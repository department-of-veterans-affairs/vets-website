import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

const { usaPhone } = commonDefinitions;

const contactInformation2 = {
  uiSchema: {
    daytimePhone: phoneUI('Daytime phone number'),
    eveningPhone: phoneUI('Evening phone number'),
    cellPhone: phoneUI('Cell phone number'),
    email: {
      'ui:title': 'Email address',
    },
  },
  schema: {
    type: 'object',
    required: ['daytimePhone'],
    properties: {
      daytimePhone: usaPhone,
      eveningPhone: usaPhone,
      cellPhone: usaPhone,
      email: {
        type: 'string',
        format: 'email',
      },
    },
  },
};

export default contactInformation2;
