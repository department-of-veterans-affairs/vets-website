import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router';

import backendServices from 'platform/user/profile/constants/backendServices';
import { selectProfile } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';

import { removeSavedForm } from '../actions';

import FormList from '../components/FormList';
import MessagingWidget from './MessagingWidget';
import ClaimsAppealsWidget from './ClaimsAppealsWidget';
import PrescriptionsWidget from './PrescriptionsWidget';
import PreferencesWidget from 'applications/personalization/preferences/containers/PreferencesWidget';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import profileManifest from 'applications/personalization/profile360/manifest.json';
import accountManifest from 'applications/personalization/account/manifest.json';
import lettersManifest from 'applications/letters/manifest.js';
import facilityLocator from 'applications/facility-locator/manifest';

const scroller = Scroll.animateScroll;
const scrollToTop = () => {
  scroller.scrollTo(0, {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const renderWidgetDowntimeNotification = (appName, sectionTitle) => (
  downtime,
  children,
) => {
  switch (downtime.status) {
    case 'down':
      return (
        <div>
          <h2>{sectionTitle}</h2>
          <AlertBox
            content={
              <div>
                <h4 className="usa-alert-heading">
                  {appName} is down for maintenance
                </h4>
                <p>
                  We’re making some updates to our {appName.toLowerCase()} tool.
                  We’re sorry it’s not working right now and hope to be finished
                  by {downtime.startTime.format('MMMM Do')},{' '}
                  {downtime.endTime.format('LT')}. Please check back soon.
                </p>
              </div>
            }
            isVisible
            status="warning"
          />
        </div>
      );
    default:
      return children;
  }
};

function recordDashboardClick(product, actionType = 'view-link') {
  return () => {
    recordEvent({
      event: 'dashboard-navigation',
      'dashboard-action': actionType,
      'dashboard-product': product,
    });
  };
}

const EmptyStateLinks = () => (
  <div>
    <h2>Explore Our Most Used Benefits</h2>
    <ul className="va-nav-linkslist-list">
      <li>
        <a
          href="/disability/"
          onClick={recordDashboardClick('disability-benefits')}
        >
          <h4 className="va-nav-linkslist-title">Disability Benefits</h4>
          <p className="va-nav-linkslist-description">
            Apply for disability compensation and other benefits for conditions
            related to your military service.
          </p>
        </a>
      </li>
      <li>
        <a href="/health-care/" onClick={recordDashboardClick('health-care')}>
          <h4 className="va-nav-linkslist-title">Health Care Benefits</h4>
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
          <h4 className="va-nav-linkslist-title">Education Benefits</h4>
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
          <h4 className="va-nav-linkslist-title">Careers and Employment</h4>
          <p className="va-nav-linkslist-description">
            Find out if you're eligible for Vocational Rehabilitation and
            Employment (VR&E) services, get support for your Veteran-owned small
            business, and access other resources to help build your career
            skills and find a job.
          </p>
        </a>
      </li>
    </ul>
  </div>
);

const ScheduleAnAppointmentWidget = () => (
  <div id="rx-widget">
    <h3>Schedule an appointment</h3>
    <p>
      Find out how to make a doctor’s appointment with a member of your VA
      health care team online or by phone.
    </p>
    <p>
      <a
        href="/health-care/schedule-view-va-appointments/"
        onClick={recordDashboardClick('schedule-appointment')}
      >
        Schedule an appointment
      </a>
    </p>
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
          <h4 className="va-nav-linkslist-title">
            Check Post-9/11 GI Bill Benefits
          </h4>
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
          <h4 className="va-nav-linkslist-title">Get Your VA Health Records</h4>
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
          <h4 className="va-nav-linkslist-title">Download Your VA Letters</h4>
          <p className="va-nav-linkslist-description">
            Access and download benefit letters and documents proving your
            status online.
          </p>
        </a>
      </li>
    </ul>
  </>
);

const ManageYourVAHealthCare = () => (
  <>
    <h2>Manage your VA health care</h2>
    <DowntimeNotification
      appTitle="messaging"
      dependencies={[externalServices.mvi, externalServices.mhv]}
      render={renderWidgetDowntimeNotification(
        'Secure messaging',
        'Track Secure Messages',
      )}
    >
      <MessagingWidget />
    </DowntimeNotification>

    <DowntimeNotification
      appTitle="rx"
      dependencies={[externalServices.mvi, externalServices.mhv]}
      render={renderWidgetDowntimeNotification(
        'prescription refill',
        'Refill Prescriptions',
      )}
    >
      <PrescriptionsWidget />
    </DowntimeNotification>
    <ScheduleAnAppointmentWidget />
  </>
);

const ViewYourProfile = () => (
  <>
    <h2>View Your Profile</h2>
    <p>
      Review your contact, personal, and military service information—and find
      out how to make any needed updates or corrections.
      <br />
      <a
        className="usa-button-primary"
        href={profileManifest.rootUrl}
        onClick={recordDashboardClick('view-your-profile', 'view-button')}
      >
        View Your Profile
      </a>
    </p>
  </>
);

const ManageYourAccount = () => (
  <>
    <h2>Manage Your Account</h2>
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
        View Your Account Settings
      </a>
    </p>
  </>
);

class DashboardAppNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'show-loa-alert': true,
      'show-mvi-alert': true,
    };
  }

  componentDidMount() {
    scrollToTop();
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
            <h4 className="usa-alert-heading">
              Verify your identity to access more VA.gov tools and features
            </h4>
            <p>
              When you verify your identity, you can use VA.gov to do things
              like track your claims, refill your prescriptions, and download
              your VA benefit letters.
            </p>
            <a
              className="usa-button-primary"
              href="/verify"
              onClick={() => {
                recordEvent({ event: 'verify-link-clicked' });
              }}
            >
              Verify Your Identity
            </a>
            <p>
              <a
                href="/faq#verifying-your-identity"
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
                onClick={() => {
                  recordEvent({
                    event: 'dashboard-navigation',
                    'dashboard-action': 'view-link',
                    'dashboard-product': 'find-center',
                  });
                }}
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
      removeSavedForm,
    } = this.props;
    const availableWidgetsCount = [
      canAccessClaims,
      canAccessRx,
      canAccessMessaging,
      canAccessAppeals,
    ].filter(e => e).length;

    const view = (
      <div>
        <h1 id="dashboard-title">My VA</h1>
        <div className="va-introtext">
          <p>
            Access the tools and information you’ll need to track and manage
            your VA benefits and communications.
          </p>
        </div>

        <PreferencesWidget />

        <FormList
          userProfile={profile}
          removeSavedForm={removeSavedForm}
          savedForms={profile.savedForms}
        />

        {!profile.verified && this.renderLOAPrompt()}
        {profile.loa.current !== 1 &&
          profile.status !== 'OK' &&
          this.renderMVIWarning()}

        <ClaimsAppealsWidget />

        {availableWidgetsCount === 0 && <EmptyStateLinks />}

        <ManageYourVAHealthCare />
        <ManageBenefitsOrRequestRecords />
        <ViewYourProfile />
        <ManageYourAccount />
      </div>
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

const mapStateToProps = state => {
  const profileState = selectProfile(state);
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

  return {
    canAccessRx,
    canAccessMessaging,
    canAccessAppeals,
    canAccessClaims,
    profile: profileState,
  };
};

const mapDispatchToProps = {
  removeSavedForm,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DashboardAppNew),
);
export { DashboardAppNew };
