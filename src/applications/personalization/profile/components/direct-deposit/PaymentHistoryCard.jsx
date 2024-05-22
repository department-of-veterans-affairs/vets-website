import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from '~/platform/monitoring/record-event';

import { ProfileInfoCard } from '../ProfileInfoCard';

export const PaymentHistoryCard = ({ recordEventImpl }) => {
  const tableData = [
    {
      value: (
        <>
          <p className="vads-u-margin-top--0">
            Check your payment history for your VA disability compensation,
            pension, and education benefits.
          </p>
          <a
            href="/va-payment-history/payments/"
            onClick={() =>
              recordEventImpl({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'view-payment-history',
              })
            }
          >
            View your payment history
          </a>
        </>
      ),
    },
  ];

  return (
    <ProfileInfoCard
      className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
      data={tableData}
      level={2}
      namedAnchor="payment-history"
      title="VA payment history"
    />
  );
};

PaymentHistoryCard.propTypes = {
  recordEventImpl: PropTypes.func,
};

PaymentHistoryCard.defaultProps = {
  recordEventImpl: recordEvent,
};
