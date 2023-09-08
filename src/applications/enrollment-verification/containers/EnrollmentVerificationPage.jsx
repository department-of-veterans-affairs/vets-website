import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import {
  fetchPost911GiBillEligibility,
  UPDATE_VERIFICATION_STATUS_SUCCESS,
} from '../actions';
import { STATIC_CONTENT_ENROLLMENT_URL } from '../constants';
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
  getPost911GiBillEligibility,
  hasCheckedKeepAlive,
  isLoggedIn,
  submissionResult,
}) => {
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !isLoggedIn) {
        window.location.href = STATIC_CONTENT_ENROLLMENT_URL;
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

  useEffect(
    () => {
      if (
        submissionResult !== UPDATE_VERIFICATION_STATUS_SUCCESS &&
        isLoggedIn
      ) {
        focusElement('va-alert');
      }
    },
    [submissionResult],
  );

  if (
    !enrollmentVerificationFetchComplete ||
    (!isLoggedIn && !hasCheckedKeepAlive)
  ) {
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
        each month. If it’s been more than 2 months since you verified your
        enrollment, we’ll pause your monthly education payments.
      </p>

      {enrollmentVerification?.enrollmentVerifications?.length > 0 && (
        <EnrollmentVerificationAlert status={status} />
      )}

      {enrollmentVerificationFetchComplete && (
        // !enrollmentVerificationFetchFailure && (
        <EnrollmentVerificationMonths
          status={status}
          enrollmentVerification={enrollmentVerification}
        />
      )}

      <div className="ev-highlighted-content-container vads-u-margin-top--3">
        <header className="ev-highlighted-content-container_header">
          <h3 className="ev-highlighted-content-container_title vads-u-font-size--h3">
            Related pages
          </h3>
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
  // enrollmentVerificationFetchFailure: PropTypes.bool,
  getPost911GiBillEligibility: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  submissionResult: PropTypes.string,
};

const mapStateToProps = state => getEVData(state);

const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationPage);
