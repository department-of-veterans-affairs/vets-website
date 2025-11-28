import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../../shared/components/fileUploads/attachments';
import MedicareIneligibilityDescription from '../../components/FormDescriptions/MedicareIneligibilityDescription';
import { blankSchema } from '../medicareInformation';

// TODO: Consolidate into definitions file when merged together
const fileUploadSchema = {
  type: 'array',
  maxItems: 1,
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
};

export default {
  uiSchema: {
    ...titleUI(
      'Upload proof of Medicare ineligibility',
      MedicareIneligibilityDescription,
    ),
    ...fileUploadBlurb,
    applicantMedicarePartADenialProof: fileUploadUI({
      label: 'Upload proof of Medicare ineligibility',
      attachmentId: 'Letter from the SSA',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicarePartADenialProof'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartADenialProof: fileUploadSchema,
    },
  },
};
