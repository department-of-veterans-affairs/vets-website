import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { files } from '../../definitions';
import { showUploadDocuments } from '../../../helpers';

// TODO: Remove path ternary when pension_document_upload_update flipper is removed
const path = showUploadDocuments()
  ? 'additional-information/upload-documents'
  : 'temporarily-hidden-upload-documents';

const Description = (
  <>
    <p>
      You can submit your supporting documents and additional evidence with your
      pension claim.
    </p>
    <p>Guidelines to uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, or .png file.</li>
      <li>Your file should be no larger than 20MB.</li>
    </ul>
  </>
);

const UploadMessage = (
  <p>
    <strong>Note:</strong> You can choose to submit your supporting documents
    and additional evidence after submitting your pension claim. You’ll need to
    submit them by mail or upload them using the Claim Status Tool.
  </p>
);

export default {
  title: 'Upload documents',
  path,
  depends: () => showUploadDocuments(),
  uiSchema: {
    ...titleUI('Submit your supporting documents'),
    'ui:description': Description,
    files: fileUploadUI('', {
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      hideLabelText: true,
    }),
    'view:uploadMessage': {
      'ui:description': UploadMessage,
    },
  },
  schema: {
    type: 'object',
    properties: {
      files,
      'view:uploadMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};
