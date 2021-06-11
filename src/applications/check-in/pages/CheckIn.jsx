import React from 'react';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { goToNextPageWithToken } from '../utils/navigation';

const CheckIn = props => {
  const { router } = props;
  const onClick = () => {
    goToNextPageWithToken(router, 'confirmed');
  };
  const contactNumber = '555-867-5309';

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1>Your appointment</h1>
      <dl className="appointment-summary">
        <dd
          className="appointment-details vads-u-font-weight--bold"
          data-testid="appointment-date"
        >
          Friday, September 25, 2020
        </dd>
        <dd
          className="appointment-details vads-u-font-weight--bold vads-u-margin-bottom--3"
          data-testid="appointment-time"
        >
          9:30 a.m. ET
        </dd>
        <dt className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--1">
          Clinic:{' '}
        </dt>
        <dd data-testid="clinic-name">Green Team Clinic1</dd>
      </dl>
      <button
        type="button"
        className="usa-button"
        onClick={onClick}
        data-testid="check-in-button"
      >
        Check in now
      </button>
      <footer className="row">
        <h2 className="help-heading vads-u-font-size--lg">Need help?</h2>
        <p>
          Ask a staff member or call us at <Telephone contact={contactNumber} />
          .
        </p>
      </footer>
    </div>
  );
};

export default CheckIn;
