import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';

import IdentityVerificationAlert from '../components/FormAlerts/IdentityVerificationAlert';
import GetStarted from '../components/IntroductionPage/GetStarted';
import OMBInfo from '../components/IntroductionPage/GetStarted/OMBInfo';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { selectEnrollmentStatus } from '../utils/selectors/enrollment-status';
import content from '../locales/en/content.json';

const IntroductionPage = ({ route }) => {
  const { isLoadingApplicationStatus } = useSelector(selectEnrollmentStatus);
  const { isUserLOA1 } = useSelector(selectAuthStatus);
  const onVerifyEvent = recordEvent({ event: AUTH_EVENTS.VERIFY });

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="schemaform-intro">
      <DowntimeNotification
        appTitle={content['form-title']}
        dependencies={[externalServices.es]}
      >
        {isLoadingApplicationStatus ? (
          <va-loading-indicator
            message={content['load-enrollment-status']}
            class="vads-u-margin-y--4"
            set-focus
          />
        ) : (
          <>
            <FormTitle
              title={content['form-title']}
              subTitle={content['form-subtitle']}
            />

            {isUserLOA1 ? (
              <IdentityVerificationAlert onVerify={onVerifyEvent} />
            ) : (
              <GetStarted route={route} />
            )}

            <OMBInfo />
          </>
        )}
      </DowntimeNotification>
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.object,
};

export default IntroductionPage;
