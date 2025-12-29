import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-c-card-title'];
const DESC_TEXT = content['medicare--part-c-card-description'];

const INPUT_LABELS = {
  cardFront: content['medicare--part-c-card-label--front'],
  cardBack: content['medicare--part-c-card-label--back'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    ...descriptionUI(FileUploadDescription),
    medicarePartCFrontCard: attachmentUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareCCardFront,
    }),
    medicarePartCBackCard: attachmentUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareCCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartCFrontCard', 'medicarePartCBackCard'],
    properties: {
      medicarePartCFrontCard: singleAttachmentSchema,
      medicarePartCBackCard: singleAttachmentSchema,
    },
  },
};
