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
  fetchInformation
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
          user={this.props.user}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <ProfileView
            user={this.props.user}
            profile={this.props.profile}
            {...this.props.fetchActions}
            updateActions={this.props.updateActions}
            updateFormFieldActions={this.props.updateFormFieldActions}
            message={{
              content: this.props.profile.message,
              clear: this.props.uiActions.clearMessage
            }}
            downtimeData={{
              ...this.props.downtimeData,
              ...this.props.downtimeActions
            }}
            modal={{
              open: this.props.uiActions.openModal,
              currentlyOpen: this.props.profile.modal,
              formFields: this.props.profile.formFields,
              pendingSaves: this.props.profile.pendingSaves,
              errors: this.props.profile.errors,
              clearErrors: this.props.uiActions.clearErrors
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
    downtimeData: {
      appTitle: 'profile',
      isDowntimeWarningDismissed: state.scheduledDowntime.dismissedDowntimeWarnings.includes('profile')
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  const uiActions = { openModal, clearErrors, clearMessage };
  const downtimeActions = { initializeDowntimeWarnings, dismissDowntimeWarning };
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    fetchActions: bindActionCreators(fetchInformation, dispatch),
    updateActions: bindActionCreators(saveField, dispatch),
    updateFormFieldActions: bindActionCreators(updateFormField, dispatch),
    downtimeActions: bindActionCreators(downtimeActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VAProfileApp);
export { VAProfileApp };
