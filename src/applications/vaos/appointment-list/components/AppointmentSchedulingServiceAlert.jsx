import React from 'react';

export default function AppointmentSchedulingServiceAlert() {
  return (
    <div className="vads-u-margin-bottom--4">
      <va-alert-expandable
        status="warning"
        trigger="We can't display all your appointments."
      >
        <p>
          We're working to resolve this issue. To manage an appointment that is
          not shown in this list, contact the facility at which it was
          scheduled.
        </p>
        <p>
          <a href="/find-locations">Facility locator</a>
        </p>
      </va-alert-expandable>
    </div>
  );
}
