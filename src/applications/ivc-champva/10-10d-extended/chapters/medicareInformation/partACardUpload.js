import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import MedicareCardDescription from '../../components/FormDescriptions/MedicareCardDescription';
import { MedicarePartADescription } from '../../components/FormDescriptions/MedicarePlanDescriptions';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--part-a-card-title'];
const INPUT_LABELS = {
  cardFront: content['medicare--part-a-card-label--front'],
  cardBack: content['medicare--part-a-card-label--back'],
};

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      TITLE_TEXT,
      MedicarePartADescription,
    ),
    ...descriptionUI(MedicareCardDescription({ variant: 'partA' })),
    medicarePartAFrontCard: fileUploadUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareAbCardFront,
    }),
    medicarePartABackCard: fileUploadUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareAbCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartAFrontCard', 'medicarePartABackCard'],
    properties: {
      medicarePartAFrontCard: fileUploadSchema,
      medicarePartABackCard: fileUploadSchema,
    },
  },
};
