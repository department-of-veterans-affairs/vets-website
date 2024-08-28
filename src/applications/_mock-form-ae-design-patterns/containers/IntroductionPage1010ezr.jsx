import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { AUTH_EVENTS } from 'platform/user/authentication/constants';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { selectAuthStatus } from '../utils/selectors/auth-status';
import IdentityVerificationAlert from '../components/FormAlerts/IdentityVerificationAlert';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';
import content from '../locales/en/content.json';

const IntroductionPage = props => {
  const { route } = props;

  const { isUserLOA1, isUserLOA3 } = useSelector(selectAuthStatus);
  const { formConfig, pageList } = route;
  const sipProps = { formConfig, pageList };

  const onVerifyEvent = recordEvent({ event: AUTH_EVENTS.VERIFY });

  useEffect(
    () => {
      focusElement('.va-nav-breadcrumbs-list');
      // if (isUserLOA3) {
      //   console.log('user is LOA3');
      // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isUserLOA3],
  );

  return (
    <>
      <div className="ezr-intro schemaform-intro">
        <DowntimeNotification
          appTitle={content['form-title']}
          dependencies={[externalServices['1010ezr']]}
        >
          <>
            <ProcessDescription />
            {isUserLOA1 ? (
              <IdentityVerificationAlert onVerify={onVerifyEvent} />
            ) : (
              <SaveInProgressInfo {...sipProps} route={route} />
            )}
            <OMBInfo />
          </>
        </DowntimeNotification>
      </div>
    </>
  );
};

IntroductionPage.propTypes = {
  fetchEnrollmentStatus: PropTypes.func,
  route: PropTypes.object,
};

export default IntroductionPage;
