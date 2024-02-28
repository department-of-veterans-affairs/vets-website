import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import ProcessTimeline from './ProcessTimeline';
import OMBInfo from './OMBInfo';

const GetStartedContent = ({ route, showLoginAlert, toggleLoginModal }) => {
  const { formConfig, pageList } = route;
  return (
    <>
      {showLoginAlert ? (
        <va-alert status="info" uswds>
          <h2 slot="headline" className="vads-u-font-size--h3">
            Have you applied for VA health care before?
          </h2>
          <va-button
            text="Sign in to check your application status"
            onClick={() => toggleLoginModal(true, 'hcainfo')}
            data-testid="hca-login-alert-button"
            uswds
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
        >
          <p>
            You should know that we updated our online form.{' '}
            <strong>If you started applying online before March 5, 2024</strong>
            , we have some new questions for you to answer. And you may need to
            provide certain information again.
          </p>
          <p>
            Select <strong>Continue your application</strong> to use our updated
            form, or come back later to finish your application.
          </p>
        </SaveInProgressIntro>
      )}

      <ProcessTimeline />

      {showLoginAlert ? (
        <va-alert status="info" class="vads-u-margin-bottom--5" uswds>
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

      <OMBInfo />
    </>
  );
};

GetStartedContent.propTypes = {
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
)(GetStartedContent);
