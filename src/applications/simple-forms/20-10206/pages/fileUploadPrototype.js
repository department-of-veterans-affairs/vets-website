import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  titleUI,
  fileInputUI,
  fileInputSchema,
  selectUI,
  selectSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const DOCUMENT_TYPE_LABELS = {
  medical: 'Medical record',
  financial: 'Financial document',
  legal: 'Legal document',
  correspondence: 'Correspondence',
  other: 'Other',
};

const DocumentUploadView = ({ formData }) => (
  <div>
    <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
      {formData.documentUpload?.name || 'No file'}
    </h4>
    {formData.documentType && (
      <div>
        {DOCUMENT_TYPE_LABELS[formData.documentType] || formData.documentType}
      </div>
    )}
  </div>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Upload supporting documents (prototype)',
      'Upload one or more documents with a file and document type for each.',
    ),
    supportingDocuments: {
      'ui:options': {
        itemName: 'Document',
        itemAriaLabel: formData =>
          `Document ${formData.documentUpload?.name || ''}`,
        viewField: DocumentUploadView,
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        confirmRemoveDescription:
          'This will remove the uploaded document from your request.',
        useDlWrap: true,
        showSave: true,
        reviewMode: true,
        reviewItemHeaderLevel: '4',
        useVaCards: true,
        useCardStyle: true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        documentUpload: fileInputUI({
          title: 'Upload a document',
          required: false,
          fileUploadUrl: `${
            environment.API_URL
          }/simple_forms_api/v1/scanned_form_upload`,
          accept: '.png,.pdf,.jpg,.jpeg',
          hint: 'Upload a PNG, PDF, or JPG file',
          formNumber: '20-10206',
          skipUpload: true,
        }),
        documentType: selectUI({
          title: 'Document type',
          labels: {
            medical: 'Medical record',
            financial: 'Financial document',
            legal: 'Legal document',
            correspondence: 'Correspondence',
            other: 'Other',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: {
        type: 'array',
        minItems: 1,
        maxItems: 5,
        items: {
          type: 'object',
          properties: {
            documentUpload: fileInputSchema(),
            documentType: selectSchema([
              'medical',
              'financial',
              'legal',
              'correspondence',
              'other',
            ]),
          },
        },
      },
    },
  },
};
