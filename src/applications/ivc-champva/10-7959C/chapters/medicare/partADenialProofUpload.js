import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicareIneligibilityDescription from '../../components/FormDescriptions/MedicareIneligibilityDescription';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-a-denial-proof-title'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, MedicareIneligibilityDescription),
    ...descriptionUI(FileUploadDescription),
    medicareIneligibilityUpload: attachmentUI({
      label: TITLE_TEXT,
      attachmentId: ATTACHMENT_IDS.ssaLetter,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicareIneligibilityUpload'],
    properties: {
      medicareIneligibilityUpload: singleAttachmentSchema,
    },
  },
};
