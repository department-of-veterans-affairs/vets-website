import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  ResubmissionAddtlDocsDescription,
  ResubmissionAddtlDocsUploadDescription,
} from '../../components/FormDescriptions/ResubmissionDescriptions';
import { LLM_RESPONSE } from '../../components/llmUploadResponse';
import { LLM_UPLOAD_WARNING } from '../../components/llmUploadWarning';
import { attachmentSchema, attachmentUI, blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['resubmission--addtl-docs-title'];
const INPUT_LABEL = content['resubmission--addtl-docs-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, ResubmissionAddtlDocsDescription),
    ...descriptionUI(ResubmissionAddtlDocsUploadDescription),
    ...LLM_UPLOAD_WARNING,
    claimAddtlDocsUpload: attachmentUI({ label: INPUT_LABEL }),
    ...LLM_RESPONSE,
  },
  schema: {
    type: 'object',
    properties: {
      'view:fileClaim': blankSchema,
      claimAddtlDocsUpload: attachmentSchema,
      'view:uploadAlert': blankSchema,
    },
  },
};
