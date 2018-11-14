import React from 'react';
import { connect } from 'react-redux';

import backendServices from '../../../../platform/user/profile/constants/backendServices';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
} from '../../../../platform/monitoring/DowntimeNotification/actions';

import {
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation,
} from '../actions';

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
          verifyUrl={this.props.verifyUrl}
        >
          <ProfileView
            profile={this.props.profile}
            user={this.props.user}
            fetchHero={this.props.fetchHero}
            fetchMilitaryInformation={this.props.fetchMilitaryInformation}
            fetchPersonalInformation={this.props.fetchPersonalInformation}
            downtimeData={{
              appTitle: 'profile',
              isDowntimeWarningDismissed: this.props.isDowntimeWarningDismissed,
              initializeDowntimeWarnings: this.props.initializeDowntimeWarnings,
              dismissDowntimeWarning: this.props.dismissDowntimeWarning,
            }}
          />
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  profile: state.vaProfile,
  isDowntimeWarningDismissed: state.scheduledDowntime.dismissedDowntimeWarnings.includes(
    'profile',
  ),
});

const mapDispatchToProps = {
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation,
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAProfileApp);
export { VAProfileApp };
