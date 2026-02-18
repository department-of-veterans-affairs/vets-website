import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Section V: Remarks'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline">
            <b>What to expect:</b>
          </h2>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>Space for any additional details about your situation</li>
              <li>Space for uploading documentation</li>
              <li>This section is optional</li>
            </ul>
          </div>
        </VaAlert>
        <div className="vads-u-margin-top--5">
          <h2 style={{ marginTop: 0 }}>Additional Information</h2>
          <p>Add any additional information we should know</p>
        </div>
      </div>
    ),
    additionalRemarks: {
      'ui:title':
        'Enter additional information you may want to share (optional)',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 1000,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalRemarks: {
        type: 'string',
        properties: {},
      },
    },
  },
};
