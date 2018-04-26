import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  fetchVaProfile,
  saveField,
  updateFormField,
  openModal,
  clearErrors
} from '../actions';

import BetaApp, { features } from '../../beta-enrollment/containers/BetaApp';
import RequiredLoginView from '../../../../platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';
import ProfileView from '../components/ProfileView';

class UserProfileApp extends React.Component {
  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          user={this.props.account}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <BetaApp featureName={features.dashboard} redirect="/beta-enrollment/personalization/">
            <DowntimeNotification appTitle="user profile page" dependencies={[services.mvi, services.emis]}>
              <ProfileView
                profile={this.props.profile}
                updateActions={this.props.updateActions}
                updateFormFieldActions={this.props.updateFormFieldActions}
                fetchVaProfile={this.props.fetchVaProfile}
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
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.user,
    profile: state.vaProfile
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators({
    fetchVaProfile,
    openModal,
    clearErrors
  }, dispatch);

  actions.updateActions = bindActionCreators(saveField, dispatch);
  actions.updateFormFieldActions = bindActionCreators(updateFormField, dispatch);
  return actions;
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
