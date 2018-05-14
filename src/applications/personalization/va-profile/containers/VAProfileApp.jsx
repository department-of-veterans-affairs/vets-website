import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectUser, isLOA3 } from '../../../../platform/user/selectors';
import LegacyProfile from '../../../user-profile/containers/UserProfileApp';

import {
  startup,
  saveField,
  updateFormField,
  openModal,
  clearErrors,
  clearMessage
} from '../actions';
import BetaApp, { features } from '../../../beta-enrollment/containers/BetaApp';
import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';
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
          {!this.props.isLOA3 ? <LegacyProfile/> : (
            <BetaApp featureName={features.dashboard} redirect="/beta-enrollment/personalization/">
              <DowntimeNotification appTitle="user profile page" dependencies={[services.mvi, services.emis]}>
                <ProfileView
                  startup={this.props.startup}
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
            </BetaApp>
          )}
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: selectUser(state),
    isLOA3: isLOA3(state),
    profile: state.vaProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators({
    startup,
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
