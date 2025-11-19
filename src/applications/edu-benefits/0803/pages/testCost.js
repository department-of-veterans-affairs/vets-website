// @ts-check
import React from 'react';
import {
  numberUI,
  numberSchema,
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
    'view:understandsUploadRequirement2': {
      'ui:description': (
        <va-alert tabindex="0">
          When you submit this form on QuickSubmit or by mail, you will need to
          attach a copy of your test results to your submission. If you do not
          have any test results but have a copy of your license or certification
          that clearly displays your name, you can attach that.
        </va-alert>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:explanation': { type: 'object', properties: {} },
      testCost: numberSchema,
      'view:understandsUploadRequirement2': { type: 'object', properties: {} },
    },
    required: ['testCost'],
  },
};
