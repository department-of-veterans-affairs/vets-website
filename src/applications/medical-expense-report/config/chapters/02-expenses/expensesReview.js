import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import ActionLink from '../../../components/ActionLink';

/** @type {PageSchema} */
export default {
  title: 'Review expenses',
  path: 'expenses/review',
  uiSchema: {
    ...titleUI('Review the expenses you’re submitting'),
    'view:noExpensesAlert': {
      'ui:description': (
        <>
          <va-alert status="warning">
            <h3 slot="headline">You didn't report any expenses</h3>
            <p className="vads-u-margin-y--0">
              We may adjust your benefits based on any expenses you report. If
              you want to report expenses, go back and add them to the form.
            </p>
          </va-alert>
          <div className="vads-u-margin-top--3">
            <ActionLink
              path="expenses/care/add"
              primary
              text="Add an expense"
            />
          </div>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:noExpensesAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
