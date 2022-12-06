import React from 'react';
import PropTypes from 'prop-types';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';
import HCAPrivacyActStatement from '../HCAPrivacyActStatement';
import HCASubwayMap from '../HCASubwayMap';

const LoggedOutContent = ({ route, showLoginAlert }) => {
  const { formConfig, pageList } = route;
  return (
    <>
      {showLoginAlert ? (
        <va-alert status="info" background-only>
          <h2 className="vads-u-font-size--h4 vads-u-margin-top--0 vads-u-margin-bottom--2">
            Have you applied for VA health care before?
          </h2>
          <LoginModalButton
            context="hcainfo"
            message="Sign in to check your application status"
          />
        </va-alert>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          downtime={formConfig.downtime}
          pageList={pageList}
          startText="Start the health care application"
        />
      )}

      <HCASubwayMap />

      {showLoginAlert ? (
        <va-alert status="info" class="vads-u-margin-bottom--5">
          <h2 slot="headline">Save time and save your work in progress</h2>
          <p>Here’s how signing in now helps you:</p>
          <ul>
            <li>
              We can fill in some of your information for you to save you time.
            </li>
            <li>
              You can save your work in progress. You’ll have 60 days from when
              you start or make updates to your application to come back and
              finish it.
            </li>
          </ul>
          <p>
            <strong>Note:</strong> You can sign in after you start your
            application. But you’ll lose any information you already filled in.
          </p>
          <SaveInProgressIntro
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            downtime={formConfig.downtime}
            pageList={pageList}
            startText="Start the health care application"
            buttonOnly
          />
        </va-alert>
      ) : (
        <div className="vads-u-margin-y--3">
          <SaveInProgressIntro
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            downtime={formConfig.downtime}
            pageList={pageList}
            startText="Start the health care application"
            buttonOnly
          />
        </div>
      )}

      <va-omb-info exp-date="06/30/2024" omb-number="2900-0091" res-burden={30}>
        <HCAPrivacyActStatement />
      </va-omb-info>
    </>
  );
};

LoggedOutContent.propTypes = {
  route: PropTypes.object,
  showLoginAlert: PropTypes.bool,
};

export default LoggedOutContent;
