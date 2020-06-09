import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import HealthcareModalContent from 'platform/forms/components/OMBInfoModalContent/HealthcareModalContent';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import recordEvent from 'platform/monitoring/record-event';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import environment from 'platform/utilities/environment';

import HCAEnrollmentStatus from './HCAEnrollmentStatus';
import HCASubwayMap from '../components/HCASubwayMap';
import {
  isLoading,
  isLoggedOut,
  isUserLOA1,
  isUserLOA3,
  shouldShowLoggedOutContent,
} from '../selectors';

const VerificationRequiredAlert = () => (
  <AlertBox
    content={
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
            <a href="/sign-in-faq/#verifying-your-identity">
              Read our identity verification FAQs
            </a>
          </li>
          <li>
            Or call us at <Telephone contact={CONTACTS['222_VETS']} />. If you
            have hearing loss, call TTY:{' '}
            <Telephone contact={CONTACTS.HELP_TTY} />. We’re here Monday through
            Friday, 8:00 a.m. to 8:00 p.m. <abbr title="eastern time">ET</abbr>.
          </li>
        </ul>
        <p>
          <a
            className="usa-button-primary va-button-primary"
            href="/verify"
            onClick={() => {
              recordEvent({ event: 'verify-link-clicked' });
            }}
          >
            Verify your identity
          </a>
        </p>
      </div>
    }
    isVisible
    status="continue"
  />
);

const LoggedOutContent = connect(
  null,
  { toggleLoginModal },
)(({ route, showLoginAlert, toggleLoginModal: showLoginModal }) => (
  <>
    {showLoginAlert && (
      <div>
        <AlertBox
          headline="Have you applied for VA health care before?"
          content={
            <button
              className="va-button-link"
              onClick={() => showLoginModal(true, 'hcainfo')}
            >
              Sign in to check your application status.
            </button>
          }
          isVisible
          status="info"
          backgroundOnly
        />
        <br />
      </div>
    )}
    <SaveInProgressIntro
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      downtime={route.formConfig.downtime}
      pageList={route.pageList}
      startText="Start the Health Care Application"
    />
    <HCASubwayMap />
    <SaveInProgressIntro
      buttonOnly
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      startText="Start the Health Care Application"
      downtime={route.formConfig.downtime}
    />
    <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
      {environment.isProduction() ? (
        <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="12/31/2020" />
      ) : (
        <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="12/31/2020">
          <HealthcareModalContent resBurden={30} ombNumber="2900-0091" />
        </OMBInfo>
      )}
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
        <FormTitle title="Apply for health care benefits" />
        <p>Equal to VA Form 10-10EZ (Application for Health Benefits).</p>
        {showMainLoader && <LoadingIndicator />}
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
