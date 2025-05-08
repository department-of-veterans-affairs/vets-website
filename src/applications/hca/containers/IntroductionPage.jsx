import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import VerifyAlert from '@department-of-veterans-affairs/platform-user/VerifyAlert';
import { selectAuthStatus, selectEnrollmentStatus } from '../utils/selectors';
import GetStarted from '../components/IntroductionPage/GetStarted';
import content from '../locales/en/content.json';

const IntroductionPage = ({ route }) => {
  const { isUserLOA1, loading } = useSelector(state => ({
    isUserLOA1: selectAuthStatus(state).isUserLOA1,
    loading: selectEnrollmentStatus(state).loading,
  }));

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
              <VerifyAlert headingLevel={3} dataTestId="hca-identity-alert" />
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
