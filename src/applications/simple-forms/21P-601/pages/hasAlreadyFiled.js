import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    hasAlreadyFiled: yesNoUI({
      title: 'Survivors benefits application',
      description: (
        <>
          <p>
            If you've filled out either of these applications, you don't need to
            fill out this form:
          </p>
          <ul>
            <li>
              Application for DIC, Survivors Pension, and/or Accrued Benefits
              (VA Form 534EZ)
            </li>
            <li>
              Application for Dependency and Indemnity Compensation by Parent(s)
              (VA Form 21P-535)
            </li>
          </ul>
          <p>Have you filled out either of these applications?</p>
        </>
      ),
      labelHeaderLevel: '3',
    }),
  },
  schema: {
    type: 'object',
    required: ['hasAlreadyFiled'],
    properties: {
      hasAlreadyFiled: yesNoSchema,
    },
  },
};
