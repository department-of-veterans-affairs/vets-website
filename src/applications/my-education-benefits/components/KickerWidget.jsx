import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * KickerWidget checks formData for mebKickerNotificationEnabled plus
 * `eligibleForActiveDutyKicker` or `eligibleForReserveKicker`.
 * If conditions are met, it displays a <va-alert> for that kicker type.
 */
const KickerWidget = ({
  formData,
  kickerType,
  eligibleForActiveDutyKicker,
  eligibleForReserveKicker,
}) => {
  if (!formData) {
    return null;
  }

  const { mebKickerNotificationEnabled } = formData;

  // If the global flag is off, we skip
  if (!mebKickerNotificationEnabled) {
    return null;
  }

  // Check the actual kicker type
  if (kickerType === 'activeDuty' && eligibleForActiveDutyKicker) {
    return (
      <va-alert>
        Department of Defense data shows you are potentially eligible for an
        active duty kicker
      </va-alert>
    );
  }

  if (kickerType === 'reserve' && eligibleForReserveKicker) {
    return (
      <va-alert>
        Department of Defense data shows you are potentially eligible for a
        reserve kicker
      </va-alert>
    );
  }

  return null;
};

KickerWidget.propTypes = {
  eligibleForActiveDutyKicker: PropTypes.bool,
  eligibleForReserveKicker: PropTypes.bool,
  formData: PropTypes.object,
  kickerType: PropTypes.oneOf(['activeDuty', 'reserve']),
};

KickerWidget.defaultProps = {
  kickerType: 'activeDuty',
};

const mapStateToProps = state => {
  const claimant = state?.data?.formData?.data?.attributes?.claimant || {};
  const { eligibleForActiveDutyKicker, eligibleForReserveKicker } =
    claimant || {};

  return {
    formData: state?.form?.data,
    eligibleForActiveDutyKicker,
    eligibleForReserveKicker,
  };
};

export default connect(mapStateToProps)(KickerWidget);
