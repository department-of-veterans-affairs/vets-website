import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['resubmission--provider-contact-title'];
const DESC_TEXT = content['resubmission--provider-contact-description'];

const INPUT_LABELS = {
  phone: content['resubmission--provider-phone-label'],
  fax: content['resubmission--provider-fax-label'],
  email: content['resubmission--provider-email-label'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    providerPhone: phoneUI(INPUT_LABELS.phone),
    providerFax: phoneUI(INPUT_LABELS.fax),
    providerEmail: emailUI(INPUT_LABELS.email),
  },
  schema: {
    type: 'object',
    required: ['providerPhone'],
    properties: {
      providerPhone: phoneSchema,
      providerFax: phoneSchema,
      providerEmail: emailSchema,
    },
  },
};
