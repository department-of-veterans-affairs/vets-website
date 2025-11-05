import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    hasUnpaidCreditors: yesNoUI(
      "Are you seeking reimbursement for expenses you haven't paid yet?",
    ),
    'ui:description': (
      <>
        <p>
          If you're asking VA to reimburse you for funeral or medical expenses
          that you haven't paid, the people or companies you owe money to will
          need to sign the form too.
        </p>
      </>
    ),
    'view:creditorsAlert': {
      'ui:description': (
        <va-alert status="error" uswds>
          <h3 slot="headline">You must use the paper form</h3>
          <p>
            Online submission isn't available if you have unpaid creditors.
            You'll need to:
          </p>
          <ol>
            <li>Download the paper form</li>
            <li>Complete your sections</li>
            <li>Have each creditor complete and sign Section IV</li>
            <li>Mail the completed form to VA</li>
          </ol>
          <p>
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              target="_blank"
              rel="noopener noreferrer"
              text="Download VA Form 21P-601 (PDF)"
            />
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => formData.hasUnpaidCreditors !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['hasUnpaidCreditors'],
    properties: {
      hasUnpaidCreditors: yesNoSchema,
      'view:creditorsAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
