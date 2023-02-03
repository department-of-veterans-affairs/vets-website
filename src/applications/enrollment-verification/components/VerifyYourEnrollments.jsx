import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  VERIFY_ENROLLMENTS_RELATIVE_URL,
  VERIFY_ENROLLMENTS_URL,
} from '../constants';
import { ENROLLMENT_VERIFICATION_TYPE } from '../helpers';
import { getEVData } from '../selectors';

function VerifyYourEnrollments({
  enrollmentVerification,
  pluralEnrollments = false,
}) {
  const history = useHistory();

  const onVerifyAllEnrollments = useCallback(
    event => {
      if (history) {
        event.preventDefault();
        history.push(VERIFY_ENROLLMENTS_RELATIVE_URL);
      }
    },
    [history],
  );

  const numUnverifiedMonths = enrollmentVerification?.enrollmentVerifications?.filter(
    ev =>
      ev.certifiedEndDate > enrollmentVerification?.lastCertifiedThroughDate,
  ).length;

  return (
    <a
      className="vads-c-action-link--blue ev-action-link"
      href={VERIFY_ENROLLMENTS_URL}
      onClick={onVerifyAllEnrollments}
    >
      Verify your{' '}
      {pluralEnrollments && numUnverifiedMonths > 1
        ? 'enrollments'
        : 'enrollment'}
    </a>
  );
}

VerifyYourEnrollments.propTypes = {
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE,
  pluralEnrollments: PropTypes.bool,
};

const mapStateToProps = state => getEVData(state);

export default connect(mapStateToProps)(VerifyYourEnrollments);
