import React from 'react';
import { connect } from 'react-redux';

import UserDataSection from '../components/UserDataSection';
import LoginDataSection from '../components/LoginDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';
import AccountManagementSection from '../components/AccountManagementSection';

import RequiredLoginView from '../../common/components/RequiredLoginView';

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

    view = (
      <div className="row">
        <div className="medium-8 small-12 columns">
          <h1>Your Vets.gov Account</h1>
          {account}
          {components}
        </div>
      </div>
    );

    return (
      <div>
        <RequiredLoginView authRequired={1} component={view}/>
      </div>
      );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
