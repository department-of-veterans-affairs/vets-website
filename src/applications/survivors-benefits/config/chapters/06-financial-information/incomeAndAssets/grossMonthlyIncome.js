import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const grossDescription = () => (
  <div>
    <p>
      Next we’ll ask you the gross monthly income you, your spouse, and your
      dependents receive. You’ll need to add at least 1 income source and can
      add up to the number of sources you reported.
    </p>

    <p>
      <strong>Note:</strong> If you’ve been told to complete an Income and Asset
      Statement in Support of Claim for Pension or Parents' Dependency and
      Indemnity Compensation (VA Form 21P-0969), we only require that Social
      Security income be reported in this step. All other income should be
      reported on the VA Form 21P-0969.
    </p>
  </div>
);

const whatWeConsiderIncome = () => (
  <va-additional-info trigger="What we consider income">
    <p>
      Your income is how much you earn. It includes your Social Security
      benefits, investment and retirement payments, and any income your spouse
      and dependents receive.
    </p>
  </va-additional-info>
);

const uiSchema = {
  ...titleUI('Gross monthly income', grossDescription),
  'ui:description': whatWeConsiderIncome,
};

const schema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema,
  schema,
};
