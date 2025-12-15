import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadBlurb } from '../../../shared/components/fileUploads/attachments';
import {
  fileUploadUi as fileUploadUI,
  singleFileSchema,
} from '../../../shared/components/fileUploads/upload';
import { blankSchema } from '../../definitions';

const TITLE_TEXT = 'Upload Medicare Part D card';
const DESC_TEXT =
  'You’ll need to submit a copy of the front and back of the beneficiary’s Medicare Part D card.';

const INPUT_LABELS = {
  cardFront: 'Upload front of Medicare Part D card',
  cardBack: 'Upload back of Medicare Part D card',
};

const ATTACHMENT_IDS = {
  cardFront: 'Front of Medicare Part D card',
  cardBack: 'Back of Medicare Part D card',
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    ...fileUploadBlurb,
    applicantMedicarePartDCardFront: fileUploadUI({
      label: INPUT_LABELS.cardFront,
      attachmentId: ATTACHMENT_IDS.cardFront,
    }),
    applicantMedicarePartDCardBack: fileUploadUI({
      label: INPUT_LABELS.cardBack,
      attachmentId: ATTACHMENT_IDS.cardBack,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartDCardFront: singleFileSchema,
      applicantMedicarePartDCardBack: singleFileSchema,
    },
  },
};
