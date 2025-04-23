import PropTypes from 'prop-types';
import React from 'react';
import { clearReferralTimer, getReferralElapsedSeconds } from './utils/timer';
import ReferralLayout from './components/ReferralLayout';

export default function ConfirmReferral(props) {
  const { currentReferral } = props;
  return (
    <ReferralLayout
      hasEyebrow
      heading={`Confirm Referral for ${currentReferral.categoryOfCare}`}
    >
      <p>{currentReferral.uuid}</p>
      <va-button
        className="va-button-link"
        onClick={() => {
          const referralTimeTaken = getReferralElapsedSeconds(
            currentReferral.uuid,
          );
          // eslint-disable-next-line no-alert
          alert(`Referral Confirmed and took ${referralTimeTaken} seconds`);
          clearReferralTimer(currentReferral.uuid);
        }}
        text="Confirm"
        uswds
      />
    </ReferralLayout>
  );
}
ConfirmReferral.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};
