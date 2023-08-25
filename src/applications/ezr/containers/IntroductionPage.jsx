import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { selectEnrollmentStatus } from '../utils/selectors/entrollment-status';
import content from '../locales/en/content.json';
import GetStarted from '../components/IntroductionPage/GetStarted';

const IntroductionPage = ({ route }) => {
  const enrollmentStatus = useSelector(selectEnrollmentStatus);
  const { isLoading, isEnrolledinESR } = enrollmentStatus;

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  return (
    <>
      <div className="erz-intro schemaform-intro">
        <DowntimeNotification
          appTitle={content['form-title']}
          dependencies={[externalServices.es]}
        >
          <FormTitle
            title={content['form-title']}
            subTitle={content['form-subtitle']}
          />
          {isLoading ? (
            <va-loading-indicator message={content['load-enrollment-status']} />
          ) : (
            <GetStarted route={route} enrolled={isEnrolledinESR} />
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
