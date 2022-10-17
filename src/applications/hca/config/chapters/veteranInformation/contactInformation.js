import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import { ShortFormAlert } from '../../../components/FormAlerts';
import { ContactInfoDescription } from '../../../components/FormDescriptions';
import { NotHighDisability } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

const { email } = fullSchemaHca.properties;
const { phone } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'view:contactShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: NotHighDisability,
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
    },
    'view:contactInfoDescription': {
      'ui:description': ContactInfoDescription,
    },
    email: emailUI(),
    homePhone: phoneUI('Home telephone number'),
    mobilePhone: phoneUI('Mobile telephone number'),
  },
  schema: {
    type: 'object',
    properties: {
      'view:contactShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      'view:contactInfoDescription': emptyObjectSchema,
      email,
      homePhone: phone,
      mobilePhone: phone,
    },
  },
};
