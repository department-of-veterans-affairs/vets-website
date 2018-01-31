import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';
import Modal from '../../common/components/Modal';
import MHVApp from '../../common/components/MHVApp';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { mhvAccessError } from '../../common/utils/error-messages';
import { closeModal } from '../actions/modal';
import Breadcrumbs from '../components/Breadcrumbs';

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

  return <div className="bb-app">{view}</div>;
}

export class HealthRecordsApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
        authRequired={3}
        serviceRequired="health-records"
        userProfile={this.props.profile}>
        <DowntimeNotification appTitle="health records tool" dependencies={[services.mhv]}>
          <MHVApp>
            <AppContent>
              <div>
                <div className="row">
                  <div className="columns small-12">
                    <Breadcrumbs location={this.props.location}/>
                    {this.props.children}
                  </div>
                </div>
                <Modal
                  cssClass="bb-modal"
                  contents={this.props.modal.content}
                  id="bb-glossary-modal"
                  onClose={this.props.closeModal}
                  title={this.props.modal.title}
                  visible={this.props.modal.visible}/>
              </div>
            </AppContent>
          </MHVApp>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

HealthRecordsApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const hrState = state.health.hr;
  const userState = state.user;

  return {
    modal: hrState.modal,
    profile: userState.profile
  };
};
const mapDispatchToProps = {
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthRecordsApp);
