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
            <AuthApplicationSection
                userProfile={this.props.profile}
                verifyUrl={this.props.verifyUrl}/>
            <AccountManagementSection/>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <RequiredLoginView
            authRequired={1}
            serviceRequired={"user-profile"}
            userProfile={this.props.profile}
            loginUrl={this.props.loginUrl}
            verifyUrl={this.props.verifyUrl}>
          {view}
        </RequiredLoginView>
      </div>
      );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
