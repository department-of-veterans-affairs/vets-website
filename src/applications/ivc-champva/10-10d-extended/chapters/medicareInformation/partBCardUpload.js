import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicareCardDescription from '../../components/FormDescriptions/MedicareCardDescription';
import { MedicarePartBDescription } from '../../components/FormDescriptions/MedicarePlanDescriptions';
import { ATTACHMENT_IDS } from '../../constants';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-b-card-title'];
const INPUT_LABELS = {
  cardFront: content['medicare--part-b-card-label--front'],
  cardBack: content['medicare--part-b-card-label--back'],
};

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      TITLE_TEXT,
      MedicarePartBDescription,
    ),
    ...descriptionUI(MedicareCardDescription({ variant: 'partB' })),
    medicarePartBFrontCard: attachmentUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareAbCardFront,
    }),
    medicarePartBBackCard: attachmentUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareAbCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartBFrontCard', 'medicarePartBBackCard'],
    properties: {
      medicarePartBFrontCard: singleAttachmentSchema,
      medicarePartBBackCard: singleAttachmentSchema,
    },
  },
};
