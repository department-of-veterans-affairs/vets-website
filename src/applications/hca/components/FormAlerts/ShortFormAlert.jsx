import React from 'react';

const ShortFormAlert = () => (
  <va-alert-expandable
    trigger="You’re filling out a shortened application!"
    status="success"
    class="vads-u-margin-y--5"
    data-testid="hca-short-form-alert"
  >
    Your service-connected disability rating is 50% or higher. This is one of
    our eligibility criteria.
  </va-alert-expandable>
);

export default ShortFormAlert;
