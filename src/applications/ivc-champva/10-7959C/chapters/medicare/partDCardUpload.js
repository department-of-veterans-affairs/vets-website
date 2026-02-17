import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-d-card-title'];
const DESC_TEXT = content['medicare--part-d-card-description'];

const INPUT_LABELS = {
  cardFront: content['medicare--part-d-card-label--front'],
  cardBack: content['medicare--part-d-card-label--back'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    ...descriptionUI(FileUploadDescription),
    medicarePartDFrontCard: attachmentUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareDCardFront,
    }),
    medicarePartDBackCard: attachmentUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareDCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartDFrontCard', 'medicarePartDBackCard'],
    properties: {
      medicarePartDFrontCard: singleAttachmentSchema,
      medicarePartDBackCard: singleAttachmentSchema,
    },
  },
};
