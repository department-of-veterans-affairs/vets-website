import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { selectEnrollmentStatus } from '../utils/selectors/entrollment-status';
import content from '../locales/en/content.json';
import ProcessDescription from '../components/IntroductionPage/ProcessDescription';
import SaveInProgressInfo from '../components/IntroductionPage/SaveInProgressInfo';
import OMBInfo from '../components/IntroductionPage/OMBInfo';

const IntroductionPage = ({ route }) => {
  const { isLoading } = useSelector(selectEnrollmentStatus);
  const { formConfig, pageList } = route;
  const sipProps = { formConfig, pageList };

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <>
      <div className="ezr-intro schemaform-intro">
        <DowntimeNotification
          appTitle={content['form-title']}
          dependencies={[externalServices.es]}
        >
          {isLoading ? (
            <va-loading-indicator message={content['load-enrollment-status']} />
          ) : (
            <>
              <ProcessDescription />
              <SaveInProgressInfo {...sipProps} />
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
