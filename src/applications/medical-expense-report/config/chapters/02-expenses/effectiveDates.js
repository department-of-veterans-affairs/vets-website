import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Reporting period effective date'),
    'ui:description': (
      <div>
        <p className="vads-u-margin-top--0">
          Since this is your first time reporting medical expenses, you should
          only report expenses that you paid on or after your effective date.
        </p>
        <p>Your effective date is typically the earliest of these dates:</p>
        <ul>
          <li>The date we received your initial application</li>
          <li>
            The date we received your Intent to File a Claim for Compensation
            and/or Pension, or Survivors Pension and/or DIC (VA Form 21-0966)
          </li>
          <li>
            The date of the Veteran's death, if it was within the past year
          </li>
        </ul>
      </div>
    ),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {},
  },
};
