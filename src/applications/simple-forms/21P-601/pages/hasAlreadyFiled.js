import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    hasAlreadyFiled: yesNoUI('Have you already filed for survivor benefits?'),
    'ui:description': (
      <>
        <p>
          Have you already submitted VA Form 21P-534EZ (Application for DIC,
          Death Pension, and/or Accrued Benefits) or VA Form 21P-535
          (Application for Dependency and Indemnity Compensation by Parent(s))?
        </p>
      </>
    ),
    'view:alreadyFiledAlert': {
      'ui:description': (
        <va-alert status="warning" uswds>
          <h3 slot="headline">You don't need this form</h3>
          <p>
            Your accrued benefits claim is already included in your survivor
            benefits application. You don't need to file this form separately.
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => formData.hasAlreadyFiled !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['hasAlreadyFiled'],
    properties: {
      hasAlreadyFiled: yesNoSchema,
      'view:alreadyFiledAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
