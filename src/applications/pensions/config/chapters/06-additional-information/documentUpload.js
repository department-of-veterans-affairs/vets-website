import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { files } from '../../definitions';
import { showUploadDocuments } from '../../../helpers';

// TODO: Remove this page when pension_document_upload_update flipper is removed
const path = !showUploadDocuments()
  ? 'additional-information/document-upload'
  : 'temporarily-hidden-document-upload';

const Description = (
  <div className="vads-u-color--gray-dark">
    <p>
      You can submit your supporting documents using any of the options listed
      on this page.
    </p>

    <p>
      <strong>Note:</strong> If we receive your claim and we need additional
      documents, we’ll ask you to submit them. If you don’t respond within 30
      days of our request, we may decide your claim with the information that’s
      available to us.
    </p>

    <h4>Option 1: Upload your documents online </h4>

    <p>You can upload your documents now.</p>

    <p>Guidelines to upload a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpeg, or .png file</li>
      <li>Your file should be no larger than 20MB</li>
    </ul>
  </div>
);

const UploadMessage = (
  <div className="vads-u-color--gray-dark">
    <h4>Option 2: Submit your documents online through AccessVA</h4>

    <p>
      You can use the QuickSubmit tool through AccessVA to submit your documents
      online.
    </p>

    <p>
      <a
        href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
        target="_blank"
        rel="noreferrer"
      >
        Go to AccessVA to use QuickSubmit (opens in a new tab)
      </a>
    </p>

    <h4>Option 3: Mail your documents</h4>

    <p>You can mail your documents to us at this address:</p>

    <p className="va-address-block">
      Department of Veterans Affairs
      <br />
      Pension Intake Center
      <br />
      PO Box 5365
      <br />
      Janesville, WI 53547-5365
      <br />
    </p>
  </div>
);

export default {
  title: 'Document upload',
  path,
  depends: () => !showUploadDocuments(),
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
