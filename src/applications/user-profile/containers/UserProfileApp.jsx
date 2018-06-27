import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import RequiredLoginView from '../../../platform/user/authorization/components/RequiredLoginView';
import { fetchMHVAccount, removeSavedForm } from '../../../platform/user/profile/actions';
import backendServices from '../../../platform/user/profile/constants/backendServices';
import DowntimeNotification, { externalServices } from '../../../platform/monitoring/DowntimeNotification';

import AuthApplicationSection from '../components/AuthApplicationSection';
import FormList from '../components/FormList';
import UserDataSection from './UserDataSection';

moment.updateLocale('en', {
  meridiem: (hour) => {
    if (hour < 12) {
      return 'a.m.';
    }
    return 'p.m.';
  },
  monthsShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ]
});

class UserProfileApp extends React.Component {
  componentDidMount() {
    // Get MHV account to determine what to render for Terms and Conditions.
    this.props.fetchMHVAccount();
  }

  render() {
    const { profile } = this.props.user;

    const view = profile.loading || profile.mhvAccount.loading ?
      <LoadingIndicator message="Loading your account information..."/> :
      (<div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Your Account</h1>
          <div>
            <FormList
              userProfile={profile}
              removeSavedForm={this.props.removeSavedForm}
              savedForms={profile.savedForms}/>
            <AuthApplicationSection userProfile={profile}/>
            <UserDataSection/>
          </div>
        </div>
      </div>);

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
  fetchMHVAccount,
  removeSavedForm
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
