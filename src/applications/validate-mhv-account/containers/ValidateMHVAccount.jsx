import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { mhvUrl } from 'platform/site-wide/mhv/utilities';

export default function ValidateMHVAccount() {
  window.location = mhvUrl(true, 'home');

  return (
    <div className="row">
      <div className="vads-u-padding-bottom--5">
        <LoadingIndicator message="Loading your health information" setFocus />
      </div>
    </div>
  );
}
