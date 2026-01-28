import React from 'react';

const AppointmentScheduledAlert = () => {
  return (
    <div className="vads-u-margin-y--3">
      <va-alert-expandable
        status="info"
        trigger="You have an Appointment Scheduled"
      >
        <p>
          We would like to remind you that you have an appointment scheduled
          with your Counselor for 11/30/2025 at 2:00 pm ET at the following
          location:
        </p>
        <p className="va-address-block">
          U.S. Department of Veterans Affairs <br />
          Medical Office
          <br />
          PO Box 11930
          <br />
          St. Paul, MN 55111
          <br />
          United States of America
        </p>
      </va-alert-expandable>
    </div>
  );
};

export default AppointmentScheduledAlert;
