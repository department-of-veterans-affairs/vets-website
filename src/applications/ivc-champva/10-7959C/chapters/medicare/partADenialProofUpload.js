import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  fileUploadUi as fileUploadUI,
  singleFileSchema,
} from '../../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../../shared/components/fileUploads/attachments';
import MedicareIneligibilityDescription from '../../components/FormDescriptions/MedicareIneligibilityDescription';
import { blankSchema } from '../../definitions';

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
      applicantMedicarePartADenialProof: singleFileSchema,
    },
  },
};
