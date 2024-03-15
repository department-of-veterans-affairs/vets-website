import React from 'react';
import { LAST_YEAR } from '../../utils/constants';

const SpouseInfoDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--1 vads-u-margin-bottom--4"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        This information helps us determine if your spouse was your dependent in{' '}
        {LAST_YEAR}.
      </p>
    </div>
  </va-additional-info>
);

export default SpouseInfoDescription;
