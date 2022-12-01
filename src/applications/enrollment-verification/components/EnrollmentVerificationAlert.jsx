import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { STATUS } from '../constants';
import { STATUS_PROP_TYPE } from '../helpers';
import { UPDATE_VERIFICATION_STATUS_SUCCESS } from '../actions';
import VerifyYourEnrollments from './VerifyYourEnrollments';

const successAlert = submissionResult => (
  <va-alert status="success" visible>
    {submissionResult === UPDATE_VERIFICATION_STATUS_SUCCESS
      ? 'Congratulations, you’re'
      : 'You’re'}{' '}
    up-to-date with your monthly enrollment verification. You’ll be able to
    verify your enrollment next month.
  </va-alert>
);
const warningAlert = (
  <va-alert status="warning" visible>
    <h3 slot="headline">
      We’re missing one or more of your enrollment verifications
    </h3>
    <p>
      You’ll need to verify your monthly enrollments to get your scheduled
      payments.
    </p>
    <VerifyYourEnrollments />
  </va-alert>
);

const pausedAlert = (
  <va-alert status="error" visible>
    <h3 slot="headline">We’ve paused your monthly education payments</h3>
    <p>
      We had to pause your payments because you haven’t verified your
      enrollment(s) for <strong>two months in a row</strong>. Please review and
      verify your monthly enrollment(s) to get the payments you’re entitled to.
    </p>
    <VerifyYourEnrollments />
  </va-alert>
);

const pausedScoAlert = (
  <va-alert status="error" visible>
    <h3 slot="headline">
      We’ve paused your monthly education payments until your enrollment
      information is updated
    </h3>
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

const EnrollmentVerificationAlert = ({ status, submissionResult }) => {
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
  submissionResult: PropTypes.string,
};

const mapStateToProps = state => ({
  submissionResult: state?.data?.enrollmentVerificationSubmissionResult,
});

export default connect(mapStateToProps)(EnrollmentVerificationAlert);
