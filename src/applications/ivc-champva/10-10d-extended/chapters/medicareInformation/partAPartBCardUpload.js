import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import MedicareCardDescription from '../../components/FormDescriptions/MedicareCardDescription';
import { MedicarePartsAbDescription } from '../../components/FormDescriptions/MedicarePlanDescriptions';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--parts-ab-card-title'];
const INPUT_LABELS = {
  cardFront: content['medicare--parts-ab-card-label--front'],
  cardBack: content['medicare--parts-ab-card-label--back'],
};

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      TITLE_TEXT,
      MedicarePartsAbDescription,
    ),
    ...descriptionUI(MedicareCardDescription({ variant: 'partsAB' })),
    medicarePartAPartBFrontCard: fileUploadUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.medicareAbCardFront,
    }),
    medicarePartAPartBBackCard: fileUploadUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.medicareAbCardBack,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartAPartBFrontCard', 'medicarePartAPartBBackCard'],
    properties: {
      medicarePartAPartBFrontCard: fileUploadSchema,
      medicarePartAPartBBackCard: fileUploadSchema,
    },
  },
};
