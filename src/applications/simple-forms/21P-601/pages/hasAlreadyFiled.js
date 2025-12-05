import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Survivors benefits applications'),
    'ui:description': (
      <>
        <p>
          If you've filled out either of these applications, you don't need to
          fill out this form:
        </p>
        <ul>
          <li>
            Application for DIC, Survivors Pension, and/or Accrued Benefits (VA
            Form 534EZ)
          </li>
          <li>
            Application for Dependency and Indemnity Compensation by Parent(s)
            (VA Form 21P-535)
          </li>
        </ul>
      </>
    ),
    hasAlreadyFiled: yesNoUI({
      title: 'Have you filled out either of these applications?',
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
