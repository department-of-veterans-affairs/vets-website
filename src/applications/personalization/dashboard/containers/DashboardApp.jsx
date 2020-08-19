import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import backendServices from 'platform/user/profile/constants/backendServices';
import {
  selectProfile,
  selectPatientFacilities,
} from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';
import { focusElement } from 'platform/utilities/ui';

import { removeSavedForm as removeSavedFormAction } from '../actions';
import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import {
  hasServerError as hasESRServerError,
  isEnrolledInVAHealthCare,
} from 'applications/hca/selectors';
import { selectShowProfile2 } from 'applications/personalization/profile-2/selectors';

import { recordDashboardClick } from '../helpers';
import {
  COVID19Alert,
  eligibleHealthSystems,
  showCOVID19AlertSelector,
} from '../covid-19';

import YourApplications from './YourApplications';
import ManageYourVAHealthCare from '../components/ManageYourVAHealthCare';
import ESRError, { ESR_ERROR_TYPES } from '../components/ESRError';
import ClaimsAppealsWidget from './ClaimsAppealsWidget';
import PreferencesWidget from 'applications/personalization/preferences/containers/PreferencesWidget';

import profileManifest from 'applications/personalization/profile360/manifest.json';
import accountManifest from 'applications/personalization/account/manifest.json';
import lettersManifest from 'applications/letters/manifest.json';
import facilityLocator from 'applications/facility-locator/manifest.json';

const scroller = Scroll.animateScroll;
const scrollToTop = () => {
  scroller.scrollTo(0, {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const EmptyStateLinks = () => (
  <div>
    <h2>Explore our most used benefits</h2>
    <ul className="va-nav-linkslist-list">
      <li>
        <a
          href="/disability/"
          onClick={recordDashboardClick('disability-benefits')}
        >
          <h4 className="va-nav-linkslist-title">Disability benefits</h4>
          <p className="va-nav-linkslist-description">
            File for disability compensation and other benefits for conditions
            related to your military service.
          </p>
        </a>
      </li>
      <li>
        <a href="/health-care/" onClick={recordDashboardClick('health-care')}>
          <h4 className="va-nav-linkslist-title">Health care benefits</h4>
          <p className="va-nav-linkslist-description">
            Apply for VA health care, find out how to access services, and
            manage your health and benefits online.
          </p>
        </a>
      </li>
      <li>
        <a
          href="/education/"
          onClick={recordDashboardClick('education-benefits')}
        >
          <h4 className="va-nav-linkslist-title">Education benefits</h4>
          <p className="va-nav-linkslist-description">
            Apply for and manage benefits that help you pay for college and
            training programs.
          </p>
        </a>
      </li>
      <li>
        <a
          href="/careers-employment/"
          onClick={recordDashboardClick('employment')}
        >
          <h4 className="va-nav-linkslist-title">Careers and employment</h4>
          <p className="va-nav-linkslist-description">
            Find out if you're eligible for Veteran Readiness and Employment
            (VR&E) services, get support for your Veteran-owned small business,
            and access other resources to help build your career skills and find
            a job.
          </p>
        </a>
      </li>
    </ul>
  </div>
);

const ManageBenefitsOrRequestRecords = () => (
  <>
    <h2>Manage benefits or request records</h2>
    <ul className="va-nav-linkslist-list">
      <li>
        <a
          href="/education/gi-bill/post-9-11/ch-33-benefit"
          onClick={recordDashboardClick('post-911')}
        >
          <h3 className="vads-u-font-weight--bold vads-u-font-size--h4">
            Check Post-9/11 GI Bill benefits
          </h3>
          <p className="va-nav-linkslist-description">
            View and print your statement of benefits.
          </p>
        </a>
      </li>
      <li>
        <a
          href="/health-care/get-medical-records/"
          onClick={recordDashboardClick('health-records')}
        >
          <h3 className="vads-u-font-weight--bold vads-u-font-size--h4">
            Get your VA health records
          </h3>
          <p className="va-nav-linkslist-description">
            View, download, and print your VA health records.
          </p>
        </a>
      </li>
      <li>
        <a
          href={lettersManifest.rootUrl}
          onClick={recordDashboardClick('download-letters')}
        >
          <h3 className="vads-u-font-weight--bold vads-u-font-size--h4">
            Download your VA letters
          </h3>
          <p className="va-nav-linkslist-description">
            Access and download benefit letters and documents proving your
            status online.
          </p>
        </a>
      </li>
    </ul>
  </>
);

const ViewYourProfile = () => (
  <>
    <h2>View your profile</h2>
    <p>
      Review your contact, personal, and military service information—and find
      out how to make any needed updates or corrections.
      <br />
      <a
        className="usa-button-primary"
        href={profileManifest.rootUrl}
        onClick={recordDashboardClick('view-your-profile', 'view-button')}
      >
        View your profile
      </a>
    </p>
  </>
);

const ManageYourAccount = () => (
  <>
    <h2>Manage your account</h2>
    <p>
      View your current account settings—and find out how to update them as
      needed to access more site tools or add extra security to your account.
      <br />
      <a
        className="usa-button-primary"
        href={accountManifest.rootUrl}
        onClick={recordDashboardClick(
          'view-your-account-settings',
          'view-button',
        )}
      >
        View your account settings
      </a>
    </p>
  </>
);

const ViewYourProfile2 = () => (
  <>
    <h2>View your profile</h2>
    <p>
      Go to your profile to view the information you need to manage your VA
      benefits. You can make updates to your personal, military, and financial
      information, as well as update your account settings to access more online
      tools and services.
      <br />
      <a
        className="usa-button-primary"
        href={profileManifest.rootUrl}
        onClick={recordDashboardClick('view-your-profile', 'view-button')}
      >
        Go to your profile
      </a>
    </p>
  </>
);

class DashboardApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'show-loa-alert': true,
      'show-mvi-alert': true,
    };
  }

  componentDidMount() {
    scrollToTop();
    if (this.props.profile.verified) {
      this.props.getEnrollmentStatus();
    }
    focusElement('#dashboard-title');
  }

  dismissAlertBox = name => () => {
    this.setState({
      [`show-${name}-alert`]: false,
    });
    localStorage.setItem(`hide-${name}-alert`, true);
  };

  renderLOAPrompt() {
    return (
      <AlertBox
        content={
          <div>
            <h3 className="usa-alert-heading">
              Verify your identity to access more VA.gov tools and features
            </h3>
            <p>
              When you verify your identity, you can use VA.gov to do things
              like check the status of your claims and health care application,
              refill your prescriptions, and download your VA benefit letters.
            </p>
            <a
              className="usa-button-primary"
              href="/verify"
              onClick={() => {
                recordEvent({ event: 'verify-link-clicked' });
              }}
            >
              Verify your identity
            </a>
            <p>
              <a
                href="/sign-in-faq#verifying-your-identity"
                onClick={recordDashboardClick('learn-more-identity')}
              >
                Learn about how to verify your identity
              </a>
            </p>
          </div>
        }
        isVisible={
          this.state['show-loa-alert'] &&
          !localStorage.getItem('hide-loa-alert')
        }
        status="info"
      />
    );
  }

  renderMVIWarning() {
    return (
      <AlertBox
        content={
          <div>
            <h4 className="usa-alert-heading">
              We’re having trouble matching your information to our Veteran
              records
            </h4>
            <p>
              We’re sorry. We’re having trouble matching your information to our
              Veteran records, so we can’t give you access to tools for managing
              your health and benefits.
            </p>
            <p>
              If you’d like to use these tools on VA.gov, please contact your
              nearest VA medical center. Let them know you need to verify the
              information in your records, and update it as needed. The
              operator, or a patient advocate, can connect you with the right
              person who can help.
            </p>
            <p>
              <a
                href={facilityLocator.rootUrl}
                onClick={recordDashboardClick('find-center')}
              >
                Find your nearest VA medical center
              </a>
              .
            </p>
          </div>
        }
        onCloseAlert={this.dismissAlertBox('mvi')}
        isVisible={
          this.state['show-mvi-alert'] &&
          !localStorage.getItem('hide-mvi-alert')
        }
        status="warning"
      />
    );
  }

  render() {
    const {
      canAccessClaims,
      canAccessRx,
      canAccessMessaging,
      canAccessAppeals,
      profile,
      showCOVID19Alert,
      showManageYourVAHealthCare,
      showProfile2,
      showServerError,
      vaHealthChatEligibleSystemId,
    } = this.props;
    const availableWidgetsCount = [
      canAccessClaims,
      canAccessRx,
      canAccessMessaging,
      canAccessAppeals,
    ].filter(e => e).length;

    const view = (
      <>
        <h1 id="dashboard-title" tabIndex="-1">
          My VA
        </h1>
        <div className="va-introtext">
          <p>
            Access the tools and information you’ll need to track and manage
            your VA benefits and communications.
          </p>
        </div>

        {showCOVID19Alert && (
          <COVID19Alert facilityId={vaHealthChatEligibleSystemId} />
        )}

        {showServerError && <ESRError errorType={ESR_ERROR_TYPES.generic} />}

        <PreferencesWidget />

        <YourApplications />

        {!profile.verified && this.renderLOAPrompt()}
        {profile.loa.current !== 1 &&
          profile.status !== 'OK' &&
          this.renderMVIWarning()}

        <ClaimsAppealsWidget />

        {availableWidgetsCount === 0 && <EmptyStateLinks />}

        {showManageYourVAHealthCare && <ManageYourVAHealthCare />}
        <ManageBenefitsOrRequestRecords />

        {!showProfile2 && (
          <>
            <ViewYourProfile />
            <ManageYourAccount />
          </>
        )}

        {showProfile2 && <ViewYourProfile2 />}
      </>
    );

    return (
      <div name="topScrollElement">
        <div className="row user-profile-row">
          <div className="usa-width-two-thirds medium-8 small-12 columns">
            {view}
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  const profileState = selectProfile(state);
  const showProfile2 = selectShowProfile2(state);
  const canAccessRx = profileState.services.includes(backendServices.RX);
  const canAccessMessaging = profileState.services.includes(
    backendServices.MESSAGING,
  );
  const canAccessAppeals = profileState.services.includes(
    backendServices.APPEALS_STATUS,
  );
  const canAccessClaims = profileState.services.includes(
    backendServices.EVSS_CLAIMS,
  );
  const showServerError = hasESRServerError(state);
  // Just the patient's facilities that are eligible for VA Health Chat:
  const eligibleFacilities =
    selectPatientFacilities(state)?.filter(facility =>
      eligibleHealthSystems.has(facility.facilityId),
    ) || [];
  // The system ID of the first eligible facility
  const vaHealthChatEligibleSystemId = eligibleFacilities.length
    ? eligibleFacilities[0].facilityId
    : null;

  const showCOVID19Alert =
    !!showCOVID19AlertSelector(state) && !!vaHealthChatEligibleSystemId;

  return {
    canAccessRx,
    canAccessMessaging,
    canAccessAppeals,
    canAccessClaims,
    profile: profileState,
    showProfile2,
    showManageYourVAHealthCare:
      isEnrolledInVAHealthCare(state) || canAccessRx || canAccessMessaging,
    showServerError,
    showCOVID19Alert,
    vaHealthChatEligibleSystemId,
  };
};

const mapDispatchToProps = {
  removeSavedForm: removeSavedFormAction,
  getEnrollmentStatus: getEnrollmentStatusAction,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DashboardApp),
);
export { DashboardApp };
