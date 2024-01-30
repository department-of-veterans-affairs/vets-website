import React from 'react';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';

const { files } = fullSchemaPensions.definitions;

const Description = (
  <div>
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

    <h3>Option 1: Upload your documents online </h3>

    <p>You can upload your documents now.</p>

    <p>File types you can upload: PDF</p>
  </div>
);

const UploadMessage = (
  <div>
    <h3>Option 2: Submit your documents online through AccessVA</h3>

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

    <h3>Option 3: Mail your documents</h3>

    <p>You can mail your documents to us at this address:</p>

    <p className="va-address-block">
      Department of Veterans Affairs
      <br />
      Pension Intake Center
      <br />
      PO Box 5365
      <br />
      Janesville, WI 53547-5192
      <br />
    </p>
  </div>
);

export default {
  uiSchema: {
    'ui:title': 'Submit your supporting documents',
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
