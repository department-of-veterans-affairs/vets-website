import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { ContactInfoDescription } from '../../../components/FormDescriptions';

const { email, homePhone, mobilePhone } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': ContactInfoDescription,
    email: emailUI(),
    homePhone: phoneUI('Home telephone number'),
    mobilePhone: phoneUI('Mobile telephone number'),
  },
  schema: {
    type: 'object',
    properties: { email, homePhone, mobilePhone },
  },
};
