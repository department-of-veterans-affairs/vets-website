import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import { FULL_SCHEMA } from '../../../utils/imports';
import { ContactInfoDescription } from '../../../components/FormDescriptions';

const { email, homePhone, mobilePhone } = FULL_SCHEMA.properties;

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
