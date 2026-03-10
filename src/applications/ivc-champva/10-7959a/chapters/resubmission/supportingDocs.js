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

export default {
  uiSchema: {
    ...titleUI(
      content['resubmission-docs-upload--page-title'],
      ResubmissionDocsDescription,
    ),
    ...descriptionUI(ResubmissionDocsUploadDescription),
    ...llmUploadAlertUI,
    resubmissionDocsUpload: attachmentUI({
      label: content['resubmission-docs-upload--input-label'],
      attachmentId: 'MEDDOC',
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
