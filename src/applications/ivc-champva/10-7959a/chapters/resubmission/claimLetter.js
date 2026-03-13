import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { ResubmissionLetterDescription } from '../../components/FormDescriptions/ResubmissionDescriptions';
import {
  attachmentRequiredSchema,
  attachmentUI,
  llmResponseAlertSchema,
  llmResponseAlertUI,
  llmUploadAlertSchema,
  llmUploadAlertUI,
} from '../../definitions';
import content from '../../locales/en/content.json';
import { ATTACHMENT_IDS } from '../../utils/constants';

const TITLE_TEXT = content['resubmission-letter-upload--page-title'];
const INPUT_LABEL = content['resubmission-letter-upload--input-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, ResubmissionLetterDescription),
    ...descriptionUI(FileUploadDescription),
    ...llmUploadAlertUI,
    resubmissionLetterUpload: attachmentUI({
      label: INPUT_LABEL,
      attachmentId: ATTACHMENT_IDS.eob,
    }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    required: ['resubmissionLetterUpload'],
    properties: {
      ...llmUploadAlertSchema,
      resubmissionLetterUpload: attachmentRequiredSchema,
      ...llmResponseAlertSchema,
    },
  },
};
