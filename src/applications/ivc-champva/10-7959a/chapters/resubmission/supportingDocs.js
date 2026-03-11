import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  ResubmissionDocsDescription,
  ResubmissionDocsUploadDescription,
} from '../../components/FormDescriptions/ResubmissionDescriptions';
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

const TITLE_TEXT = content['resubmission-docs-upload--page-title'];
const INPUT_LABEL = content['resubmission-docs-upload--input-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, ResubmissionDocsDescription),
    ...descriptionUI(ResubmissionDocsUploadDescription),
    ...llmUploadAlertUI,
    resubmissionDocsUpload: attachmentUI({
      label: INPUT_LABEL,
      attachmentId: ATTACHMENT_IDS.meddoc,
    }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    required: ['resubmissionDocsUpload'],
    properties: {
      ...llmUploadAlertSchema,
      resubmissionDocsUpload: attachmentRequiredSchema,
      ...llmResponseAlertSchema,
    },
  },
};
