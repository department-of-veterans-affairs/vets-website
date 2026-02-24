import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--card-upload-title'];
const DESC_TEXT = content['health-insurance--card-upload-description'];

const INPUT_LABELS = {
  cardFront: content['health-insurance--card-upload-label--front'],
  cardBack: content['health-insurance--card-upload-label--back'],
};

export default {
  uiSchema: {
    ...healthInsurancePageTitleUI(TITLE_TEXT, DESC_TEXT),
    ...descriptionUI(FileUploadDescription),
    insuranceCardFront: attachmentUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.ohiCardFront,
    }),
    insuranceCardBack: attachmentUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.ohiCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['insuranceCardFront', 'insuranceCardBack'],
    properties: {
      insuranceCardFront: singleAttachmentSchema,
      insuranceCardBack: singleAttachmentSchema,
    },
  },
};
