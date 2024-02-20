import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
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
  showMebEnrollmentVerificationMaintenanceAlert,
  submissionResult,
}) => {
  const history = useHistory();

  useEffect(
    () => {
      if (hasCheckedKeepAlive && !isLoggedIn) {
        history.push(STATIC_CONTENT_ENROLLMENT_URL);
      }
    },
    [hasCheckedKeepAlive, isLoggedIn, history],
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
    [submissionResult, isLoggedIn],
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
        <EnrollmentVerificationMonths
          status={status}
          enrollmentVerification={enrollmentVerification}
          showMaintenanceAlert={showMebEnrollmentVerificationMaintenanceAlert}
        />
      )}

      {showMebEnrollmentVerificationMaintenanceAlert && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">System Maintenance</h2>
          <div>
            <p className="vads-u-margin-top--0">
              We’re currently making updates to the My Education Benefits
              platform. We apologize for the inconvenience. Please check back
              soon.
            </p>
          </div>
        </va-alert>
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
  getPost911GiBillEligibility: PropTypes.func,
  hasCheckedKeepAlive: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  showMebEnrollmentVerificationMaintenanceAlert: PropTypes.bool,
  submissionResult: PropTypes.string,
};
const mapStateToProps = state => ({
  ...getEVData(state),
  showMebEnrollmentVerificationMaintenanceAlert:
    state.featureToggles[
      featureFlagNames.showMebEnrollmentVerificationMaintenanceAlert
    ],
});
const mapDispatchToProps = {
  getPost911GiBillEligibility: fetchPost911GiBillEligibility,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnrollmentVerificationPage);
