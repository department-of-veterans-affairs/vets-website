import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { FULL_SCHEMA } from '../../../utils/imports';
import { ContactInfoDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const { email, homePhone, mobilePhone } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['vet-info--contact-info-title'], ContactInfoDescription),
    email: emailUI(),
    homePhone: phoneUI(content['vet-info--contact-info-home-phone-label']),
    mobilePhone: phoneUI(content['vet-info--contact-info-mobile-phone-label']),
  },
  schema: {
    type: 'object',
    properties: { email, homePhone, mobilePhone },
  },
};
