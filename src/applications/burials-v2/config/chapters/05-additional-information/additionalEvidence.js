import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { generateTitle } from '../../../utils/helpers';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('Additional documents'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          Upload additional documents with your application.
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
    additionalEvidence: {
      ...fileUploadUI('Upload documents for other supporting evidence', {
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        confirmRemove: true,
        uswds: true,
        classNames: 'vads-u-font-size--md',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalEvidence: {
        ...files,
        min: 1,
      },
    },
  },
};
