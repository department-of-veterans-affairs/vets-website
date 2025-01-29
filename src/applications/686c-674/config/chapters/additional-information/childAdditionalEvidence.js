import {
  fileInputUI,
  fileInputSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { ChildAdditionalEvidence } from '../../../components/ChildAdditionalEvidence';

const schema = {
  type: 'object',
  properties: {
    childAdditionalEvidence: {
      type: 'object',
      properties: {
        'view:additionalEvidenceDescription': {
          type: 'object',
          properties: {},
        },
        childSupportingDocuments: fileInputSchema,
      },
    },
  },
};

const uiSchema = {
  ...titleUI('Upload your supporting evidence to add your child'),
  childAdditionalEvidence: {
    'view:additionalEvidenceDescription': {
      'ui:description': ChildAdditionalEvidence,
    },
    childSupportingDocuments: fileInputUI({
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

export const childAdditionalEvidence = {
  uiSchema,
  schema,
};
