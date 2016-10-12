import React from 'react';
import { connect } from 'react-redux';

import UserDataSection from '../components/UserDataSection';
import LoginDataSection from '../components/LoginDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';
import AccountManagementSection from '../components/AccountManagementSection';

class UserProfileApp extends React.Component {
  render() {
    let content;
    if (this.props.profile.accountType === 'loa3') {
      content = (
        <div>
          <UserDataSection/>
          <LoginDataSection/>
          <AuthApplicationSection/>
          <AccountManagementSection/>
        </div>
      );
    } else {
      content = (
        <div>
          <UserDataSection/>
          <AccountManagementSection/>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="medium-8 small-12">
          <h1>Your Vets.gov Account</h1>
          <p>ACCOUNT TYPE: Blue Member (<a href="#">Want to Upgrade your account?</a>)</p>
          {content}
        </div>
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
