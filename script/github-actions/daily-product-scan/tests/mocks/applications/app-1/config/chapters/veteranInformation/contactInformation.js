import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import { validateMatch } from 'platform/forms-system/src/js/validation';

const { email } = fullSchemaHca.properties;
const { phone } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    'ui:validations': [validateMatch('email', 'view:emailConfirmation')],
    email: emailUI(),
    'view:emailConfirmation': emailUI('Re-enter email address'),
    homePhone: phoneUI('Home telephone number'),
    mobilePhone: phoneUI('Mobile telephone number'),
  },
  schema: {
    type: 'object',
    properties: {
      email,
      'view:emailConfirmation': email,
      homePhone: phone,
      mobilePhone: phone,
    },
  },
};
