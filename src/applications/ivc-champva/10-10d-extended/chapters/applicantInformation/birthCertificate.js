import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { attachmentSchema, attachmentUI } from '../../definitions';
import content from '../../locales/en/content.json';
import { ATTACHMENT_IDS } from '../../utils/constants';
import { arrayTitleWithNameUI } from '../../utils/titles';

const TITLE_TEXT = content['applicants--birth-certificate-title'];
const DESC_TEXT = content['applicants--birth-certificate-description'];
const INPUT_LABEL = content['applicants--birth-certificate-label'];

export default {
  uiSchema: {
    ...arrayTitleWithNameUI(TITLE_TEXT, DESC_TEXT),
    ...descriptionUI(FileUploadDescription),
    applicantBirthCertOrSocialSecCard: attachmentUI({
      label: INPUT_LABEL,
      attachmentId: ATTACHMENT_IDS.birthCert,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantBirthCertOrSocialSecCard'],
    properties: {
      applicantBirthCertOrSocialSecCard: attachmentSchema,
    },
  },
};
