import {
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  fullNameMiddleInitialSchema,
  fullNameMiddleInitialUI,
} from '../../definitions';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';

const TITLE_TEXT = '%s name and date of birth';
const DESC_TEXT =
  'Enter the Veteran’s name and date of birth. We’ll use this information to confirm their eligibility.';

const OPTS = { matchRole: 'sponsor', other: content['noun--veteran'] };
const PAGE_TITLE = titleWithRoleUI(TITLE_TEXT, DESC_TEXT, OPTS);

export default {
  uiSchema: {
    ...PAGE_TITLE,
    sponsorName: fullNameMiddleInitialUI,
    sponsorDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['sponsorName', 'sponsorDob'],
    properties: {
      sponsorName: fullNameMiddleInitialSchema,
      sponsorDob: dateOfBirthSchema,
    },
  },
};
