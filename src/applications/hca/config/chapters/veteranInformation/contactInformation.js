import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import emailUI from '~/platform/forms-system/src/js/definitions/email';
import phoneUI from '~/platform/forms-system/src/js/definitions/phone';

import ShortFormAlert from '../../../components/FormAlerts/ShortFormAlert';
import { ContactInfoDescription } from '../../../components/FormDescriptions';
import { notShortFormEligible } from '../../../utils/helpers/form-config';
import { emptyObjectSchema } from '../../../definitions';

const { email, homePhone, mobilePhone } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:contactShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': { hideIf: notShortFormEligible },
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
      'view:contactInfoDescription': emptyObjectSchema,
      email,
      homePhone,
      mobilePhone,
    },
  },
};
