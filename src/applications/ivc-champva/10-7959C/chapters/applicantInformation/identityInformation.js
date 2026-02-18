import {
  ssnSchema,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicant--identity-info-title'];

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    applicantSsn: ssnUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantSsn'],
    properties: {
      applicantSsn: ssnSchema,
    },
  },
};
