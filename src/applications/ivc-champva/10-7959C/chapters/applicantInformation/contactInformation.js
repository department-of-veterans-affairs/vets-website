import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

const TITLE_TEXT = 'contact information';

const PAGE_TITLE = ({ formData }) =>
  privWrapper(
    `${nameWording(formData, undefined, undefined, true)} ${TITLE_TEXT}`,
  );

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
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
