import React from 'react';

const DependentsMaxWarning = () => (
  <va-alert
    status="warning"
    class="vads-u-margin-bottom--2"
    data-testid="hca-sip-warning"
    uswds
  >
    <p className="vads-u-margin-y--0">
      You added the maximum number of people as your dependents for this form.
      You can review and edit your dependent information. Or select Continue to
      go to the next part of this form.
    </p>
  </va-alert>
);

export default DependentsMaxWarning;
