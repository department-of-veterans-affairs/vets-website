import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';
import {
  fileInputMultipleSchema,
  fileInputMultipleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const PAGE_DESCRIPTION = (
  <>
    <p>
      You can upload documents to support your claim. This step is optional.
    </p>
    <VaAlert status="info" uswds visible class="vads-u-margin-bottom--3">
      <h2 slot="headline">What you can upload</h2>
      <ul className="vads-u-margin-top--1">
        <li>Medical records and treatment history</li>
        <li>Doctor’s statements or reports</li>
        <li>Employment records or termination letters</li>
        <li>Disability retirement documentation</li>
        <li>Any other evidence that supports your claim</li>
      </ul>
    </VaAlert>
  </>
);

const FILE_UPLOAD_DESCRIPTION = (
  <p className="vads-u-margin-top--0">
    Drag and drop your files here, or choose files from your device.
  </p>
);

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Uploading supporting documents'),
    'ui:description': PAGE_DESCRIPTION,
    supportingDocuments: {
      ...fileInputMultipleUI({
        title: 'Upload supporting documents (optional)',
        description: FILE_UPLOAD_DESCRIPTION,
        required: false,
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        accept: '.pdf,.jpg,.jpeg,.png',
        maxFileSize: MAX_FILE_SIZE_BYTES,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: fileInputMultipleSchema(),
    },
  },
};
