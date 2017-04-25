import React from 'react';
import { connect } from 'react-redux';

import UserDataSection from '../components/UserDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';
import AccountManagementSection from '../components/AccountManagementSection';

import RequiredLoginView from '../../common/components/RequiredLoginView';

class UserProfileApp extends React.Component {
  render() {
    let view;

    view = (
      <div className="row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Your Vets.gov Account</h1>
          <div>
            <UserDataSection/>
            <AuthApplicationSection/>
            <AccountManagementSection/>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <RequiredLoginView authRequired={1} serviceRequired={"user-profile"} userProfile={this.props.profile} loginUrl={this.props.signInUrl}>
          {view}
        </RequiredLoginView>
      </div>
      );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    profile: userState.profile,
    signInUrl: userState.login.loginUrl.first
  };
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
