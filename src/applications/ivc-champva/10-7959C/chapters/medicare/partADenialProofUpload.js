import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import MedicareIneligibilityDescription from '../../components/FormDescriptions/MedicareIneligibilityDescription';
import { attachmentUI, singleAttachmentSchema } from '../../definitions';
import { ATTACHMENT_IDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--ineligibility-proof-title'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, MedicareIneligibilityDescription),
    medicarePartADenialProof: attachmentUI({
      label: TITLE_TEXT,
      attachmentId: ATTACHMENT_IDS.ssaLetter,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartADenialProof'],
    properties: {
      medicarePartADenialProof: singleAttachmentSchema,
    },
  },
};
