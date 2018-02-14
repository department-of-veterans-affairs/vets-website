import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';
import MHVApp from '../../common/components/MHVApp';
import AlertBox from '../../common/components/AlertBox';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { mhvAccessError } from '../../common/utils/error-messages';
import { closeAlert } from '../actions';
import ButtonSettings from '../components/buttons/ButtonSettings';
import { isEmpty } from 'lodash';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = mhvAccessError;
  } else {
    view = children;
  }

  return <div id="messaging-app" className="row">{view}</div>;
}

class MessagingApp extends React.Component {
  // this warning is rendered if the user has no triage teams
  renderWarningBanner() {
    if (this.props.recipients && isEmpty(this.props.recipients) && !this.props.loading.recipients) {
      const headline = (<h4>Currently not assigned to a health care team</h4>);
      const alertContent = (
        <p>
          We’re sorry. It looks like you don’t have a VA health care team linked to your account in our system.
          To begin sending secure messages, please contact your health care team, and ask them to add you into the system.
          If you need more help, please call the Vets.gov Help Desk at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      );

      return (
        <div className="messaging-warning-banner">
          <AlertBox
            headline={headline}
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
      <RequiredLoginView
        authRequired={3}
        serviceRequired="messaging"
        userProfile={this.props.profile}>
        <DowntimeNotification appTitle="secure messaging tool" dependencies={[services.mhv]}>
          <MHVApp>
            <AppContent>
              <div id="messaging-app-header">
                <AlertBox
                  headline={this.props.alert.headline}
                  content={this.props.alert.content}
                  isVisible={this.props.alert.visible}
                  onCloseAlert={this.props.closeAlert}
                  scrollOnShow
                  status={this.props.alert.status}/>
                <div id="messaging-app-title">
                  <h1>Message your health care team</h1>
                  <ButtonSettings/>
                </div>
                {this.renderWarningBanner()}
              </div>
              {this.props.children}
            </AppContent>
          </MHVApp>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

MessagingApp.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = (state) => {
  const msgState = state.health.msg;
  const userState = state.user;

  return {
    alert: msgState.alert,
    recipients: msgState.recipients.data,
    loading: msgState.loading,
    profile: userState.profile
  };
};

const mapDispatchToProps = {
  closeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingApp);
