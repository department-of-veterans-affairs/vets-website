import React from 'react';
import { connect } from 'react-redux';

import backendServices from 'platform/user/profile/constants/backendServices';
import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning,
} from 'platform/monitoring/DowntimeNotification/actions';

import {
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation,
} from '../actions';

import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import ProfileView from '../components/ProfileView';

function VAProfileApp(props) {
  return (
    <div>
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={props.user}
      >
        <ProfileView
          profile={props.profile}
          user={props.user}
          fetchHero={props.fetchHero}
          fetchMilitaryInformation={props.fetchMilitaryInformation}
          fetchPersonalInformation={props.fetchPersonalInformation}
          downtimeData={{
            appTitle: 'profile',
            isDowntimeWarningDismissed: props.isDowntimeWarningDismissed,
            initializeDowntimeWarnings: props.initializeDowntimeWarnings,
            dismissDowntimeWarning: props.dismissDowntimeWarning,
          }}
        />
      </RequiredLoginView>
    </div>
  );
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
