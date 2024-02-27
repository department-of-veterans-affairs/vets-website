import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import { DEBT_TYPES } from '../../constants';

const AlertCard = ({ debtType }) => {
  return (
    <>
      <va-alert
        uswds
        class="row vads-u-margin-bottom--5"
        status="error"
        data-testid={`balance-card-alert-${
          debtType === DEBT_TYPES.DEBT ? 'debt' : 'copay'
        }`}
      >
        <h2 slot="headline" className="vads-u-font-size--h3">
          We can’t access your{' '}
          {`${debtType === DEBT_TYPES.DEBT ? 'debt' : 'copay'}`} records right
          now
        </h2>
        <p className="vads-u-font-size--base vads-u-font-family--sans">
          We’re sorry. Information about{' '}
          {`${debtType === DEBT_TYPES.DEBT ? 'debts' : 'copays'}`} you might
          have is unavailable because something went wrong on our end. Please
          check back soon.
        </p>
        <p>
          If you continue having trouble viewing information about your{' '}
          {`${debtType === DEBT_TYPES.DEBT ? 'debts' : 'copays'}`}, contact us
          online through <a href="https://ask.va.gov">Ask VA</a>.
        </p>
      </va-alert>
      <a
        className="vads-c-action-link--green vads-u-margin-top--1p5 vads-u-margin-bottom--2p5"
        href={`${environment.BASE_URL}`}
      >
        Go back to VA.gov
      </a>
    </>
  );
};
AlertCard.propTypes = {
  debtType: PropTypes.string,
};

export default AlertCard;
