import React from 'react';

import { documentScreener } from '../../schemaImports';

const DocumentScreenerSummary = (
  <div>
    <p>We may need some documentation:</p>
    <ul>
      <li>A copy of your discharge or separation papers (DD214)</li>
      <li>Evidence a VA loan was paid in full</li>
    </ul>
    <p>
      You can upload service or loan documentation to support your application.
      If you wait until we request it, it could delay your application.
    </p>
  </div>
);

export const schema = {
  type: 'object',
  required: ['willUploadDocs'],
  properties: {
    'view:docScreenerSummary': {
      type: 'object',
      properties: {},
    },
    ...documentScreener.properties,
  },
};

export const uiSchema = {
  'view:docScreenerSummary': {
    'ui:description': DocumentScreenerSummary,
  },
  willUploadDocs: {
    'ui:title': 'Do you want to upload documents?',
    'ui:widget': 'yesNo',
  },
};
