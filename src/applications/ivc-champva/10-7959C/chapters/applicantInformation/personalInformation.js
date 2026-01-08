import {
  fullNameMiddleInitialSchema,
  fullNameMiddleInitialUI,
} from '../../definitions';
import { titleWithRoleUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicant--name-title'];

export default {
  uiSchema: {
    ...titleWithRoleUI(TITLE_TEXT),
    applicantName: fullNameMiddleInitialUI,
  },
  schema: {
    type: 'object',
    properties: {
      applicantName: fullNameMiddleInitialSchema,
    },
  },
};
