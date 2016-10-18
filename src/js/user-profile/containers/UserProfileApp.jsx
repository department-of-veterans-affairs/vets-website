import React from 'react';
import { connect } from 'react-redux';

import UserDataSection from '../components/UserDataSection';
import LoginDataSection from '../components/LoginDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';
import AccountManagementSection from '../components/AccountManagementSection';

import LoginAccess from '../../common/components/LoginAccess';

class UserProfileApp extends React.Component {
  render() {
    let components;
    let account;
    let view;

    if (this.props.profile.accountType === 'loa3') {
      components = (
        <div>
          <UserDataSection/>
          <LoginDataSection/>
          <AuthApplicationSection/>
          <AccountManagementSection/>
        </div>
      );
      account = <p>ACCOUNT TYPE: Verified</p>;
    } else {
      components = (
        <div>
          <LoginDataSection/>
          <AccountManagementSection/>
        </div>
      );
      account = <p>ACCOUNT TYPE: Basic (<a href="#">Want to Upgrade your account?</a>)</p>;
    }

    if (localStorage.length > 0) {
      view = (
        <div className="row">
          <div className="medium-8 small-12 columns">
            <h1>Your Vets.gov Account</h1>
            {account}
            {components}
          </div>
        </div>
      );
    } else {
      view = (<LoginAccess loginUrl={this.props.login.loginUrl}/>);
    }
    return view;
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
