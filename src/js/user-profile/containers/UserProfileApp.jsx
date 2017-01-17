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
        <div className="medium-8 small-12 columns">
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
        <RequiredLoginView authRequired={1} serviceRequired={"user-profile"}>
          {view}
        </RequiredLoginView>
      </div>
      );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  const userState = state.user;
  return userState;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
