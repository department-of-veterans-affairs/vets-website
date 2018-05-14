import React from 'react';
import { connect } from 'react-redux';
import '../../../../platform/startup/moment-setup';
import { selectUser, isLOA3 } from '../../../../platform/user/selectors';

import { fetchLatestTerms, acceptTerms } from '../actions';

import AccountMain from '../components/AccountMain';
import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';

import LegacyProfile from '../../../user-profile/containers/UserProfileApp';
import isPersonalizationEnabled from '../../dashboard/isPersonalizationEnabled';

class AccountApp extends React.Component {
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          user={this.props.user}>
          {isPersonalizationEnabled() && this.props.isLOA3 ? (
            <DowntimeNotification appTitle="user account page" dependencies={[services.mvi, services.emis]}>
              <div className="row user-profile-row">
                <div className="usa-width-two-thirds medium-8 small-12 columns">
                  <h1>Your Vets.gov Account Settings</h1>
                  <div className="va-introtext">
                    <p>Below, you'll find your current settings for signing in to Vets.gov. Find out how to update your settings as needed to access more site tools or add extra security to your account.</p>
                  </div>
                  <AccountMain
                    login={this.props.login}
                    profile={this.props.profile}
                    terms={this.props.terms}
                    fetchLatestTerms={this.props.fetchLatestTerms}
                    acceptTerms={this.props.acceptTerms}/>
                </div>
              </div>
            </DowntimeNotification>
          ) : <LegacyProfile/>}
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = selectUser(state);
  return {
    isLOA3: isLOA3(state),
    login: userState.login,
    profile: userState.profile,
    terms: userState.profile.mhv.terms,
    user: userState
  };
};

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountApp);
export { AccountApp };
