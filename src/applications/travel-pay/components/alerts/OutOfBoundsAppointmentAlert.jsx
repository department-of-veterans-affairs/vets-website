import React from 'react';

import { HelpTextGeneral } from '../HelpText';

export default function OutOfBoundsAppointmentAlert() {
  return (
    <va-alert closeable="false" status="warning" role="status" visible>
      <h2 slot="headline">Your appointment is older than 30 days</h2>
      <p className="vads-u-margin-y--2">
        You didn’t submit a claim for this appointment within the 30 day limit.
        You can still review and submit your claim. But claims submitted after
        30 days are usually denied.
      </p>
      <p className="vads-u-font-weight--bold">
        How can I get help with my claim?
      </p>
      <HelpTextGeneral />
    </va-alert>
  );
}
