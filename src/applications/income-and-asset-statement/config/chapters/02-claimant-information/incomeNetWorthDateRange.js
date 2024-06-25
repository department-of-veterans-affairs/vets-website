import React from 'react';
import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const Description = (
  <>
    This form is designed to provide VA with your income and net worth during a
    specific date range to determine your eligibility or adjust your benefits.
    If you are submitting an initial application, report current information.
    Your effective date is typically the earliest of the following dates:
    <ul>
      <li>Date VA receives your application</li>
      <li>Date VA receives your intent to file</li>
      <li>Date of Veteran’s death (Survivor’s Benefits only)</li>
    </ul>{' '}
    If you are submitting this form as a response to VA correspondence, report
    your income and net worth information during the date range specified in
    that correspondence. If you are reporting an income change, report changes
    from the date the change took effect.
  </>
);

/** @type {PageSchema} */
export default {
  title: 'Statement Period',
  path: 'claimant/statement-period',
  uiSchema: {
    ...titleUI('Statement Period', Description),
    incomeNetWorthDateRange: currentOrPastDateRangeUI(),
  },
  schema: {
    type: 'object',
    properties: {
      incomeNetWorthDateRange: currentOrPastDateRangeSchema,
    },
  },
};
