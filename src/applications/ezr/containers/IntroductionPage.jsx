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

const IntroductionPage = ({ fetchEnrollmentStatus, route, user }) => {
  const { isLoading, hasPreferredFacility } = useSelector(
    selectEnrollmentStatus,
  );
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const { formConfig, pageList } = route;
  const sipProps = { formConfig, pageList };

  useEffect(
    () => {
      if (isUserLOA3 && !hasPreferredFacility) {
        window.location.replace('/my-health');
      }
    },
    [isUserLOA3, hasPreferredFacility],
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
        {isLoading ? (
          <va-loading-indicator message={content['load-enrollment-status']} />
        ) : (
          <>
            <ProcessDescription />
            {!isUserLOA3 ? (
              <div className="vads-u-margin-y--4">
                <VerifyAlert
                  status="info"
                  heading="Please verify your identity to access this form"
                  learnMoreUrl="/verify-identity"
                  headingLevel={3}
                  dataTestId="ezr-identity-alert"
                />
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

  return (
    <RequiredLoginView
      verify
      authRequired={3}
      serviceRequired="id-verify"
      user={user}
    >
      {pageContent}
    </RequiredLoginView>
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

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
