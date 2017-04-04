import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { closeAlert } from '../actions';
import { isEmpty } from 'lodash';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <h4>
        To use Secure Messaging at this time, you need to be registered as a VA patient with a premium MyHealtheVet account.
        To register, <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">visit MyHealtheVet</a>.
        If you're registered, but you still can't access Secure Messaging, please call the Vets.gov Help Desk at 1-855-574-7286, Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).
      </h4>
    );
  } else {
    view = children;
  }

  return <div id="messaging-app" className="row">{view}</div>;
}

class MessagingApp extends React.Component {
  // this warning is rendered if the user has no triage teams
  renderWarningBanner() {
    if (this.props.folders && this.props.folders.length && isEmpty(this.props.recipients) && !this.props.loading.recipients) {
      const alertContent = (
        <div>
          <h4>Currently not assigned to a health care team</h4>
          <p>
            You can't send secure messages because you're not assigned to a VA health care team right now. Please call the Vets.gov Help Desk at 1-855-574-7286, Monday - Friday, 8:00 a.m. - 8:00 p.m. (ET).
          </p>
        </div>
      );

      return (
        <div className="messaging-warning-banner">
          <AlertBox
              content={alertContent}
              isVisible
              status="warning"/>
        </div>
        );
    }
    return null;
  }

  render() {
    return (
      <RequiredLoginView authRequired={3} serviceRequired={"messaging"} userProfile={this.props.profile} loginUrl={this.props.signInUrl}>
        <AppContent>
          <div id="messaging-app-header">
            <AlertBox
                content={this.props.alert.content}
                isVisible={this.props.alert.visible}
                onCloseAlert={this.props.closeAlert}
                scrollOnShow
                status={this.props.alert.status}/>
            <h1>Message your health care team</h1>
            {this.renderWarningBanner()}
          </div>
          {this.props.children}
        </AppContent>
      </RequiredLoginView>
    );
  }
}

MessagingApp.propTypes = {
  children: React.PropTypes.node
};

const mapStateToProps = (state) => {
  const msgState = state.health.msg;
  const userState = state.user;

  return {
    alert: msgState.alert,
    recipients: msgState.recipients.data,
    loading: msgState.loading,
    profile: userState.profile,
    signInUrl: userState.login.loginUrl.first
  };
};

const mapDispatchToProps = {
  closeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingApp);
