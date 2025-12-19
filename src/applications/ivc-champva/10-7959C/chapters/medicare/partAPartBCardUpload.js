import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicarePartAPartBDescription from '../../components/FormDescriptions/MedicarePartAPartBDescription';
import MedicareCardDescription from '../../components/FormDescriptions/MedicareCardDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--parts-ab-card-title'];
const INPUT_LABELS = {
  cardFront: content['medicare--parts-ab-card-label--front'],
  cardBack: content['medicare--parts-ab-card-label--back'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, MedicarePartAPartBDescription),
    ...descriptionUI(MedicareCardDescription({ variant: 'partsAB' })),
    medicarePartAPartBFrontCard: attachmentUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareAbCardFront,
    }),
    medicarePartAPartBBackCard: attachmentUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareAbCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartAPartBFrontCard', 'medicarePartAPartBBackCard'],
    properties: {
      medicarePartAPartBFrontCard: singleAttachmentSchema,
      medicarePartAPartBBackCard: singleAttachmentSchema,
    },
  },
};
