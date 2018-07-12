import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../platform/user/profile/constants/backendServices';
import { removeSavedForm } from '../../../platform/user/profile/actions';
import UserDataSection from './UserDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';
import FormList from '../components/FormList';
import RequiredLoginView from '../../../platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, { externalServices } from '../../../platform/monitoring/DowntimeNotification';

class UserProfileApp extends React.Component {
  render() {
    const view = (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Your Account</h1>
          <div>
            <FormList
              userProfile={this.props.user.profile}
              removeSavedForm={this.props.removeSavedForm}
              savedForms={this.props.user.profile.savedForms}/>
            <AuthApplicationSection
              userProfile={this.props.user.profile}
              verifyUrl={this.props.verifyUrl}/>
            <UserDataSection/>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <RequiredLoginView
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.user}>
          <DowntimeNotification appTitle="user profile page" dependencies={[externalServices.mvi, externalServices.emis]}>
            {view}
          </DowntimeNotification>
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

const mapDispatchToProps = {
  removeSavedForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
