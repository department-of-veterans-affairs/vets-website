import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { marriageTypeInformation } from '../current-marriage-information/helpers';
import { AdditionalEvidence } from '../../../../components/AdditionalEvidence';

export const schema = {
  type: 'object',
  properties: {
    marriageAdditionalEvidence: {
      type: 'object',
      properties: {
        'view:additionalEvidenceDescription': {
          type: 'object',
          properties: {},
        },
        spouseEvidenceDocumentType: {
          type: 'string',
          enum: ['14', '61', '119', '10'],
          enumNames: [
            'Affidavit',
            'Marriage Certificate / License',
            'VA 21-4171 Supporting Statement Regarding Marriage',
            'Unknown',
          ],
        },
        spouseSupportingDocuments: fileInputSchema,
      },
    },
  },
};

export const uiSchema = {
  'ui:title': 'Additional evidence needed to add spouse',
  'view:additionalEvidenceDescription': {
    'ui:description': AdditionalEvidence(marriageTypeInformation),
  },
  spouseEvidenceDocumentType: {
    'ui:title': 'Type of evidence',
    'ui:options': {
      hideOnReview: true,
    },
  },
  // spouseSupportingDocuments: fileUploadUI('Additional Evidence needed', {
  //   buttonText: 'Upload supporting documents',
  //   fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
  //   showFieldLabel: false,
  //   fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
  // }),
  spouseSupportingDocuments: fileInputUI({
    title: 'test',
    description: 'test2',
    required: true,
  }),
};
