import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DowntimeNotification, { services, serviceStatus } from '../../../../platform/monitoring/DowntimeNotification';
import DowntimeApproaching from '../../../../platform/monitoring/DowntimeNotification/components/DowntimeApproaching';

import {
  fetchAddressConstants,
  fetchContactInformation,
  fetchMilitaryInformation,
  fetchHero,
  fetchPersonalInformation,
  saveField,
  updateFormField,
  openModal,
  clearErrors,
  clearMessage
} from '../actions';

import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import ProfileView from '../components/ProfileView';

class VAProfileApp extends React.Component {
  renderDowntime = (downtime, children) => {
    if (downtime.status === serviceStatus.downtimeApproaching) {
      return (
        <DowntimeApproaching appTitle="profile" startTime={downtime.startTime} endTime={downtime.endTime}>
          {children}
        </DowntimeApproaching>
      );
    }
    return children;
  }
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          user={this.props.account}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <DowntimeNotification appTitle="profile" dependencies={[ services.evss, services.mvi, services.emis ]}>
            <ProfileView
              fetchAddressConstants={this.props.fetchAddressConstants}
              fetchContactInformation={this.props.fetchContactInformation}
              fetchMilitaryInformation={this.props.fetchMilitaryInformation}
              fetchHero={this.props.fetchHero}
              fetchPersonalInformation={this.props.fetchPersonalInformation}
              profile={this.props.profile}
              message={{
                content: this.props.profile.message,
                clear: this.props.clearMessage
              }}
              updateActions={this.props.updateActions}
              updateFormFieldActions={this.props.updateFormFieldActions}
              modal={{
                open: this.props.openModal,
                currentlyOpen: this.props.profile.modal,
                formFields: this.props.profile.formFields,
                pendingSaves: this.props.profile.pendingSaves,
                errors: this.props.profile.errors,
                clearErrors: this.props.clearErrors
              }}/>
            </DowntimeNotification>
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let downtime = null;
  const scheduledDowntimeReady = state.scheduledDowntime.isReady;
  if (scheduledDowntimeReady) {
    downtime = {
      evss: state.scheduledDowntime.serviceMap.get(services.evss),
      mvi: state.scheduledDowntime.serviceMap.get(services.mvi),
      emis: state.scheduledDowntime.serviceMap.get(services.emis)
    };
  }

  return {
    account: state.user,
    profile: state.vaProfile,
    scheduledDowntimeReady,
    downtime
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators({
    fetchAddressConstants,
    fetchContactInformation,
    fetchMilitaryInformation,
    fetchHero,
    fetchPersonalInformation,
    openModal,
    clearErrors,
    clearMessage
  }, dispatch);

  actions.updateActions = bindActionCreators(saveField, dispatch);
  actions.updateFormFieldActions = bindActionCreators(updateFormField, dispatch);
  return actions;
};

export default connect(mapStateToProps, mapDispatchToProps)(VAProfileApp);
export { VAProfileApp };
