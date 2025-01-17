import {
  fileInputUI,
  fileInputSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { SpouseAdditionalEvidence } from '../../../components/SpouseAdditionalEvidence';

const schema = {
  type: 'object',
  properties: {
    marriageAdditionalEvidence: {
      type: 'object',
      properties: {
        'view:additionalEvidenceDescription': {
          type: 'object',
          properties: {},
        },
        spouseSupportingDocuments: fileInputSchema,
      },
      required: ['spouseSupportingDocuments'],
    },
  },
};

const uiSchema = {
  ...titleUI('Submit supporting evidence to add your spouse'),
  marriageAdditionalEvidence: {
    'view:additionalEvidenceDescription': {
      'ui:description': SpouseAdditionalEvidence,
    },
    spouseSupportingDocuments: fileInputUI({
      title: 'Upload supporting documents',
      // description: 'You can upload your files online now, or send us your documents later. If you want to send us your documents later, we\'ll provide instructions at the end of this form.',
      // hint: 'File types you can upload: JPEG, JPG, PNG or PDF. You can upload multiple files, but they have to add up to 10 MB or less.',
      name: `file-input`,
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      formNumber: '686C-674-V2',
    }),
  },
};
export const spouseAdditionalEvidence = {
  uiSchema,
  schema,
};
