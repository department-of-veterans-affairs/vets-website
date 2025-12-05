import {
  arrayBuilderItemSubsequentPageTitleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  fullNameMiddleInitialSchema,
  fullNameMiddleInitialUI,
} from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--personal-info-title'];
const PAGE_DESC = content['applicants--personal-info-description'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT, PAGE_DESC),
    applicantName: fullNameMiddleInitialUI,
    applicantDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['applicantName', 'applicantDob'],
    properties: {
      applicantName: fullNameMiddleInitialSchema,
      applicantDob: dateOfBirthSchema,
    },
  },
};
