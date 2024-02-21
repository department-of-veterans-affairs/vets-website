import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { generateTitle } from '../../../utils/helpers';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('Death certificate'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          Upload a copy of the Veteran’s death certificate including the cause
          of death.
        </p>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <strong>How to upload files</strong>
        </p>
        <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <li>Format the file as a .jpg, .pdf, or .png file</li>
          <li>Be sure that your file size is 20mb or less</li>
        </ul>
      </>
    ),
    deathCertificate: {
      ...fileUploadUI('Upload the Veteran’s death certificate', {
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        confirmRemove: true,
        uswds: true,
        classNames: 'vads-u-font-size--md',
      }),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['deathCertificate'],
    properties: {
      deathCertificate: {
        ...files,
        min: 1,
      },
    },
  },
};
