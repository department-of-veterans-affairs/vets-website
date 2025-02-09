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

import { fetchEnrollmentStatus as fetchEnrollmentStatusAction } from '../utils/actions/enrollment-status';
import { selectEnrollmentStatus } from '../utils/selectors/enrollment-status';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';
import content from '../locales/en/content.json';

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
  const sipProps = { formConfig, pageList };

  // Determine if the user should be routed to a different page
  const shouldRedirect = isUserLOA3 && !hasPreferredFacility;
  useEffect(
    () => {
      if (shouldRedirect && process.env.NODE_ENV !== 'test') {
        window.location.replace('/my-health');
      }
    },
    [shouldRedirect],
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
    authRequired: 3,
    serviceRequired: 'identity-proofed',
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
  // Mock the state in development mode
  if (process.env.NODE_ENV === 'development') {
    return {
      user: {
        profile: {
          verified: true,
          loa: { current: 3 },
          services: ['identity-proofed'],
          loading: false,
        },
        login: { currentlyLoggedIn: true },
      },
    };
  }
  return {
    user: state.user,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
