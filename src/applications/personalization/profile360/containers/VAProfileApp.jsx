import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  initializeDowntimeWarnings,
  dismissDowntimeWarning
} from '../../../../platform/monitoring/DowntimeNotification/actions';

import {
  saveField,
  updateFormField,
  openModal,
  clearErrors,
  clearMessage,
  fetchAddressConstants,
  fetchHero,
  fetchMilitaryInformation,
  fetchPersonalInformation
} from '../actions';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import ProfileView from '../components/ProfileView';

class VAProfileApp extends React.Component {
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          user={this.props.account}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <ProfileView
            user={this.props.account}
            fetchAddressConstants={this.props.fetchAddressConstants}
            fetchHero={this.props.fetchHero}
            fetchMilitaryInformation={this.props.fetchMilitaryInformation}
            fetchPersonalInformation={this.props.fetchPersonalInformation}
            profile={this.props.profile}
            message={{
              content: this.props.profile.message,
              clear: this.props.clearMessage
            }}
            updateActions={this.props.updateActions}
            updateFormFieldActions={this.props.updateFormFieldActions}
            downtimeData={{
              ...this.props.downtimeData,
              ...this.props.downtimeActions
            }}
            modal={{
              open: this.props.openModal,
              currentlyOpen: this.props.profile.modal,
              formFields: this.props.profile.formFields,
              pendingSaves: this.props.profile.pendingSaves,
              errors: this.props.profile.errors,
              clearErrors: this.props.clearErrors
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
    downtimeData: {
      appTitle: 'profile',
      isDowntimeWarningDismissed: state.scheduledDowntime.dismissedDowntimeWarnings.includes('profile')
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators({
    fetchAddressConstants,
    fetchHero,
    fetchMilitaryInformation,
    fetchPersonalInformation,
    openModal,
    clearErrors,
    clearMessage
  }, dispatch);

  actions.updateActions = bindActionCreators(saveField, dispatch);
  actions.updateFormFieldActions = bindActionCreators(updateFormField, dispatch);
  actions.downtimeActions = bindActionCreators({
    initializeDowntimeWarnings,
    dismissDowntimeWarning
  }, dispatch);
  return actions;
};

export default connect(mapStateToProps, mapDispatchToProps)(VAProfileApp);
export { VAProfileApp };
