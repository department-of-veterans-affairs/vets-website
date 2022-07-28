import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import HCASubwayMap from './HCASubwayMap';
import HcaOMBInfo from './HcaOMBInfo';

const LoggedOutIntroContent = ({ route, showLoginAlert, toggleLoginModal }) => {
  const { formConfig, pageList } = route;
  return (
    <>
      {showLoginAlert ? (
        <va-alert status="info" background-only>
          <h2 className="vads-u-margin-y--0 vads-u-font-size--h4">
            Have you applied for VA health care before?
          </h2>
          <button
            type="button"
            className="usa-button vads-u-margin-top--2"
            onClick={() => toggleLoginModal(true, 'hcainfo')}
          >
            Sign in to check your application status
          </button>
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
        <va-alert class="vads-u-margin-bottom--5" status="info">
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
      <div className="omb-info--container vads-u-padding-left--0">
        <HcaOMBInfo />
      </div>
    </>
  );
};

LoggedOutIntroContent.propTypes = {
  route: PropTypes.object,
  showLoginAlert: PropTypes.bool,
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  toggleLoginModal: toggleLoginModalAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(LoggedOutIntroContent);
