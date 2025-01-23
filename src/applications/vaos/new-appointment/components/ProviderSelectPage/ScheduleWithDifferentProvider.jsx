import React from 'react';

export default function ScheduleWithDifferentProvider() {
  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        If you want to schedule with a different provider
      </h2>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1">
        Option 1: Call the facility
      </h3>
      <p className="vads-u-margin-y--0">
        Call and ask to schedule with that provider:{' '}
        <va-telephone contact="1231231234" /> (
        <va-telephone contact="711" tty />)
      </p>

      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0 vads-u-margin-top--1">
        Option 2: Request your preferred date and time online
      </h3>
      <p className="vads-u-margin-top--0">
        We’ll contact you and help you finish scheduling your appointment.
      </p>
      <va-link active href="#" text="Request an appointment" />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
    </>
  );
}
