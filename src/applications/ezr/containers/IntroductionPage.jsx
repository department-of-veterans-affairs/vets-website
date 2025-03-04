import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import environment from '~/platform/utilities/environment';
import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { isProfileLoading } from 'platform/user/selectors';
import { fetchEnrollmentStatus as fetchEnrollmentStatusAction } from '../utils/actions/enrollment-status';
import { selectEnrollmentStatus } from '../utils/selectors/enrollment-status';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';
import content from '../locales/en/content.json';
import { serviceRequired } from '../utils/helpers/route-guard';
import { mockUser } from '../utils/test/mock-user';

/**
 * Introduction page component for the EZR form.
 *
 * Features:
 * - Displays process description and form information
 * - Shows identity verification alert for non-LOA3 users
 * - Handles enrollment status loading and display
 * - Manages save-in-progress functionality
 *
 * Development Mode Behavior:
 * - In localhost environment (environment.isLocalhost):
 *   - Identity verification alert is hidden
 *   - Mock user data is provided automatically
 *   - All features are accessible without authentication
 * - In other environments:
 *   - Full identity verification required
 *   - Real user data and authentication enforced
 */
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
            {!isUserLOA3 && !environment.isLocalhost ? (
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
  if (process.env.NODE_ENV === 'development') {
    return { user: mockUser };
  }
  return { user: state.user };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
