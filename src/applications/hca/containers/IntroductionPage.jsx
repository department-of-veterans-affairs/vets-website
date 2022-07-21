import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import HCAEnrollmentStatus from './HCAEnrollmentStatus';
import { VerificationRequiredAlert } from '../components/FormAlerts';
import HCASubwayMap from '../components/HCASubwayMap';
import HcaOMBInfo from '../components/HCAOMBInfo';
import {
  isLoading,
  isLoggedOut,
  isUserLOA1,
  isUserLOA3,
  shouldShowLoggedOutContent,
} from '../selectors';

const LoggedOutContent = connect(
  null,
  { toggleLoginModal },
)(({ route, showLoginAlert, toggleLoginModal: showLoginModal }) => (
  <>
    {showLoginAlert ? (
      <va-alert status="info" background-only>
        <h2 className="vads-u-margin-y--0 vads-u-font-size--h4">
          Have you applied for VA health care before?
        </h2>
        <button
          type="button"
          className="usa-button vads-u-margin-top--2"
          onClick={() => showLoginModal(true, 'hcainfo')}
        >
          Sign in to check your application status
        </button>
      </va-alert>
    ) : (
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        downtime={route.formConfig.downtime}
        pageList={route.pageList}
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
          buttonOnly
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          pageList={route.pageList}
          startText="Start the health care application"
          downtime={route.formConfig.downtime}
        />
      </va-alert>
    ) : (
      <div className="vads-u-margin-y--3">
        <SaveInProgressIntro
          buttonOnly
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          downtime={route.formConfig.downtime}
          pageList={route.pageList}
          startText="Start the health care application"
        />
      </div>
    )}
    <div className="omb-info--container vads-u-padding-left--0">
      <HcaOMBInfo />
    </div>
  </>
));

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const {
      route,
      showLOA3Content,
      showLoggedOutContent,
      showLoginAlert,
      showMainLoader,
      showVerificationRequiredAlert,
    } = this.props;
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for VA health care" />
        <p className="vads-u-margin-top--neg2">
          Enrollment Application for Health Benefits (VA Form 10-10EZ)
        </p>
        {!showLOA3Content && (
          <p className="vads-u-margin-bottom--5">
            <strong className="vads-u-font-size--lg vads-u-line-height--3">
              VA health care covers care for your physical and mental health.
              This includes a range of services from checkups to surgeries to
              home health care. It also includes prescriptions and medical
              equipment. Apply online now.
            </strong>
          </p>
        )}
        {showMainLoader && (
          <va-loading-indicator
            label="Loading"
            message="Loading your application..."
          />
        )}
        {showVerificationRequiredAlert && <VerificationRequiredAlert />}
        {showLoggedOutContent && (
          <LoggedOutContent route={route} showLoginAlert={showLoginAlert} />
        )}
        {showLOA3Content && <HCAEnrollmentStatus route={route} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showMainLoader: isLoading(state),
  showLOA3Content: isUserLOA3(state),
  showLoggedOutContent: shouldShowLoggedOutContent(state),
  showLoginAlert: isLoggedOut(state),
  showVerificationRequiredAlert: isUserLOA1(state),
});

export default connect(mapStateToProps)(IntroductionPage);

export { IntroductionPage };

IntroductionPage.propTypes = {
  route: PropTypes.object,
  showLOA3Content: PropTypes.bool,
  showLoggedOutContent: PropTypes.bool,
  showLoginAlert: PropTypes.bool,
  showMainLoader: PropTypes.bool,
  showVerificationRequiredAlert: PropTypes.bool,
};
