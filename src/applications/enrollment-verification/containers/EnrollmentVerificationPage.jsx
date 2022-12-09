import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { fetchPost911GiBillEligibility } from '../actions';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationAlert from '../components/EnrollmentVerificationAlert';
import EnrollmentVerificationMonths from '../components/EnrollmentVerificationMonths';
import {
  ENROLLMENT_VERIFICATION_TYPE,
  getEnrollmentVerificationStatus,
} from '../helpers';
import { getEVData } from '../selectors';

export const EnrollmentVerificationPage = ({
  enrollmentVerification,
  enrollmentVerificationFetchComplete,
  enrollmentVerificationFetchFailure,
  getPost911GiBillEligibility,
  hasCheckedKeepAlive,
  isLoggedIn,
}) => {
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !isLoggedIn) {
        history.push('/');
      }
    },
    [hasCheckedKeepAlive, history, isLoggedIn],
  );

  useEffect(
    () => {
      if (!enrollmentVerification) {
        getPost911GiBillEligibility();
      }
    },
    [getPost911GiBillEligibility, enrollmentVerification],
  );

  if (!enrollmentVerificationFetchComplete) {
    return <EnrollmentVerificationLoadingIndicator />;
  }

  const status = getEnrollmentVerificationStatus(enrollmentVerification);

  return (
    <EnrollmentVerificationPageWrapper>
      <h1>Post-9/11 GI Bill enrollment verifications</h1>
      <p className="va-introtext">
        If you get a monthly housing allowance (MHA) or kicker payments (or
        both) under the Post-9/11 GI Bill
        <sup>&reg;</sup> (Chapter 33), you’ll need to verify your enrollment
        each month. If you don’t verify your enrollment for{' '}
        <strong>two months in a row</strong>, we will pause your monthly
        education payments.
      </p>

      <EnrollmentVerificationAlert status={status} />

      {enrollmentVerificationFetchComplete &&
        !enrollmentVerificationFetchFailure && (
          <EnrollmentVerificationMonths
            status={status}
            enrollmentVerification={enrollmentVerification}
          />
        )}

      <div className="ev-highlighted-content-container vads-u-margin-top--3">
        <header className="ev-highlighted-content-container_header">
          <h1 className="ev-highlighted-content-container_title vads-u-font-size--h3">
            Related pages
          </h1>
        </header>
        <div className="ev-highlighted-content-container_content">
          <nav className="ev-related-pages-nav">
            <ul>
              <li>
                <a href="/">See your GI Bill Statement of Benefits</a>
              </li>
              <li>
                <a href="/">See your past benefit payments</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </EnrollmentVerificationPageWrapper>
  );
};

EnrollmentVerificationPage.propTypes = {
  enrollmentVerification: ENROLLMENT_VERIFICATION_TYPE,
  enrollmentVerificationFetchComplete: PropTypes.bool,
  enrollmentVerificationFetchFailure: PropTypes.bool,
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
)(EnrollmentVerificationPage);
