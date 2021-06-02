import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function LandingPage() {
  const [didCheckIn, setDidCheckIn] = useState(false);
  const onClick = () => {
    setDidCheckIn(true);
  };

  if (didCheckIn) {
    return <Redirect to="/check-in/confirm" />;
  }

  const TTY_NUMBER = '711';
  const GET_HELP_NUMBER = '800-698-2411';

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1>Appointment details</h1>
      <dl>
        <dd className="appointment-details vads-u-font-weight--bold">
          Friday, September 25, 2020 9:30 a.m. ET
        </dd>
        <dt className="vads-u-font-weight--bold">VA appointment</dt>
        <dd>
          <div> Cheyenne VA Medical Center</div>
          <div>2360 East Pershing Boulevard</div>
          <div>Cheyenne, WY 82001-5356</div>
        </dd>
        <dt className="vads-u-font-weight--bold">Clinic</dt>
        <dd>Green Team Clinic1</dd>
      </dl>
      <button type="button" className="usa-button" onClick={onClick}>
        Check in now
      </button>
      <footer className="row">
        <h2 className="help-heading">Need help?</h2>
        <p>
          If you have questions or need help checking in, please call our
          MyVA411 main information line at{' '}
          <Telephone contact={GET_HELP_NUMBER} /> and select 0. We're here 24/7.
        </p>
        <p>
          If you have hearing loss, call{' '}
          <Telephone contact={TTY_NUMBER}>TTY: {TTY_NUMBER}</Telephone>.
        </p>
      </footer>
    </div>
  );
}
