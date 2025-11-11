// @ts-check
import React from 'react';
import {
  numberUI,
  numberSchema,
  checkboxUI,
  checkboxRequiredSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Test cost'),
    'view:explanation': {
      'ui:description': (
        <div>
          <p>
            Enter the cost of the test you took, including any required fees.
            (We can only reimburse you for required test fees.) We have no
            authority to reimburse you for any optional costs related to the
            test process.
          </p>
          <p>
            Test fees that VA will reimburse include "registration fees," fees
            for specialized tests, and administrative fees such as a proctoring
            fee.
          </p>
          <p>
            Fees that VA has no authority to reimburse include fees to take
            pre-tests, fees to receive scores quickly, or other costs or fees
            for optional items that are not required to take an approved test.
          </p>
        </div>
      ),
    },
    testCost: {
      ...numberUI({
        title: 'Total test cost',
        min: 0,
        required: () => true,
      }),
    },
    understandsUploadRequirement2: {
      ...checkboxUI({
        title: 'I understand',
        description: (
          <div>
            <p>
              When you submit this form on QuickSubmit or by mail, you will need
              to attach a copy of your receipt for any test fees included in the
              total cost above. Reimbursement of the test fee can't be paid
              until this information is received.
            </p>
          </div>
        ),
        required: () => true,
        errorMessages: {
          required: 'Read the statement above and check the box below',
        },
      }),
      'ui:options': {
        classNames:
          'vads-u-padding--3 vads-u-margin-top--3 vads-u-background-color--gray-lightest',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:explanation': { type: 'object', properties: {} },
      testCost: numberSchema,
      understandsUploadRequirement2: checkboxRequiredSchema,
    },
    required: ['testCost'],
  },
};
