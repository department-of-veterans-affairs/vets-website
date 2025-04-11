import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { fetchPost911GiBillEligibility } from '../actions';
import { STATIC_CONTENT_ENROLLMENT_URL } from '../constants';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import { ENROLLMENT_VERIFICATION_TYPE } from '../helpers';
import { getEVData } from '../selectors';

export const VerifyEnrollmentsErrorPage = ({
  isLoggedIn,
  enrollmentVerification,
  getPost911GiBillEligibility,
  hasCheckedKeepAlive,
}) => {
  const history = useHistory();

  useEffect(() => {
    if (hasCheckedKeepAlive && !isLoggedIn) {
      window.location.href = STATIC_CONTENT_ENROLLMENT_URL;
    }
  }, [
    enrollmentVerification,
    getPost911GiBillEligibility,
    hasCheckedKeepAlive,
    history,
    isLoggedIn,
  ]);

  useEffect(() => {
    scrollToTop();
  }, []);

  if (!isLoggedIn && !hasCheckedKeepAlive) {
    return <EnrollmentVerificationLoadingIndicator />;
  }
  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>

      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">There was an error processing your enrollment.</h2>
        <p className="vads-u-margin-bottom--0">
          We’re sorry we couldn’t process your monthly enrollment verification.
          Please submit an inquiry at <a href="https://ask.va.gov/">Ask VA</a>{' '}
          to submit your verification.
        </p>
      </va-alert>
    </EnrollmentVerificationPageWrapper>
  );
};

VerifyEnrollmentsErrorPage.propTypes = {
  editMonthVerification: PropTypes.number,
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE,
  getPost911GiBillEligibility: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => getEVData(state);

const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEnrollmentsErrorPage);
