import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  ResubmissionAddtlDocsDescription,
  ResubmissionAddtlDocsUploadDescription,
} from '../../components/FormDescriptions/ResubmissionDescriptions';
import {
  attachmentSchema,
  attachmentUI,
  llmResponseAlertSchema,
  llmResponseAlertUI,
  llmUploadAlertSchema,
  llmUploadAlertUI,
} from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['resubmission--addtl-docs-title'];
const INPUT_LABEL = content['resubmission--addtl-docs-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, ResubmissionAddtlDocsDescription),
    ...descriptionUI(ResubmissionAddtlDocsUploadDescription),
    ...llmUploadAlertUI,
    claimAddtlDocsUpload: attachmentUI({ label: INPUT_LABEL }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    properties: {
      ...llmUploadAlertSchema,
      claimAddtlDocsUpload: attachmentSchema,
      ...llmResponseAlertSchema,
    },
  },
};
