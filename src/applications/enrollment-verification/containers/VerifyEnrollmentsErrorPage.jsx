import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { fetchPost911GiBillEligibility } from '../actions';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import { ENROLLMENT_VERIFICATION_TYPE } from '../helpers';

export const VerifyEnrollmentsErrorPage = ({
  enrollmentVerification,
  getPost911GiBillEligibility,
  hasCheckedKeepAlive,
  loggedIn,
}) => {
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !loggedIn) {
        history.push('/');
      }
    },
    [
      enrollmentVerification,
      getPost911GiBillEligibility,
      hasCheckedKeepAlive,
      history,
      loggedIn,
    ],
  );

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Verify your enrollments</h1>

      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">There was an error processing your enrollment</h2>
        <p className="vads-u-margin-y--0">
          We’re sorry we couldn’t process your monthly enrollment verification.
          Please call <va-telephone contact="8884424551" /> or submit an inquiry
          at
          <a href="https://ask.va.gov/">Ask VA</a> to submit your verification.
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
  loggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  editMonthVerification: state?.data?.editMonthVerification,
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  enrollmentVerification: state?.data?.enrollmentVerification,
});

const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEnrollmentsErrorPage);
