import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicarePartADescription from '../../components/FormDescriptions/MedicarePartADescription';
import MedicareCardDescription from '../../components/FormDescriptions/MedicareCardDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-a-card-title'];
const INPUT_LABELS = {
  cardFront: content['medicare--part-a-card-label--front'],
  cardBack: content['medicare--part-a-card-label--back'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, MedicarePartADescription),
    ...descriptionUI(MedicareCardDescription({ variant: 'partA' })),
    medicarePartAFrontCard: attachmentUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareAbCardFront,
    }),
    medicarePartABackCard: attachmentUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareAbCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartAFrontCard', 'medicarePartABackCard'],
    properties: {
      medicarePartAFrontCard: singleAttachmentSchema,
      medicarePartABackCard: singleAttachmentSchema,
    },
  },
};
