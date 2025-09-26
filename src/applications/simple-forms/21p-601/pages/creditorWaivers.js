import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Waiver of reimbursement from unpaid creditors'),
    'ui:description': (
      <div>
        <p>
          If you have unpaid creditors, they must waive their right to
          reimbursement by completing Section IV of the paper form.
        </p>
        <va-alert status="warning" uswds>
          <h3 slot="headline">Online submission not available</h3>
          <p>
            Creditor waivers require original signatures, which cannot be
            completed online. Please download and use the paper form.
          </p>
        </va-alert>
      </div>
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:creditorWaiverInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
