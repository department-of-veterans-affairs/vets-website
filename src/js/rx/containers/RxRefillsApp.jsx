import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';
import MHVApp from '../../common/containers/MHVApp';
import Breadcrumbs from '../components/Breadcrumbs';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import { mhvAccessError } from '../../common/utils/error-messages';
import { closeRefillModal, closeGlossaryModal } from '../actions/modals';
import { refillPrescription } from '../actions/prescriptions';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

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

  return (
    <div className="rx-app">
      <div className="row">
        <div className="columns small-12">
          {view}
        </div>
      </div>
    </div>
  );
}

class RxRefillsApp extends React.Component {
  render() {
    return (
      <RequiredLoginView
        verify
        serviceRequired="rx"
        user={this.props.user}>
        <DowntimeNotification appTitle="prescription refill tool" dependencies={[services.mhv]}>
          <AppContent>
            <Breadcrumbs location={this.props.location} prescription={this.props.prescription}/>
            <MHVApp>
              {this.props.children}
              <ConfirmRefillModal
                prescription={this.props.refillModal.prescription}
                isLoading={this.props.refillModal.loading}
                isVisible={this.props.refillModal.visible}
                refillPrescription={this.props.refillPrescription}
                onCloseModal={this.props.closeRefillModal}/>
              <GlossaryModal
                content={this.props.glossaryModal.content}
                isVisible={this.props.glossaryModal.visible}
                onCloseModal={this.props.closeGlossaryModal}/>
            </MHVApp>
          </AppContent>
        </DowntimeNotification>
      </RequiredLoginView>
    );
  }
}

RxRefillsApp.propTypes = {
  children: PropTypes.element
};

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  const { modals, prescriptions } = rxState;

  return {
    glossaryModal: modals.glossary,
    refillModal: modals.refill,
    prescription: prescriptions.currentItem,
    user: state.user
  };
};

const mapDispatchToProps = {
  closeGlossaryModal,
  closeRefillModal,
  refillPrescription
};

export default connect(mapStateToProps, mapDispatchToProps)(RxRefillsApp);
