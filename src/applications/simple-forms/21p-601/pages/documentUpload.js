import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Upload supporting documents'),
    'ui:description': (
      <div>
        <p>You may need to provide the following documents:</p>
        <ul>
          <li>Death certificate</li>
          <li>Marriage certificate (if spouse)</li>
          <li>Birth certificate (if child)</li>
          <li>Letters of administration (if executor)</li>
          <li>Receipts for expenses (if seeking reimbursement)</li>
        </ul>
        <p>
          <strong>Note:</strong> Document upload functionality will be
          implemented in the next iteration.
        </p>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:documentUploadInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
