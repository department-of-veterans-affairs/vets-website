import React from 'react';
import content from '../../locales/en/content.json';

const DependentsMaxWarning = () => (
  <va-alert
    status="warning"
    class="vads-u-margin-bottom--2"
    data-testid="ezr-dependents-max-warning"
    uswds
  >
    <p className="vads-u-margin-y--0">
      {content['household-dependent-max-dependents-warning']}
    </p>
  </va-alert>
);

export default DependentsMaxWarning;
