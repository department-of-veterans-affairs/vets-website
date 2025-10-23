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

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      content['applicants--personal-info-title'],
      content['applicants--personal-info-description'],
    ),
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
