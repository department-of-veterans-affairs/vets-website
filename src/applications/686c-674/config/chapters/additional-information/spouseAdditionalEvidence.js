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
      name: `file-input`,
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      formNumber: '686C-674-V2',
    }),
    'ui:options': {
      hideOnReview: true,
    },
  },
};
export const spouseAdditionalEvidence = {
  uiSchema,
  schema,
};
