import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { selectEnrollmentStatus } from '../utils/selectors/entrollment-status';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import IdentityVerificationAlert from '../components/FormAlerts/IdentityVerificationAlert';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';
import content from '../locales/en/content.json';

const IntroductionPage = ({ route }) => {
  const { isLoading } = useSelector(selectEnrollmentStatus);
  const { isUserLOA1 } = useSelector(selectAuthStatus);
  const { formConfig, pageList } = route;
  const sipProps = { formConfig, pageList };

  const onVerifyEvent = recordEvent({ event: AUTH_EVENTS.VERIFY });

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <>
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
                <IdentityVerificationAlert onVerify={onVerifyEvent} />
              ) : (
                <SaveInProgressInfo {...sipProps} />
              )}
              <OMBInfo />
            </>
          )}
        </DowntimeNotification>
      </div>
    </>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.object,
};

const mapDispatchToProps = {};

export default connect(
  null,
  mapDispatchToProps,
)(IntroductionPage);
