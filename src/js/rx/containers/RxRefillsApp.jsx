import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import { closeDisclaimer } from '../actions/disclaimer';
import { closeRefillModal, closeGlossaryModal } from '../actions/modals';
import { refillPrescription } from '../actions/prescriptions';
import Disclaimer from '../components/Disclaimer';
import ConfirmRefillModal from '../components/ConfirmRefillModal';
import GlossaryModal from '../components/GlossaryModal';

// This needs to be a React component for RequiredLoginView to pass down
// the isDataAvailable prop, which is only passed on failure.
function AppContent({ children, isDataAvailable }) {
  const unregistered = isDataAvailable === false;
  let view;

  if (unregistered) {
    view = (
      <p className="info-message">
        To refill prescriptions, you need to be registered as a VA patient through MyHealth<strong><em>e</em></strong>Vet.
        To register, <a href="https://www.myhealth.va.gov/web/myhealthevet/user-registration">visit MyHealth<strong><em>e</em></strong>Vet</a>.
        If you're registered but you don't see your prescriptions here, please call the Vets.gov Help Desk at 1-855-574-7286, Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).
      </p>
    );
  } else {
    view = children;
  }

  return <div className="rx-app">{view}</div>;
}

class RxRefillsApp extends React.Component {
  render() {
    return (
      <RequiredLoginView authRequired={3} serviceRequired={"rx"}>
        <AppContent>
          <div className="row">
            <Disclaimer
                isOpen={this.props.disclaimer.open}
                handleClose={this.props.closeDisclaimer}/>
            {this.props.children}
          </div>
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
        </AppContent>
      </RequiredLoginView>
    );
  }
}

RxRefillsApp.propTypes = {
  children: React.PropTypes.element
};

const mapStateToProps = (state) => {
  const modals = state.modals;

  return {
    disclaimer: state.disclaimer,
    glossaryModal: modals.glossary,
    refillModal: modals.refill
  };
};

const mapDispatchToProps = {
  closeDisclaimer,
  closeGlossaryModal,
  closeRefillModal,
  refillPrescription
};

export default connect(mapStateToProps, mapDispatchToProps)(RxRefillsApp);
