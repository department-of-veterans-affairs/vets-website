import React from 'react';

import { HelpTextModalities, HelpTextGeneral } from '../HelpText';

export default function OutOfBoundsAppointmentAlert() {
  return (
    <va-alert closeable="false" status="warning" role="status" visible>
      <h2 slot="headline">Your appointment is older than 30 days</h2>
      <p className="vads-u-margin-y--2">
        We can't file this claim in this tool at this time.
      </p>
      <HelpTextModalities />
      <p className="vads-u-font-weight--bold">
        How can I get help with my claim?
      </p>
      <HelpTextGeneral />
    </va-alert>
  );
}
