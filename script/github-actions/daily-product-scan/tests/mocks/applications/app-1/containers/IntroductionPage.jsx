/* eslint-disable react/prop-types */
/* eslint-disable import/order */
/* eslint-disable deprecate/import */
import React from 'react';
import { connect } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import recordEvent from 'platform/monitoring/record-event';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import HCAEnrollmentStatus from './HCAEnrollmentStatus';
import HCASubwayMap from '../components/HCASubwayMap';
import HcaOMBInfo from '../components/HcaOMBInfo';
import {
  isLoading,
  isLoggedOut,
  isUserLOA1,
  isUserLOA3,
  shouldShowLoggedOutContent,
} from '../selectors';
import { AUTH_EVENTS } from 'platform/user/authentication/constants';

const VerificationRequiredAlert = () => (
  <va-alert isVisible status="continue">
    <div>
      <h4 className="usa-alert-heading">
        Please verify your identity before applying for VA health care
      </h4>
      <p>This process should take about 5 to 10 minutes.</p>
      <p>
        <strong>If you’re applying for the first time</strong>
      </p>
      <p>
        We need to verify your identity so we can help you track the status of
        your application once you’ve submitted it. As soon as you’re finished
        verifying your identity, you can continue to the application.
      </p>
      <p>
        <strong>If you’ve applied before</strong>
      </p>
      <p>
        We need to verify your identity so we can show you the status of your
        past application. We take your privacy seriously, and we need to make
        sure we’re sharing your personal information only with you.
      </p>
      <p>
        <strong>
          If you need more information or help with verifying your identity:
        </strong>
      </p>
      <ul>
        <li>
          <a href="/resources/verifying-your-identity-on-vagov/">
            Read our identity verification FAQs
          </a>
        </li>
        <li>
          Or call us at <va-telephone contact={CONTACTS['222_VETS']} />. If you
          have hearing loss, call{' '}
          <va-telephone contact={CONTACTS.HELP_TTY} tty />. We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </li>
      </ul>
      <p>
        <a
          className="usa-button-primary va-button-primary"
          href="/verify"
          onClick={() => {
            recordEvent({ event: AUTH_EVENTS.VERIFY });
          }}
        >
          Verify your identity
        </a>
      </p>
    </div>
  </va-alert>
);

const LoggedOutContent = connect(
  null,
  { toggleLoginModal },
)(({ route, showLoginAlert, toggleLoginModal: showLoginModal }) => (
  <>
    {showLoginAlert ? (
      <va-alert background-only status="info">
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
      <div className="usa-alert usa-alert-info schemaform-sip-alert vads-u-margin-bottom--5">
        <div className="usa-alert-body">
          <h2 className="usa-alert-heading">
            Save time and save your work in progress
          </h2>
          <div className="usa-alert-text">
            <p>Here’s how signing in now helps you:</p>
            <ul>
              <li>
                We can fill in some of your information for you to save you
                time.
              </li>
              <li>
                You can save your work in progress. You’ll have 60 days from
                when you start or make updates to your application to come back
                and finish it.
              </li>
            </ul>
            <p>
              <strong>Note:</strong> You can sign in after you start your
              application. But you’ll lose any information you already filled
              in.
            </p>
            <SaveInProgressIntro
              buttonOnly
              prefillEnabled={route.formConfig.prefillEnabled}
              messages={route.formConfig.savedFormMessages}
              pageList={route.pageList}
              startText="Start the health care application"
              downtime={route.formConfig.downtime}
            />
          </div>
        </div>
      </div>
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
    <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
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
        {showMainLoader && <va-loading-indicator set-focus />}
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
