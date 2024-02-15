import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';

import EnrollmentStatus from '../components/IntroductionPage/EnrollmentStatus';
import GetStartedContent from '../components/IntroductionPage/GetStarted';
import IdentityVerificationAlert from '../components/FormAlerts/IdentityVerificationAlert';

import {
  isLoading,
  isLoggedOut,
  isUserLOA1,
  isUserLOA3,
  shouldShowGetStartedContent,
} from '../utils/selectors';

import { setDatadogRUMUserConfig } from '../utils/helpers/datadog-rum-user';

const IntroductionPage = props => {
  const { route, displayConditions, features } = props;
  const {
    showLoader,
    showLoginAlert,
    showIdentityAlert,
    showLOA3Content,
    showGetStartedContent,
  } = displayConditions;
  const { enrollmentOverrideEnabled } = features;

  const onVerifyEvent = recordEvent({ event: AUTH_EVENTS.VERIFY });

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="schemaform-intro">
      {!showLoader && (
        <>
          <FormTitle
            title="Apply for VA health care"
            subTitle="Enrollment Application for Health Benefits (VA Form 10-10EZ)"
          />
        </>
      )}

      <DowntimeNotification
        appTitle="Application for VA health care"
        dependencies={[externalServices.es]}
      >
        {!showLoader &&
          !showLOA3Content && (
            <p data-testid="hca-loa1-description">
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

        {showIdentityAlert && (
          <IdentityVerificationAlert onVerify={onVerifyEvent} />
        )}

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
  features: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = state => {
  setDatadogRUMUserConfig(state);

  return {
    displayConditions: {
      showLoader: isLoading(state),
      showLOA3Content: isUserLOA3(state),
      showGetStartedContent: shouldShowGetStartedContent(state),
      showLoginAlert: isLoggedOut(state),
      showIdentityAlert: isUserLOA1(state),
    },
    features: {
      enrollmentOverrideEnabled:
        state.featureToggles.hcaEnrollmentStatusOverrideEnabled,
    },
  };
};

export { IntroductionPage };
export default connect(mapStateToProps)(IntroductionPage);
