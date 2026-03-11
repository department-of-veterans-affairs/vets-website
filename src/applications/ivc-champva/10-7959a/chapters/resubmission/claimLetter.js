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

export default {
  uiSchema: {
    ...titleUI(
      content['resubmission-letter-upload--page-title'],
      ResubmissionLetterDescription,
    ),
    ...descriptionUI(FileUploadDescription),
    ...llmUploadAlertUI,
    resubmissionLetterUpload: attachmentUI({
      label: content['resubmission-letter-upload--input-label'],
      attachmentId: 'EOB',
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
