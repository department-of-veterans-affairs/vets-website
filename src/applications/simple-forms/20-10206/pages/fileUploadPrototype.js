import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  titleUI,
  fileInputUI,
  fileInputSchema,
  selectUI,
  selectSchema,
  arrayStackUI,
  arrayStackSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const DOCUMENT_TYPE_LABELS = {
  medical: 'Medical record',
  financial: 'Financial document',
  legal: 'Legal document',
  correspondence: 'Correspondence',
  other: 'Other',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Upload supporting documents (prototype)',
      'Upload one or more documents with a file and document type for each.',
    ),
    supportingDocuments: arrayStackUI({
      nounSingular: 'document',
      fields: {
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
          labels: DOCUMENT_TYPE_LABELS,
        }),
      },
      getItemName: item => item?.documentUpload?.name || 'document',
      text: {
        deleteDescription:
          'This will remove the uploaded document from your request.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: arrayStackSchema({
        maxItems: 5,
        fields: {
          documentUpload: fileInputSchema(),
          documentType: selectSchema([
            'medical',
            'financial',
            'legal',
            'correspondence',
            'other',
          ]),
        },
      }),
    },
  },
};
