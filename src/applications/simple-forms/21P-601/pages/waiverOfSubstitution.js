import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Waiver of substitution'),
    wantsToWaiveSubstitution: yesNoUI({
      title: 'Do you want to waive your right to substitution?',
      labels: {
        Y: 'Yes, I want to waive my right to substitution',
        N: 'No, I want to take over pending claims or appeals',
      },
      description: (
        <>
          <p>
            If the beneficiary had a pending claim or appeal, you can ask to
            take over that claim or appeal on their behalf (also called
            substitution). This lets you submit more evidence to support the
            claim or appeal for potential accrued benefits.
          </p>
          <p>
            You can also waive your right to substitution. If you do, we'll
            still consider any claims or appeals with the evidence we already
            have.
          </p>
        </>
      ),
      messageAriaDescribedby:
        "If the beneficiary had a pending claim or appeal, you can ask to take over that claim or appeal on their behalf (also called substitution). This lets you submit more evidence to support the claim or appeal for potential accrued benefits. You can also waive your right to substitution. If you do, we'll still consider any claims or appeals with the evidence we already have.",
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wantsToWaiveSubstitution: yesNoSchema,
    },
  },
};
