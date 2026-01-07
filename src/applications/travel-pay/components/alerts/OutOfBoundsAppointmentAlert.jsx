import React from 'react';

export default function OutOfBoundsAppointmentAlert() {
  return (
    <va-alert closeable="false" status="warning" role="status" visible>
      <h2 slot="headline">Your appointment happened more than 30 days ago</h2>
      <p className="vads-u-margin-y--2">
        You didn’t file a claim for this appointment within the 30-day limit.
        You can still review and file your claim. But claims filed after 30 days
        are usually denied.
      </p>
    </va-alert>
  );
}
