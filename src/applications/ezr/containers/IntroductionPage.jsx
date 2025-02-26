import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { isProfileLoading } from 'platform/user/selectors';
import { fetchEnrollmentStatus as fetchEnrollmentStatusAction } from '../utils/actions/enrollment-status';
import { selectEnrollmentStatus } from '../utils/selectors/enrollment-status';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';
import content from '../locales/en/content.json';

const serviceRequired = [
  backendServices.FACILITIES,
  // backendServices.FORM_PREFILL,
  backendServices.IDENTITY_PROOFED,
  // backendServices.SAVE_IN_PROGRESS,
  backendServices.USER_PROFILE,
];

const IntroductionPage = ({
  fetchEnrollmentStatus,
  route,
  user: originalUser,
}) => {
  const {
    isLoading: enrollmentStatusLoading,
    hasPreferredFacility,
  } = useSelector(selectEnrollmentStatus);
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const { formConfig, pageList } = route;
  const isLoadingUserProfile = useSelector(isProfileLoading);
  const sipProps = { formConfig, pageList };

  useEffect(
    () => {
      // Skip redirects during testing
      if (process.env.NODE_ENV === 'test') {
        return;
      }

      // Don't redirect while still loading profile
      if (isLoadingUserProfile) {
        return;
      }

      // Redirect unverified users to identity verification
      if (!isUserLOA3) {
        window.location.replace('/verify-identity');
      }

      // Redirect verified users without preferred facility to health dashboard
      if (isUserLOA3 && !hasPreferredFacility) {
        window.location.replace('/my-health');
      }
    },
    [isUserLOA3, hasPreferredFacility, isLoadingUserProfile],
  );

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
      if (isUserLOA3) {
        fetchEnrollmentStatus();
      }
    },
    [isUserLOA3, fetchEnrollmentStatus],
  );

  const pageContent = (
    <div className="ezr-intro schemaform-intro">
      <DowntimeNotification
        appTitle={content['form-title']}
        dependencies={[externalServices['1010ezr']]}
      >
        {enrollmentStatusLoading ? (
          <va-loading-indicator message={content['load-enrollment-status']} />
        ) : (
          <>
            <ProcessDescription />
            {!isUserLOA3 ? (
              <VerifyAlert
                status="info"
                heading="Please verify your identity to access this form"
                learnMoreUrl="/verify-identity"
                headingLevel={3}
                dataTestId="ezr-identity-alert"
              />
            ) : (
              <SaveInProgressInfo {...sipProps} />
            )}
            <OMBInfo />
          </>
        )}
      </DowntimeNotification>
    </div>
  );

  const requiredLoginProps = {
    verify: true,
    serviceRequired,
    user: originalUser,
  };

  return (
    <RequiredLoginView {...requiredLoginProps}>{pageContent}</RequiredLoginView>
  );
};

IntroductionPage.propTypes = {
  fetchEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
  user: PropTypes.object,
};

const mapDispatchToProps = {
  fetchEnrollmentStatus: fetchEnrollmentStatusAction,
};

const mapStateToProps = state => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return {
      user: {
        profile: {
          verified: true,
          loa: { current: 3, highest: 3 },
          services: ['identity-proofed', 'facilities', 'user-profile'],
          loading: false,
          accountType: null,
          email: null,
          gender: null,
          status: null,
          userFullName: {
            first: null,
            middle: null,
            last: null,
            suffix: null,
          },
          vapContactInfo: {},
          session: {},
          prefillsAvailable: [],
          savedForms: [],
        },
        login: {
          currentlyLoggedIn: true,
          hasCheckedKeepAlive: true,
        },
      },
    };
  }

  return { user: state.user };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
