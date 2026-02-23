import {
  ssnSchema,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';
import { validateSponsorSsn } from '../../utils/validations';

const TITLE_TEXT = '%s identification information';

const OPTS = { matchRole: 'sponsor', other: content['noun--veteran'] };
const PAGE_TITLE = titleWithRoleUI(TITLE_TEXT, null, OPTS);

export default {
  uiSchema: {
    ...PAGE_TITLE,
    sponsorSsn: {
      ...ssnUI(),
      'ui:validations': [validateSponsorSsn],
    },
  },
  schema: {
    type: 'object',
    required: ['sponsorSsn'],
    properties: {
      sponsorSsn: ssnSchema,
    },
  },
};
