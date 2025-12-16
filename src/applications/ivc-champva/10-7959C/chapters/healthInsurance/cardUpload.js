import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';
import FileUploadDescription from '../../components/FormDescriptions/FileUploadDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import { ATTACHMENT_IDS } from '../../utils/constants';

const TITLE_TEXT = 'Upload %s health insurance card';
const DESC_TEXT =
  'You’ll need to submit a copy of the front and back of this health insurance card.';

const INPUT_LABELS = {
  cardFront: 'Upload front of the health insurance card',
  cardBack: 'Upload back of the health insurance card',
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
