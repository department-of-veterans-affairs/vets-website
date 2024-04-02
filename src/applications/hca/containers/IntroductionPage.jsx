import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import { focusElement } from '~/platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';

import IdentityVerificationAlert from '../components/FormAlerts/IdentityVerificationAlert';
import GetStarted from '../components/IntroductionPage/GetStarted';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import { selectEnrollmentStatus } from '../utils/selectors/enrollment-status';
import content from '../locales/en/content.json';

const IntroductionPage = ({ route }) => {
  const { loading } = useSelector(selectEnrollmentStatus);
  const { isUserLOA1 } = useSelector(selectAuthStatus);

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <div className="schemaform-intro">
      <DowntimeNotification
        appTitle={content['form-title']}
        dependencies={[externalServices['1010ez']]}
      >
        {loading ? (
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
              <IdentityVerificationAlert />
            ) : (
              <GetStarted route={route} />
            )}
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
