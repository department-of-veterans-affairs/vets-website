import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';

const TITLE_TEXT = content['sponsor--contact-info-title'];
const DESC_TEXT = content['sponsor--contact-info-description'];

const OPTS = { matchRole: 'sponsor', other: content['noun--veteran'] };
const PAGE_TITLE = titleWithRoleUI(TITLE_TEXT, DESC_TEXT, OPTS);

export default {
  uiSchema: {
    ...PAGE_TITLE,
    sponsorPhone: phoneUI(),
    sponsorEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorPhone'],
    properties: {
      sponsorPhone: phoneSchema,
      sponsorEmail: emailSchema,
    },
  },
};
