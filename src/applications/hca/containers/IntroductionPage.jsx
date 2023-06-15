import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import EnrollmentStatus from '../components/IntroductionPage/EnrollmentStatus';
import GetStartedContent from '../components/IntroductionPage/GetStarted';
import { IdentityVerificationAlert } from '../components/FormAlerts';

import {
  isLoading,
  isLoggedOut,
  isUserLOA1,
  isUserLOA3,
  shouldShowGetStartedContent,
} from '../utils/selectors';

const IntroductionPage = props => {
  const { route, displayConditions, enrollmentOverrideEnabled } = props;
  const {
    showLoader,
    showLoginAlert,
    showIdentityAlert,
    showLOA3Content,
    showGetStartedContent,
  } = displayConditions;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="schemaform-intro">
      {!showLoader && (
        <>
          <FormTitle title="Apply for VA health care" />
          <p className="vads-u-margin-top--neg2">
            Enrollment Application for Health Benefits (VA Form 10-10EZ)
          </p>
        </>
      )}

      <DowntimeNotification
        appTitle="Application for VA health care"
        dependencies={[externalServices.es]}
      >
        {!showLoader &&
          !showLOA3Content && (
            <p>
              VA health care covers care for your physical and mental health.
              This includes a range of services from checkups to surgeries to
              home health care. It also includes prescriptions and medical
              equipment. Apply online now.
            </p>
          )}

        {showLoader && (
          <va-loading-indicator
            label="Loading"
            message="Loading your application..."
          />
        )}

        {showIdentityAlert && <IdentityVerificationAlert />}

        {(showGetStartedContent || enrollmentOverrideEnabled) && (
          <GetStartedContent route={route} showLoginAlert={showLoginAlert} />
        )}

        {showLOA3Content &&
          !enrollmentOverrideEnabled && <EnrollmentStatus route={route} />}
      </DowntimeNotification>
    </div>
  );
};

IntroductionPage.propTypes = {
  displayConditions: PropTypes.object,
  enrollmentOverrideEnabled: PropTypes.bool,
  route: PropTypes.object,
};

const mapStateToProps = state => ({
  displayConditions: {
    showLoader: isLoading(state),
    showLOA3Content: isUserLOA3(state),
    showGetStartedContent: shouldShowGetStartedContent(state),
    showLoginAlert: isLoggedOut(state),
    showIdentityAlert: isUserLOA1(state),
  },
  enrollmentOverrideEnabled:
    state.featureToggles.hcaEnrollmentStatusOverrideEnabled,
});

export { IntroductionPage };
export default connect(mapStateToProps)(IntroductionPage);
