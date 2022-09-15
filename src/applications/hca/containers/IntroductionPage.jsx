import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import HCAEnrollmentStatus from './HCAEnrollmentStatus';
import LoggedOutContent from '../components/IntroductionPage/LoggedOutContent';
import { VerificationRequiredAlert } from '../components/FormAlerts';

import {
  isLoading,
  isLoggedOut,
  isUserLOA1,
  isUserLOA3,
  shouldShowLoggedOutContent,
} from '../selectors';

const IntroductionPage = props => {
  const {
    route,
    showLOA3Content,
    showLoggedOutContent,
    showLoginAlert,
    showMainLoader,
    showVerificationRequiredAlert,
    hcaEnrollmentStatusOverrideEnabled,
  } = props;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for VA health care" />
      <p className="vads-u-margin-top--neg2">
        Enrollment Application for Health Benefits (VA Form 10-10EZ)
      </p>
      {!showLOA3Content && (
        <p className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-line-height--3 vads-u-margin-bottom--5">
          VA health care covers care for your physical and mental health. This
          includes a range of services from checkups to surgeries to home health
          care. It also includes prescriptions and medical equipment. Apply
          online now.
        </p>
      )}
      {showMainLoader && (
        <va-loading-indicator
          label="Loading"
          message="Loading your application..."
        />
      )}
      {showVerificationRequiredAlert && <VerificationRequiredAlert />}
      {(showLoggedOutContent || hcaEnrollmentStatusOverrideEnabled) && (
        <LoggedOutContent route={route} showLoginAlert={showLoginAlert} />
      )}
      {showLOA3Content &&
        !hcaEnrollmentStatusOverrideEnabled && (
          <HCAEnrollmentStatus route={route} />
        )}
    </div>
  );
};

IntroductionPage.propTypes = {
  hcaEnrollmentStatusOverrideEnabled: PropTypes.bool,
  route: PropTypes.object,
  showLOA3Content: PropTypes.bool,
  showLoggedOutContent: PropTypes.bool,
  showLoginAlert: PropTypes.bool,
  showMainLoader: PropTypes.bool,
  showVerificationRequiredAlert: PropTypes.bool,
};

const mapStateToProps = state => ({
  showMainLoader: isLoading(state),
  showLOA3Content: isUserLOA3(state),
  showLoggedOutContent: shouldShowLoggedOutContent(state),
  showLoginAlert: isLoggedOut(state),
  showVerificationRequiredAlert: isUserLOA1(state),
  hcaEnrollmentStatusOverrideEnabled: toggleValues(state)[
    FEATURE_FLAG_NAMES.hcaEnrollmentStatusOverrideEnabled
  ],
});

export { IntroductionPage };
export default connect(mapStateToProps)(IntroductionPage);
