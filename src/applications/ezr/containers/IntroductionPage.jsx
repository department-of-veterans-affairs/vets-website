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

const IntroductionPage = ({ fetchEnrollmentStatus, route, location }) => {
  const { isLoading } = useSelector(selectEnrollmentStatus);
  const { isUserLOA1, isUserLOA3 } = useSelector(selectAuthStatus);
  const { formConfig, pageList } = route;
  const sipProps = { formConfig, pageList };

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
      if (isUserLOA3) {
        fetchEnrollmentStatus();
      }
    },
    [isUserLOA3, fetchEnrollmentStatus],
  );

  useEffect(
    () => {
      // Check if we're on the protected route and user is not authenticated
      if (
        location.pathname.startsWith(
          '/my-health/update-benefits-information-form-10-10ezr',
        ) &&
        !isUserLOA1 &&
        !isUserLOA3
      ) {
        // Redirect to va.gov/my-health
        window.location.href = 'https://www.va.gov/my-health';
      }
    },
    [location.pathname, isUserLOA1, isUserLOA3],
  );

  const pageContent = (
    <div className="ezr-intro schemaform-intro">
      <DowntimeNotification
        appTitle={content['form-title']}
        dependencies={[externalServices['1010ezr']]}
      >
        {isLoading ? (
          <va-loading-indicator message={content['load-enrollment-status']} />
        ) : (
          <>
            <ProcessDescription />
            {isUserLOA1 ? (
              <div className="vads-u-margin-y--4">
                <VerifyAlert headingLevel={3} dataTestId="ezr-identity-alert" />
              </div>
            ) : (
              <SaveInProgressInfo {...sipProps} />
            )}
            <OMBInfo />
          </>
        )}
      </DowntimeNotification>
    </div>
  );

  // Only require login for /my-health/update-benefits-information-form-10-10ezr routes
  if (
    location.pathname.startsWith(
      '/my-health/update-benefits-information-form-10-10ezr',
    )
  ) {
    return (
      <RequiredLoginView authRequired={1} serviceRequired="user-profile">
        {pageContent}
      </RequiredLoginView>
    );
  }

  return pageContent;
};

IntroductionPage.propTypes = {
  fetchEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
  location: PropTypes.object,
};

const mapDispatchToProps = {
  fetchEnrollmentStatus: fetchEnrollmentStatusAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(IntroductionPage);
