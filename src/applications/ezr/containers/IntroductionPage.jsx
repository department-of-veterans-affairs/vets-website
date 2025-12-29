import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';

import { selectAuthStatus, selectEnrollmentStatus } from '../utils/selectors';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';
import content from '../locales/en/content.json';

const IntroductionPage = ({ route }) => {
  const { isLoading } = useSelector(selectEnrollmentStatus);
  const { isUserLOA1 } = useSelector(selectAuthStatus);
  const { formConfig, pageList } = route;
  const sipProps = { formConfig, pageList };

  useEffect(() => focusElement('.va-nav-breadcrumbs-list'), []);

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
                <div className="vads-u-margin-y--4">
                  <VerifyAlert
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
    </>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.object,
};

export default IntroductionPage;
