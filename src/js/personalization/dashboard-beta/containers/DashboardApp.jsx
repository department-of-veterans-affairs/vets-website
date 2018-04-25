import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { removeSavedForm } from '../actions';

import FormList from '../components/FormList';
import MessagingWidget from './MessagingWidget';
import ClaimsAppealsWidget from './ClaimsAppealsWidget';
import PrescriptionsWidget from './PrescriptionsWidget';

import BetaApp, { features } from '../../beta-enrollment/containers/BetaApp';
import RequiredLoginView from '../../../common/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';

import profileManifest from '../../va-profile-beta/manifest.json';
import accountManifest from '../../account-beta/manifest.json';

moment.updateLocale('en', {
  meridiem: (hour) => {
    if (hour < 12) {
      return 'a.m.';
    }
    return 'p.m.';
  },
  monthsShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ]
});

class DashboardApp extends React.Component {
  render() {
    const view = (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Your Homepage</h1>
          <div className="va-introtext">
            <p>Access the tools and information you’ll need to track and manage your VA benefits and communications.</p>
          </div>
          <div>
            <FormList
              userProfile={this.props.profile}
              removeSavedForm={this.props.removeSavedForm}
              savedForms={this.props.profile.savedForms}/>
            <ClaimsAppealsWidget/>
            <MessagingWidget/>
            <PrescriptionsWidget/>
          </div>
          <div>
            <h2>Manage Your Health and Benefits</h2>

            <ul className="va-nav-linkslist-list">
              <li>
                <a href="/health-care/schedule-an-appointment/">
                  <h4 className="va-nav-linkslist-title">Schedule a VA Appointment</h4>
                  <p className="va-nav-linkslist-description">Find out how to make a doctor's appointment with a member of your VA health care team online or by phone.</p>
                </a>
              </li>
              <li>
                <a href="/education/gi-bill/post-9-11/ch-33-benefit">
                  <h4 className="va-nav-linkslist-title">Check Post-9/11 GI Bill Benefits</h4>
                  <p className="va-nav-linkslist-description">View and print your statement of benefits.</p>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Request your Records</h2>

            <ul className="va-nav-linkslist-list">
              <li>
                <a href="/discharge-upgrade-instructions/">
                  <h4 className="va-nav-linkslist-title">How to Apply for a Discharge Upgrade</h4>
                  <p className="va-nav-linkslist-description">Answer a series of questions to get customized step-by-step instructions on how to apply for a discharge upgrade or correction.</p>
                </a>
              </li>
              <li>
                <a href="/health-care/health-records/">
                  <h4 className="va-nav-linkslist-title">Get Your VA Health Records</h4>
                  <p className="va-nav-linkslist-description">View, download, and print your VA health records.</p>
                </a>
              </li>
              <li>
                <a href="/download-va-letters/">
                  <h4 className="va-nav-linkslist-title">Download Your VA Letters</h4>
                  <p className="va-nav-linkslist-description">Access and download benefit letters and documents proving your status online.</p>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>View Your Profile</h2>
            <p>Review your contact, personal, and military service information—and find out how to make any needed updates or corrections.<br/>
              <a className="usa-button-primary" href={profileManifest.rootUrl}>View Your Profile</a>
            </p>

            <h2>Manage Your Account</h2>
            <p>View your current account settings—and find out how to update them as needed to access more site tools or add extra security to your account.<br/>
              <a className="usa-button-primary" href={accountManifest.rootUrl}>View Your Account Settings</a>
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <RequiredLoginView
          authRequired={3}
          serviceRequired={['evss-claims', 'appeals-status', 'user-profile']}
          user={this.props.user}>
          <BetaApp featureName={features.dashboard} redirect="/beta-enrollment/personalization/">
            <DowntimeNotification appTitle="user dashboard" dependencies={[services.mvi, services.emis]}>
              {view}
            </DowntimeNotification>
          </BetaApp>
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    profile: userState.profile,
    user: userState
  };
};

const mapDispatchToProps = {
  removeSavedForm
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardApp);
export { DashboardApp };
