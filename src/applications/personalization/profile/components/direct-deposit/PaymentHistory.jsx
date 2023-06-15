import React from 'react';
import PropTypes from 'prop-types';

import { Toggler } from '~/platform/utilities/feature-toggles';
import recordAnalyticsEvent from '~/platform/monitoring/record-event';

import ProfileInfoTable from '../ProfileInfoTable';
import { ProfileInfoCard } from '../ProfileInfoCard';

function PaymentHistory({ recordEvent = recordAnalyticsEvent } = {}) {
  const tableData = [
    {
      value: (
        <>
          <p className="vads-u-margin-top--0">
            Check your payment history for your VA disability compensation,
            pension, and education benefits
          </p>
          <a
            href="/va-payment-history/payments/"
            onClick={() =>
              recordEvent({
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
    <>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
        <Toggler.Enabled>
          <ProfileInfoCard
            className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
            data={tableData}
            level={2}
            namedAnchor="payment-history"
            title="VA payment history"
          />
        </Toggler.Enabled>

        <Toggler.Disabled>
          <ProfileInfoTable
            className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
            title="VA payment history"
            data={tableData}
            level={2}
          />
        </Toggler.Disabled>
      </Toggler>
    </>
  );
}

PaymentHistory.propTypes = {
  recordEvent: PropTypes.func,
};

export default PaymentHistory;
