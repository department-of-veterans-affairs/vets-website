// @ts-check
import React from 'react';
import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Test cost'),
  'view:explanation': {
    'ui:description': (
      <div>
        <p>
          Enter the cost of the test you took, including any required fees. (We
          can only reimburse you for required test fees.) We have no authority
          to reimburse you for any optional costs related to the test process.
        </p>
        <p>
          Test fees that VA will reimburse include "registration fees," fees for
          specialized tests, and administrative fees such as a proctoring fee.
        </p>
        <p>
          Fees that VA has no authority to reimburse include fees to take
          pre-tests, fees to receive scores quickly, or other costs or fees for
          optional items that are not required to take an approved test.
        </p>
      </div>
    ),
  },
  testCost: {
    ...currencyUI({
      title: 'Total test cost',
      min: 0,
      required: () => true,
      errorMessages: {
        required: 'Enter the total cost of the test',
      },
    }),
  },
  'view:understandsUploadRequirement2': {
    'ui:description': (
      <div className="vads-u-margin-top--4">
        <strong>Note:</strong> When you submit this form on QuickSubmit or by
        mail, you will need to attach a copy of your receipt for any test fees
        included in the total cost above. Reimbursement of the test fee can’t be
        paid until this information is received.
      </div>
    ),
  },
};
const schema = {
  type: 'object',
  properties: {
    'view:explanation': { type: 'object', properties: {} },
    testCost: currencySchema,
    'view:understandsUploadRequirement2': { type: 'object', properties: {} },
  },
  required: ['testCost'],
};

export { schema, uiSchema };
