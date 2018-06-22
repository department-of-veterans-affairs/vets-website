import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../../platform/user/profile/constants/backendServices';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning
} from '../../../../platform/monitoring/DowntimeNotification/actions';

import {
  fetchTransactions,
  fetchAddressConstants,
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation
} from '../actions';

import { selectIsVet360AvailableForUser } from '../selectors';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import ProfileView from '../components/ProfileView';

class VAProfileApp extends React.Component {
  componentDidMount() {
    this.props.fetchTransactions();
  }
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.account}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <ProfileView
            isVet360AvailableForUser={this.props.isVet360AvailableForUser}
            profile={this.props.profile}
            user={this.props.account}
            fetchAddressConstants={this.props.fetchAddressConstants}
            fetchHero={this.props.fetchHero}
            fetchMilitaryInformation={this.props.fetchMilitaryInformation}
            fetchPersonalInformation={this.props.fetchPersonalInformation}
            downtimeData={{
              appTitle: 'profile',
              isDowntimeWarningDismissed: this.props.isDowntimeWarningDismissed,
              initializeDowntimeWarnings: this.props.initializeDowntimeWarnings,
              dismissDowntimeWarning: this.props.dismissDowntimeWarning
            }}/>
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.user,
    profile: state.vaProfile,
    isDowntimeWarningDismissed: state.scheduledDowntime.dismissedDowntimeWarnings.includes('profile'),
    isVet360AvailableForUser: selectIsVet360AvailableForUser(state)
  };
};

const mapDispatchToProps = {
  fetchTransactions,
  fetchAddressConstants,
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation,
  initializeDowntimeWarnings,
  dismissDowntimeWarning
};

export default connect(mapStateToProps, mapDispatchToProps)(VAProfileApp);
export { VAProfileApp };
