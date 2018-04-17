import React from 'react';
import { connect } from 'react-redux';
import '../../../../platform/startup/moment-setup';

import { fetchLatestTerms, acceptTerms } from '../actions';

import AccountMain from '../components/AccountMain';
import RequiredLoginView from '../../../common/components/RequiredLoginView';
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
                  <h1>Your Account</h1>
                  <AccountMain
                    login={this.props.login}
                    profile={this.props.profile}
                    terms={this.props.terms}
                    fetchLatestTerms={this.props.fetchLatestTerms}
                    acceptTerms={this.props.acceptTerms}/>
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
    terms: userState.profile.terms,
    user: userState
  };
};

const mapDispatchToProps = {
  fetchLatestTerms,
  acceptTerms
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
