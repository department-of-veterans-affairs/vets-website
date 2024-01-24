import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getEVData } from '../selectors';
import { STATUS } from '../constants';
import { STATUS_PROP_TYPE } from '../helpers';
import { UPDATE_VERIFICATION_STATUS_SUCCESS } from '../actions';

const fetchFailureAlert = (
  <va-alert status="error" visible uswds>
    <h3 slot="headline">
      There was an error retrieving your enrollment verifications
    </h3>
    <p>Please try again later.</p>
  </va-alert>
);

const successAlert = submissionResult => (
  <va-alert
    aria-live={
      submissionResult !== UPDATE_VERIFICATION_STATUS_SUCCESS
        ? 'assertive'
        : 'off'
    }
    role="alert"
    status="success"
    visible
    uswds
  >
    {submissionResult !== UPDATE_VERIFICATION_STATUS_SUCCESS
      ? 'Congratulations, you’re'
      : 'You’re'}{' '}
    up-to-date with your monthly enrollment verification. You’ll be able to
    verify your enrollment next month.
  </va-alert>
);
const warningAlert = (
  <va-alert status="warning" visible uswds>
    <h1
      className="vads-u-font-size--h3 vads-u-font-weight--bold"
      slot="headline"
    >
      We’re missing one or more of your enrollment verifications
    </h1>
    <p>
      You’ll need to verify your monthly enrollments to get your scheduled
      payments.
    </p>
  </va-alert>
);

const pausedAlert = (
  <va-alert status="error" visible uswds>
    <h1
      className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif"
      slot="headline"
    >
      We’ve paused your monthly education payments
    </h1>
    <p>
      We’ve paused your payments because it’s been more than 2 months since you
      verified your enrollment. Please review and verify your monthly
      enrollment(s) to get the payments you’re entitled to.
    </p>
  </va-alert>
);

const pausedScoAlert = (
  <va-alert status="error" visible uswds>
    <h1
      className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-font-family--serif"
      slot="headline"
    >
      We’ve paused your monthly education payments until your enrollment
      information is updated
    </h1>
    <p>
      We did this because you verified your monthly enrollment has changed or
      isn’t correct.
    </p>
    <p>
      Work with your School Certifying Official to have your enrollment
      information updated.
    </p>
  </va-alert>
);

const EnrollmentVerificationAlert = ({
  enrollmentVerificationFetchFailure,
  status,
  submissionResult,
}) => {
  if (enrollmentVerificationFetchFailure) {
    return fetchFailureAlert;
  }

  switch (status) {
    case STATUS.ALL_VERIFIED:
      return successAlert(submissionResult);
    case STATUS.MISSING_VERIFICATION:
      return warningAlert;
    case STATUS.PAYMENT_PAUSED:
      return pausedAlert;
    case STATUS.SCO_PAUSED:
      return pausedScoAlert;
    default:
      return <></>;
  }
};

EnrollmentVerificationAlert.propTypes = {
  status: STATUS_PROP_TYPE.isRequired,
  enrollmentVerificationFetchFailure: PropTypes.bool,
  submissionResult: PropTypes.string,
};

const mapStateToProps = state => getEVData(state);

export default connect(mapStateToProps)(EnrollmentVerificationAlert);
