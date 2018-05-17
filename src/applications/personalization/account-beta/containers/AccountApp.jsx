import React from 'react';
import { connect } from 'react-redux';
import '../../../../platform/startup/moment-setup';

import AccountMain from '../components/AccountMain';
import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';
import BetaApp, { features } from '../../beta-enrollment/containers/BetaApp';

class UserProfileApp extends React.Component {
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          user={this.props.user}>
          <BetaApp featureName={features.dashboard} redirect="/beta-enrollment/personalization/">
            <DowntimeNotification appTitle="user profile page" dependencies={[services.mvi, services.emis]}>
              <div className="row user-profile-row">
                <div className="usa-width-two-thirds medium-8 small-12 columns">
                  <h1>Your Vets.gov Account Settings</h1>
                  <div className="va-introtext">
                    <p>Below, you'll find your current settings for signing in to Vets.gov. Find out how to update your settings as needed to access more site tools or add extra security to your account.</p>
                  </div>
                  <AccountMain
                    login={this.props.login}
                    profile={this.props.profile}
                    terms={this.props.terms}/>
                </div>
              </div>
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
    login: userState.login,
    profile: userState.profile,
    terms: userState.profile.mhv.terms,
    user: userState
  };
};

export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
