import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { generateTitle } from '../../../utils/helpers';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('Transportation costs'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          Upload an itemized receipt for any costs you paid for transporting the
          Veteran’s remains.
        </p>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <strong>Here’s what the itemized receipt should include:</strong>
        </p>
        <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <li>The deceased Veteran’s name</li>
          <li>The transportation costs</li>
          <li>Date of the transportation service</li>
          <li>Name of the person who paid the transportation costs</li>
        </ul>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <strong>How to upload files</strong>
        </p>
        <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <li>Format the file as a .jpg, .pdf, or .png file</li>
          <li>Be sure that your file size is 20mb or less</li>
        </ul>
      </>
    ),
    transportationReceipts: {
      ...fileUploadUI('Upload an itemized receipt', {
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
        confirmRemove: true,
        uswds: true,
      }),
      'ui:required': form => form?.transportationExpenses,
      'ui:options': {
        classNames: 'vads-u-font-size--md',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      transportationReceipts: {
        ...files,
        min: 1,
      },
    },
  },
};
