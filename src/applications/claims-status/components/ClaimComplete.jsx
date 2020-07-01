import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

function ClaimComplete({ completedDate }) {
  return (
    <>
      <div className="usa-alert usa-alert-info background-color-only claims-alert-status">
        <h3 className="claims-alert-header vads-u-font-size--h4">
          Your claim was closed{' '}
          {completedDate
            ? `on ${moment(completedDate).format('MMM D, YYYY')}`
            : null}
        </h3>
      </div>
      <div className="vads-u-margin--2">
        <p>
          A decision packet has been mailed to you. Typically, decision notices
          are received within 10 days, but this is dependent upon U.S. Postal
          Service timeframes.
        </p>
        <h4>Payments</h4>
        <p>
          If you are entitled to back payment (based on an effective date), you
          can expect to receive payment within 1 month of your claim’s decision
          date.
        </p>
      </div>
    </>
  );
}

ClaimComplete.propTypes = {
  completedDate: PropTypes.string,
};

export default ClaimComplete;
