import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicant--contact-info-title'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantPhone: phoneUI(),
    applicantEmail: emailUI({
      hideIf: formData => formData.certifierRole === 'applicant',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantPhone'],
    properties: {
      applicantPhone: phoneSchema,
      applicantEmail: emailSchema,
    },
  },
};
