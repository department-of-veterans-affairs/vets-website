import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  fullNameMiddleInitialSchema,
  fullNameMiddleInitialUI,
} from '../../definitions';

const TITLE_TEXT = 'name';

const PAGE_TITLE = ({ formData }) =>
  `${
    formData.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
  } ${TITLE_TEXT}`;

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantName: fullNameMiddleInitialUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantName: fullNameMiddleInitialSchema,
    },
  },
};
