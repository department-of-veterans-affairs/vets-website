import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../../platform/user/profile/constants/backendServices';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning
} from '../../../../platform/monitoring/DowntimeNotification/actions';

import {
  fetchTransactions,
  initializeUserToVet360,
  refreshTransaction,
} from '../vet360/actions';

import {
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation
} from '../actions';

import {
  selectIsVet360AvailableForUser,
  selectVet360Transaction
} from '../vet360/selectors';

import { INITIALIZATION_TRANSACTION } from '../vet360/constants';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import ProfileView from '../components/ProfileView';

class VAProfileApp extends React.Component {
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.user}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <ProfileView
            isVet360AvailableForUser={this.props.isVet360AvailableForUser}
            vet360InitializationTransaction={this.props.vet360InitializationTransaction}
            profile={this.props.profile}
            user={this.props.user}
            fetchHero={this.props.fetchHero}
            fetchMilitaryInformation={this.props.fetchMilitaryInformation}
            fetchPersonalInformation={this.props.fetchPersonalInformation}
            fetchTransactions={this.props.fetchTransactions}
            initializeUserToVet360={this.props.initializeUserToVet360}
            refreshTransaction={this.props.refreshTransaction}
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
    user: state.user,
    profile: state.vaProfile,
    isDowntimeWarningDismissed: state.scheduledDowntime.dismissedDowntimeWarnings.includes('profile'),
    isVet360AvailableForUser: selectIsVet360AvailableForUser(state),
    vet360InitializationTransaction: selectVet360Transaction(state, INITIALIZATION_TRANSACTION),
  };
};

const mapDispatchToProps = {
  fetchTransactions,
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
  initializeUserToVet360,
  refreshTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(VAProfileApp);
export { VAProfileApp };
