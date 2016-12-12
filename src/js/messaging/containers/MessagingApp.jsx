import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { closeAlert } from '../actions';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <p className="info-message">
        To use Secure Messaging, you need to be registered as a VA patient with a premium MyHealth<strong><em>e</em></strong>Vet account.
        To register, <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">visit MyHealth<strong><em>e</em></strong>Vet</a>.
        If you're registered, but you still can't access Secure Messaging, please call the Vets.gov Help Desk at 1-855-574-7286, Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).
      </p>
    );
  } else {
    view = children;
  }

  return <div id="messaging-app" className="row">{view}</div>;
}

class MessagingApp extends React.Component {
  render() {
    return (
      <RequiredLoginView authRequired={3} serviceRequired={"messaging"}>
        <AppContent>
          <div id="messaging-app-header">
            <AlertBox
                content={this.props.alert.content}
                isVisible={this.props.alert.visible}
                onCloseAlert={this.props.closeAlert}
                scrollOnShow
                status={this.props.alert.status}/>
            <h1>Message your health care team</h1>
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
  return {
    alert: state.alert
  };
};

const mapDispatchToProps = {
  closeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingApp);
