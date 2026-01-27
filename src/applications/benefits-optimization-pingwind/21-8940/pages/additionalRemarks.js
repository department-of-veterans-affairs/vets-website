import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <div>
        <h3 style={{ marginTop: 0 }}>Section V: Remarks</h3>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h4 slot="headline">
            <b>What to expect:</b>
          </h4>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>Space for any additional details about your situation</li>
              <li>Space for uploading documentation</li>
              <li>This section is optional</li>
            </ul>
          </div>
        </VaAlert>
        <div className="vads-u-margin-top--5">
          <h4 style={{ marginTop: 0 }}>Additional Information</h4>
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
