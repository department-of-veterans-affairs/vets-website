import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadBlurb } from '../../../shared/components/fileUploads/attachments';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import { blankSchema } from '../../definitions';

// TODO: consolodate into definitions file once all configs are merged
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
      'Upload Medicare card for Hospital and Medical insurance',
      'You’ll need to submit a copy of the front and back of the beneficiary’s Medicare Part C (Medicare Advantage Plan) card.',
    ),
    ...fileUploadBlurb,
    applicantMedicarePartCFrontCard: fileUploadUI({
      label: 'Upload front of Part C Medicare card',
      attachmentId: 'Front of Medicare Part C card',
    }),
    applicantMedicarePartCBackCard: fileUploadUI({
      label: 'Upload back of Part C Medicare card',
      attachmentId: 'Back of Medicare Part C card',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartCFrontCard',
      'applicantMedicarePartCBackCard',
    ],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartCFrontCard: fileUploadSchema,
      applicantMedicarePartCBackCard: fileUploadSchema,
    },
  },
};
